import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Req,
  Patch,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateReviewDto) {
    return this.reviewsService.createReview(req.user.id, dto);
  }

  @Get('/product/:id')
  getByProduct(@Param('id') id: number) {
    return this.reviewsService.getProductReviews(id);
  }

  @Get('/me')
  getMyReviews(@Req() req) {
    return this.reviewsService.getUserReviews(req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: number, @Req() req) {
    return this.reviewsService.deleteReview(id, req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Req() req,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewsService.updateReview(id, req.user, dto);
  }
}