import { Controller, Post, Body } from "@nestjs/common";
import { ShippingService } from "./shipping.service";
import type { ShippingResult } from "./types/shipping.type";

@Controller("shipping")
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post("calculate")
  async calculate(
    @Body() body: { zipcode: string; itemsCount: number }
  ): Promise<ShippingResult> {
    return this.shippingService.calculate(
      body.zipcode,
      body.itemsCount
    );
  }
}