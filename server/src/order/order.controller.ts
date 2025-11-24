import { Controller, Post, Req, Get } from "@nestjs/common";
import { OrderService } from "./order.service";

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('checkout')
  createOrder(@Req() req) {
    return this.orderService.createOrder(req.user.userId);
  }

  @Get()
  getUserOrders(@Req() req) {
    return this.orderService.getUserOrders(req.user.userId);
  }
}
