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
    const exists = await this.productsRepo.findOne({ where: { name: dto.name } });
    if (exists) throw new ConflictException('Este produto já está registrado!');

    let category: Category | null = null;

    if (dto.categoryId) {
      category = await this.CategoryRepo.findOne({ where: { id: dto.categoryId } });
      if (!category) throw new NotFoundException('Categoria não encontrada');
    }

    const product = this.productsRepo.create({
      ...dto,
      ...(category ? { category } : {}), // adiciona categoria apenas se tiver definido uma
    });

    return this.productsRepo.save(product);
  }

  async getAllProducts() {
    return this.productsRepo.find();
  }

  async getOneProduct(id: number) {
    const product = await this.productsRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException("Produto não encontrado.");
    return product;
  }

  async updateProduct(id: number, dto: UpdateProductDto) {
    const product = await this.getOneProduct(id); // reusa verificação
    Object.assign(product, dto);
    return this.productsRepo.save(product);
  }

  async deleteProduct(id: number) {
    const product = await this.getOneProduct(id);
    return this.productsRepo.remove(product);
  }
}
