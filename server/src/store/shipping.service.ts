import { Injectable, BadRequestException } from "@nestjs/common";
import { StoreService } from "./store.service";
import type { ShippingResult } from "./types/shipping.type";

@Injectable()
export class ShippingService {
  constructor(
    private readonly storeService: StoreService,
  ) {}

  async calculate(zipcode: string, itemsCount: number = 1): Promise<ShippingResult> {
    if (!zipcode) {
      throw new BadRequestException("Zipcode is required");
    }

    if (itemsCount <= 0) {
      itemsCount = 1;
    }

    const store = await this.storeService.getSettings();

    if (!store.shippingOrigin) {
      throw new BadRequestException("Store origin address not configured");
    }

    // sanitiza CEP
    const cleanZipcode = zipcode.replace(/\D/g, "");
    const cleanOriginZip = store.shippingOrigin.zipcode.replace(/\D/g, "");

    let baseCost = 0;
    let estimatedDays = 0;

    if (cleanZipcode.startsWith(cleanOriginZip.substring(0, 2))) {
      baseCost = 10;
      estimatedDays = 2;
    } else {
      baseCost = 20;
      estimatedDays = 5;
    }

    const extra = itemsCount > 1 ? (itemsCount - 1) * 2 : 0;

    const finalCost = baseCost + extra;

    return {
      cost: Number(finalCost.toFixed(2)),
      estimatedDays,
    };
  }
}