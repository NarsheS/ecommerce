import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { OrderService } from './order.service';
import { Cart } from '../cart/cart.entity';
import { CartItem } from '../cart/cart-item.entity';
import { OrderController } from './order.controller';
import { PricingModule } from '../products/pricing/pricing.module';
import { Address } from '../address/address.entity';
import { OrderCleanupService } from './orderCleanup.service';
import { Products } from '../products/products.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Cart, CartItem, Address, Products]),
    PricingModule
  ],
  providers: [OrderService, OrderCleanupService],
  controllers: [OrderController],
})
export class OrderModule {}
