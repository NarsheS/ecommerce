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

  // POST - CREATE
  async addProduct(dto: CreateProductDto) {
    const exists = await this.productsRepo.findOne({
      where: { name: dto.name },
    });

    if (exists) throw new ConflictException('Este produto já está registrado!');

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

  // POST - Atribui imagens a um produto
  async addImages(id: number, files: Express.Multer.File[]) {
    const product = await this.productsRepo.findOne({
      where: { id },
      relations: ['images'],
    });

    if (!product) throw new NotFoundException('Produto não encontrado');

    const savedImages: ProductImage[] = [];

    for (const file of files) {
      const uploadResult = await this.uploadService.uploadImage(file);

      const newImage = this.imageRepo.create({
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        product,
      });

      const saved = await this.imageRepo.save(newImage);
      savedImages.push(saved);
    }

    return savedImages;
  }

  // DELETE - Remove uma imagem de um produto
  async deleteImage(productId: number, imageId: number) {
    const image = await this.imageRepo.findOne({
      where: { id: imageId },
      relations: ['product'],
    });

    if (!image) throw new NotFoundException('Imagem não encontrada');
    if (image.product.id !== productId) {
      throw new ConflictException('Esta imagem não pertence ao produto informado');
    }

    // Remove do Cloudinary
    await this.uploadService.deleteImageFromCloudinary(image.publicId);

    // Remove do banco
    await this.imageRepo.remove(image);

    return { message: 'Imagem removida com sucesso' };
  }

  // DELETE - Deleta todas as imagens de um produto
  async deleteAllImages(productId: number) {
    const product = await this.productsRepo.findOne({
      where: { id: productId },
      relations: ['images'],
    });

    if (!product) throw new NotFoundException('Produto não encontrado');
    if (!product.images || product.images.length === 0) {
      return { message: 'Este produto não possui imagens' };
    }

    // Deletar do Cloudinary
    for (const image of product.images) {
      await this.uploadService.deleteImageFromCloudinary(image.publicId);
    }

    // Deletar do banco
    await this.imageRepo.remove(product.images);

    return { message: 'Todas as imagens foram removidas com sucesso' };
  }

  // GET - Lista todos os produtos
  async getAllProducts() {
    return this.productsRepo.find({ relations: ['category', 'images'] });
  }

  // GET - Lista apenas um produto
  async getOneProduct(id: number) {
    const product = await this.productsRepo.findOne({
      where: { id },
      relations: ['category', 'images'],
    });

    if (!product) throw new NotFoundException("Produto não encontrado.");
    return product;
  }

  // UPDATE - Atualiza os campos desejados de um produto
  async updateProduct(id: number, dto: UpdateProductDto) {
    const product = await this.getOneProduct(id);
    const { categoryId, ...changes } = dto;

    // Esse trecho atualiza a categoria do produto se necessário
    if (categoryId) {
      const category = await this.categoryRepo.findOne({ where: { id: categoryId } });
      if (!category) throw new NotFoundException('Categoria não encontrada');
      product.category = category;
    }

    Object.assign(product, changes);

    return this.productsRepo.save(product);
  }

  // DELETE - Deleta o produto pelo id
  async deleteProduct(id: number) {
    const product = await this.getOneProduct(id);
    await this.productsRepo.remove(product);
    return { message: 'Produto deletado com sucesso' };
  }
}
