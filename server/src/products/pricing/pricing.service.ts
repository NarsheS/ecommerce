import { Injectable } from "@nestjs/common";
import { Products } from "../products.entity";
import { DiscountService } from "../sales/discount.service";

export interface ProductPricing {
  originalPrice: number;
  finalPrice: number;
  discountAmount: number;
  discountPercentage: number;
  hasDiscount: boolean;
}

@Injectable()
export class PricingService {
  constructor(private readonly discountService: DiscountService) {}

  async calculate(product: Products): Promise<ProductPricing> {
    const productWithDiscount =
      await this.discountService.applyAutomaticDiscount(product);

    const originalPrice = Number(product.price);
    const finalPrice = productWithDiscount.finalPrice ?? originalPrice;
    const discountAmount = originalPrice - finalPrice;

    return {
      originalPrice,
      finalPrice,
      discountAmount,
      discountPercentage:
        discountAmount > 0
          ? Math.round((discountAmount / originalPrice) * 100)
          : 0,
      hasDiscount: discountAmount > 0,
    };
  }
}
