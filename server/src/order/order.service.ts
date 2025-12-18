import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "./order.entity";
import { OrderItem } from "./order-item.entity";
import { Cart } from "../cart/cart.entity";
import { CartItem } from "../cart/cart-item.entity";
import { DiscountService } from "../products/sales/discount.service";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
    private readonly discountService: DiscountService,
  ) {}

  async createOrder(userId: number) {
    const cart = await this.cartRepo.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!cart) throw new NotFoundException('Cart not found');
    if (cart.items.length === 0) throw new BadRequestException('Cart is empty');

    const order = await this.orderRepo.save(
      this.orderRepo.create({
        user: { id: userId } as any,
        total: 0,
        discountTotal: 0,
      })
    );

    let total = 0;
    let totalDiscount = 0;

    const orderItems: OrderItem[] = [];

    for (const item of cart.items) {
      const productWithDiscount =
        await this.discountService.applyAutomaticDiscount(item.product);

      const originalPrice = Number(item.product.price);
      const finalPrice = productWithDiscount.finalPrice ?? originalPrice;
      const discountApplied = originalPrice - finalPrice;

      const subtotal = finalPrice * item.quantity;

      const orderItem = this.orderItemRepo.create({
        order: order,
        product: item.product,
        quantity: item.quantity,
        price: originalPrice,
        finalPrice: finalPrice,
        discountApplied: discountApplied,
        subtotal: subtotal,
      });

      orderItems.push(orderItem);

      total += subtotal;
      totalDiscount += discountApplied * item.quantity;
    }

    await this.orderItemRepo.save(orderItems);

    order.total = total;
    order.discountTotal = totalDiscount;

    await this.orderRepo.save(order);

    // limpa o carrinho
    await this.cartItemRepo.remove(cart.items);

    return this.orderRepo.findOne({
      where: { id: order.id },
      relations: ['items', 'items.product'],
    });
  }


  async getUserOrders(userId: number) {
    return this.orderRepo.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }
}
