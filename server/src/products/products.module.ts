import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './products.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Category } from '../category/category.entity';
import { ProductImage } from './cloudinary/productImage.entity';
import { UploadModule } from './cloudinary/upload.module';
import { DiscountModule } from './sales/discount.module';
import { PricingService } from './pricing/pricing.service';
import { PricingModule } from './pricing/pricing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Products, ProductImage, Category]), 
    UploadModule,
    DiscountModule,
    PricingModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, PricingService],
  exports: [ProductsService, PricingService], // optional if other modules need it
})
export class ProductsModule {}
