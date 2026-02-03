import { Module } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { DiscountModule } from '../sales/discount.module';

@Module({
  imports: [DiscountModule], // porque o Pricing usa DiscountService
  providers: [PricingService],
  exports: [PricingService], // 👈 permite outros módulos usarem
})
export class PricingModule {}
