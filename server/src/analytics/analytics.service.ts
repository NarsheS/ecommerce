import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order, OrderStatus } from "../order/order.entity";

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async getSales(days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await this.orderRepo
      .createQueryBuilder("order")
      .select("DATE(order.createdAt)", "date")
      .addSelect("SUM(order.total)", "total")
      .where("order.status = :status", { status: OrderStatus.PAID })
      .andWhere("order.createdAt >= :startDate", { startDate })
      .groupBy("DATE(order.createdAt)")
      .orderBy("date", "ASC")
      .getRawMany();

    return result.map(item => ({
      date: item.date,
      total: Number(item.total),
    }));
  }
}