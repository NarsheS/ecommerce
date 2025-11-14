import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "./order.entity";
import { OrderItem } from "./order-item.entity";
import { Cart } from "src/cart/cart.entity";
import { CartItem } from "src/cart/cart-item.entity";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
  ) {}

  async createOrder(userId: number) {
    const cart = await this.cartRepo.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!cart) throw new NotFoundException('Cart not found');
    if (cart.items.length === 0) throw new BadRequestException('Cart is empty');

    let total = 0;

    // create the order
    const order = this.orderRepo.create({
      user: { id: userId } as any,
      items: [],
      total: 0,
    });

    for (const item of cart.items) {
      const price = Number(item.product.price);
      const subtotal = price * item.quantity;

      const orderItem = this.orderItemRepo.create({
        product: item.product,       // ManyToOne expects entity, not ID
        quantity: item.quantity,
        price: price,
        subtotal: subtotal,
      });

      total += subtotal;
      order.items.push(orderItem);
    }

    order.total = total;

    const savedOrder = await this.orderRepo.save(order);

    // clear the cart
    await this.cartItemRepo.remove(cart.items);

    return savedOrder;
  }

  async getUserOrders(userId: number) {
    return this.orderRepo.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }
}
