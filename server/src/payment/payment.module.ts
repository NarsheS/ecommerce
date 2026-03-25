import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../order/order.entity';
import { ConfigModule } from '@nestjs/config';
import { Products } from '../products/products.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Products]),
    ConfigModule
],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
