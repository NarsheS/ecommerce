import { Controller, Post, UseGuards, Req, Get } from "@nestjs/common";
import { OrderService } from "./order.service";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/roles/roles.guard";

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('checkout')
  createOrder(@Req() req) {
    return this.orderService.createOrder(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  getUserOrders(@Req() req) {
    return this.orderService.getUserOrders(req.user.userId);
  }
}
