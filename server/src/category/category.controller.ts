import { Controller, Post, Body, Get, Delete, ParseIntPipe, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Roles } from 'src/common/roles/roles.decorator';
import { Role } from 'src/user/user.entity';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // POST - Cria uma nova categoria
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.createCategory(dto);
  }

  // GET - Lista todas as categorias
  @Get()
  findAll() {
    return this.categoryService.findAllCategories();
  }

  // DELETE - Deleta uma categoria
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number){
    return this.categoryService.deleteCategory(id);
  }
}
