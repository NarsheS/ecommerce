import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Products } from "./products.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Category } from "src/category/category.entity";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productsRepo: Repository<Products>,
    @InjectRepository(Category)
    private CategoryRepo: Repository<Category>,
  ) {}

  async addProduct(dto: CreateProductDto) {
    const exists = await this.productsRepo.findOne({
      where: { name: dto.name },
    });

    if (exists) {
      throw new ConflictException('Este produto já está registrado!');
    }

    const { categoryId, ...data } = dto;

    let category: Category | null = null;
    
    if (categoryId !== undefined) {
      if (categoryId === null) {
        category = null;
      }

      else {
        const found = await this.CategoryRepo.findOne({
          where: { id: categoryId },
        });

        if (!found) {
          throw new NotFoundException('Categoria não encontrada');
        }

        category = found;
      }
    }

    const product = this.productsRepo.create(
      category
        ? { ...data, category }
        : { ...data }
    );

    return this.productsRepo.save(product);
  }


  async getAllProducts() {
    return this.productsRepo.find({ relations: ['category'] });
  }

  async getOneProduct(id: number) {
    const product = await this.productsRepo.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) throw new NotFoundException("Produto não encontrado.");
    return product;
  }

  async updateProduct(id: number, dto: UpdateProductDto) {
    const product = await this.getOneProduct(id);
    const { categoryId, ...changes } = dto;

    if (categoryId) {
      const category = await this.CategoryRepo.findOne({ where: { id: categoryId } });
      if (!category) throw new NotFoundException('Categoria não encontrada');
      product.category = category;
    }

    Object.assign(product, changes);

    return this.productsRepo.save(product);
  }

  async deleteProduct(id: number) {
    const product = await this.getOneProduct(id);
    await this.productsRepo.remove(product);
    return { message: 'Produto deletado com sucesso' };
  }
}
