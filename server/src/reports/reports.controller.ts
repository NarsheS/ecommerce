import {
  Controller,
  Get,
  Res,
  Query,
} from "@nestjs/common";
import type { Response } from "express";
import { ReportsService } from "./reports.service";
import { Roles } from "../common/roles/roles.decorator";
import { Role } from "../user/user.entity";

@Controller("reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get("orders/csv")
  @Roles(Role.ADMIN)
  async downloadCsv(
    @Res() res: Response,
    @Query("days") days?: string,
  ) {
    const csv = await this.reportsService.generateOrdersCsv(
      days ? Number(days) : 30
    );

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=orders.csv"
    );

    return res.send(csv);
  }

}