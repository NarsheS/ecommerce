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

  // 1️⃣ primeiro cria a Order vazia
  const order = await this.orderRepo.save(
    this.orderRepo.create({
      user: { id: userId } as any,
      total: 0,
    })
  );

  let total = 0;
  const orderItems: OrderItem[] = [];

  // 2️⃣ agora cria os OrderItems apontando para a order já salva
  for (const item of cart.items) {
    const price = Number(item.product.price);
    const subtotal = price * item.quantity;

    const orderItem = this.orderItemRepo.create({
      order: order,            // agora a order já tem ID ✔
      product: item.product,
      quantity: item.quantity,
      price,
      subtotal,
    });

    orderItems.push(orderItem);
    total += subtotal;
  }

  // 3️⃣ salva TODOS itens de uma vez
  await this.orderItemRepo.save(orderItems);

  // 4️⃣ atualiza o total
  order.total = total;
  await this.orderRepo.save(order);

  // 5️⃣ limpa o carrinho
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
