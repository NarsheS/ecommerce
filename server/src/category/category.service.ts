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

  // CREATE - Cria uma nova categoria
  async createCategory(dto: CreateCategoryDto) {
    // Verifica se ja existe essa categoria e impede caso exista
    const exists = await this.categoryRepo.findOne({ where: { name: dto.name } });
    if (exists) throw new ConflictException('Categoria já existe');

    // Cria a categoria
    const category = this.categoryRepo.create(dto);
    return this.categoryRepo.save(category);
  }

  // GET - Lista todas as categorias
  findAllCategories() {
    return this.categoryRepo.find();
  }

  // DELETE - Deleta uma categoria
  async deleteCategory(categoryId: number){
    // Procura pela categoria, se não encontrar ou não existir impede a remoção
    const category = await this.categoryRepo.findOne({ where: { id: categoryId } });
    if (!category) throw new NotFoundException("Essa categoria não existe");

    // Remove a categoria
    return this.categoryRepo.remove(category);
  }
}
