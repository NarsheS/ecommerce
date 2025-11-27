import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/order/order.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
