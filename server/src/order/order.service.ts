import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "./order.entity";
import { OrderItem } from "./order-item.entity";
import { Cart } from "../cart/cart.entity";
import { CartItem } from "../cart/cart-item.entity";
import { PricingService } from "src/products/pricing/pricing.service";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
    private readonly pricingService: PricingService,
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
      const pricing = await this.pricingService.calculate(item.product);

      const originalPrice = pricing.originalPrice;
      const finalPrice = pricing.finalPrice;
      const discountApplied = pricing.discountAmount;
      const subtotal = finalPrice * item.quantity;

      const orderItem = this.orderItemRepo.create({
        order,
        product: item.product,
        quantity: item.quantity,
        price: originalPrice,
        finalPrice,
        discountApplied,
        subtotal,
      });

      orderItems.push(orderItem);

      total += subtotal;
      totalDiscount += discountApplied * item.quantity;
    }

    await this.orderItemRepo.save(orderItems);

    order.total = Number(total.toFixed(2));
    order.discountTotal = Number(totalDiscount.toFixed(2));
    await this.orderRepo.save(order);

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
