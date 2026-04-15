import { Controller, Get, Query } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";
import { Roles } from "../common/roles/roles.decorator";
import { Role } from "../user/user.entity";

@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("sales")
  @Roles(Role.ADMIN)
  async getSales(@Query("days") days?: string) {
    const parsedDays = Number(days) || 7;

    return this.analyticsService.getSales(parsedDays);
  }
}