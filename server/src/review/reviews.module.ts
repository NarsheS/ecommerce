import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Products } from '../products/products.entity';
import { User } from '../user/user.entity';
import { Order } from '../order/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, Products, User, Order]),
  ],
  providers: [ReviewsService],
  controllers: [ReviewsController],
})
export class ReviewsModule {}