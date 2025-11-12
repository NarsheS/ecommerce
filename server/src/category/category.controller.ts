import { Controller, Post, Body, Get, Delete, ParseIntPipe, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.createCategory(dto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAllCategories();
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number){
    return this.categoryService.deleteCategory(id);
  }
}
