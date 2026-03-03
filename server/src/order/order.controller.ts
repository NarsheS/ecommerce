import { Controller, Post, Req, Get, Query, Patch, Param, Body, ParseIntPipe } from "@nestjs/common";
import { OrderService } from "./order.service";
import { Roles } from "src/common/roles/roles.decorator";
import { Role } from "src/user/user.entity";
import { OrderStatus } from "./order.entity";

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

  @Roles(Role.ADMIN)
  @Get('admin')
  getAllOrders(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.orderService.getAllOrders(Number(page), Number(limit));
  }

  @Roles(Role.ADMIN)
  @Patch('admin/:id/status')
  updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: OrderStatus
  ) {
    return this.orderService.updateStatus(id, status);
  }

  @Roles(Role.ADMIN)
  @Get('admin/:id')
  getOrderDetails(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getOrderDetails(id);
  }
}
