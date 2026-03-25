import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThan } from "typeorm";
import { Order, OrderStatus } from "./order.entity";
import { Products } from "../products/products.entity";

@Injectable()
export class OrderCleanupService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(Products)
    private productRepo: Repository<Products>,
  ) {}

  @Cron('*/1 * * * *')
  async handleExpiredOrders() {
    const expiredOrders = await this.orderRepo.find({
      where: {
        status: OrderStatus.RESERVED,
        expiresAt: LessThan(new Date()),
      },
      relations: ['items', 'items.product'],
    });

    for (const order of expiredOrders) {

      // 🔥 proteção contra race condition
      if (order.status !== OrderStatus.RESERVED) continue;

      // 🔥 devolve estoque
      for (const item of order.items) {
        item.product.inStock += item.quantity;
        await this.productRepo.save(item.product);
      }

      order.status = OrderStatus.CANCELLED;
      await this.orderRepo.save(order);
    }
  }
}