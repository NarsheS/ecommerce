import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './products.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Category } from 'src/category/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Products, Category])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService], // optional if other modules need it
})
export class ProductsModule {}
