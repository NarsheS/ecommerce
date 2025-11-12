import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  async createCategory(dto: CreateCategoryDto) {
    const exists = await this.categoryRepo.findOne({ where: { name: dto.name } });
    if (exists) throw new ConflictException('Categoria já existe');
    const category = this.categoryRepo.create(dto);
    return this.categoryRepo.save(category);
  }

  findAllCategories() {
    return this.categoryRepo.find();
  }

  async deleteCategory(categoryId: number){
    const category = await this.categoryRepo.findOne({ where: { id: categoryId } });
    if (!category) throw new NotFoundException("Essa categoria não existe");

    return this.categoryRepo.remove(category);
  }
}
