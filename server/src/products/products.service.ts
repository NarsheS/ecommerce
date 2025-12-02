import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Products } from "./products.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Category } from "src/category/category.entity";
import { ProductImage } from "./cloudinary/productImage.entity";
import { UploadService } from "./cloudinary/upload.service";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productsRepo: Repository<Products>,
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
    @InjectRepository(ProductImage)
    private imageRepo: Repository<ProductImage>,
    private readonly uploadService: UploadService,
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
        const found = await this.categoryRepo.findOne({
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

  async addImages(id: number, files: Express.Multer.File[]) {
    const product = await this.productsRepo.findOne({
      where: { id },
      relations: ['images'],
    });

    if (!product) throw new NotFoundException('Produto não encontrado');

    const uploaded: ProductImage[] = [];

    for (const file of files) {
      const url = await this.uploadService.uploadImage(file);

      const newImage = this.imageRepo.create({
        url,
        product
      });

      uploaded.push(await this.imageRepo.save(newImage));
    }

    return uploaded;
  }


  async getAllProducts() {
    return this.productsRepo.find({ relations: ['category', 'images'] });
  }

  async getOneProduct(id: number) {
    const product = await this.productsRepo.findOne({
      where: { id },
      relations: ['category', 'images'],
    });

    if (!product) throw new NotFoundException("Produto não encontrado.");
    return product;
  }

  async updateProduct(id: number, dto: UpdateProductDto) {
    const product = await this.getOneProduct(id);
    const { categoryId, ...changes } = dto;

    if (categoryId) {
      const category = await this.categoryRepo.findOne({ where: { id: categoryId } });
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
