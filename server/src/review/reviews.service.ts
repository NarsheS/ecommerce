import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Review } from './review.entity';
import { Products } from '../products/products.entity';
import { User } from '../user/user.entity';
import { Order } from '../order/order.entity';
import { OrderStatus } from '../order/order.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,

    @InjectRepository(Products)
    private productRepo: Repository<Products>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    private dataSource: DataSource,
  ) {}

  async createReview(userId: number, dto: CreateReviewDto) {
    const { productId, rating, comment } = dto;

    // 1. Verifica produto
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });

    if (!product) throw new NotFoundException('Produto não encontrado');

    // 2. Verifica se já avaliou
    const alreadyReviewed = await this.reviewRepo.findOne({
      where: {
        user: { id: userId },
        product: { id: productId },
      },
      relations: ['user', 'product'],
    });

    if (alreadyReviewed) {
      throw new ConflictException('Você já avaliou este produto');
    }

    // 3. Verifica se comprou (via OrderItem)
    const hasBought = await this.dataSource
      .createQueryBuilder()
      .select('1')
      .from('orders', 'o')
      .innerJoin('order_items', 'oi', 'oi.orderId = o.id')
      .where('o.userId = :userId', { userId })
      .andWhere('oi.productId = :productId', { productId })
      .andWhere('o.status IN (:...validStatus)', {
        validStatus: [
          OrderStatus.PAID,
          OrderStatus.SHIPPED,
          OrderStatus.COMPLETED,
        ],
      })
      .getExists();

    if (!hasBought) {
      throw new BadRequestException(
        'Você só pode avaliar produtos que comprou',
      );
    }

    // 4. Cria review
    const review = this.reviewRepo.create({
      rating,
      comment,
      user: { id: userId },
      product: { id: productId },
    });

    await this.reviewRepo.save(review);

    // 5. Atualiza média (SQL otimizado)
    const stats = await this.reviewRepo
      .createQueryBuilder('r')
      .select('AVG(r.rating)', 'avg')
      .addSelect('COUNT(r.id)', 'count')
      .where('r.productId = :productId', { productId })
      .getRawOne();

    product.averageRating = Number(stats.avg) || 0;
    product.reviewCount = Number(stats.count) || 0;

    await this.productRepo.save(product);

    return review;
  }

  async getProductReviews(productId: number) {
    return this.reviewRepo.find({
      where: { product: { id: productId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getUserReviews(userId: number) {
    return this.reviewRepo.find({
      where: { user: { id: userId } },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  async deleteReview(reviewId: number, user: any) {
    const review = await this.reviewRepo.findOne({
      where: { id: reviewId },
      relations: ['user', 'product'],
    });

    if (!review) throw new NotFoundException('Review não encontrado');

    if (review.user.id !== user.id && user.role !== 'admin') {
      throw new ConflictException('Você não pode deletar este review');
    }

    await this.reviewRepo.remove(review);

    // Recalcula média
    const stats = await this.reviewRepo
      .createQueryBuilder('r')
      .select('AVG(r.rating)', 'avg')
      .addSelect('COUNT(r.id)', 'count')
      .where('r.productId = :productId', {
        productId: review.product.id,
      })
      .getRawOne();

    review.product.averageRating = Number(stats.avg) || 0;
    review.product.reviewCount = Number(stats.count) || 0;

    await this.productRepo.save(review.product);

    return { message: 'Review removido com sucesso' };
  }

  async updateReview(
    reviewId: number,
    user: any,
    dto: UpdateReviewDto,
  ) {
    const review = await this.reviewRepo.findOne({
      where: { id: reviewId },
      relations: ['user', 'product'],
    });

    if (!review) throw new NotFoundException('Review não encontrado');

    // Permissão
    if (review.user.id !== user.id && user.role !== 'admin') {
      throw new ConflictException('Você não pode editar este review');
    }

    // Atualiza campos
    if (dto.rating !== undefined) {
      review.rating = dto.rating;
    }

    if (dto.comment !== undefined) {
      review.comment = dto.comment;
    }

    await this.reviewRepo.save(review);

    // Recalcula média
    const stats = await this.reviewRepo
      .createQueryBuilder('r')
      .select('AVG(r.rating)', 'avg')
      .addSelect('COUNT(r.id)', 'count')
      .where('r.productId = :productId', {
        productId: review.product.id,
      })
      .getRawOne();

    review.product.averageRating = Number(stats.avg) || 0;
    review.product.reviewCount = Number(stats.count) || 0;

    await this.productRepo.save(review.product);

    return review;
  }
}