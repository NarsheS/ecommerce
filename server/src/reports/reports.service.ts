import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThan } from "typeorm";
import { Order, OrderStatus } from "../order/order.entity";

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async generateOrdersCsv(days: number = 30): Promise<string> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await this.orderRepo.find({
      where: {
        status: OrderStatus.PAID,
        createdAt: MoreThan(startDate),
      },
      relations: ["user", "address"],
      order: { createdAt: "DESC" },
    });

    // HEADER CSV
    const header = [
      "ID",
      "Cliente",
      "Email",
      "Total",
      "Frete",
      "Cidade",
      "Estado",
      "Data",
    ];

    const rows = orders.map((order) => [
      order.id,
      order.user?.username || "N/A",
      order.user?.email || "N/A",
      Number(order.total).toFixed(2),
      Number(order.shippingCost).toFixed(2),
      order.address?.city || "",
      order.address?.state || "",
      order.createdAt.toISOString(),
    ]);

    const csvContent =
      [header, ...rows]
        .map((row) => row.join(","))
        .join("\n");

    return csvContent;
  }
}