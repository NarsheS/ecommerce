import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Roles } from "../common/roles/roles.decorator";
import { Role } from "../user/user.entity";
import { FilesInterceptor } from "@nestjs/platform-express";
import { Public } from "../common/decorators/public.decorator";

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // POST - Cria um produto novo (apenas admin)
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateProductDto) {
    return this.productsService.addProduct(dto);
  }

  // POST - Atribui uma imagem a um produto a partir do id do mesmo (apenas admin)
  @Post(':productId/images')
  @Roles(Role.ADMIN)
  @UseInterceptors(FilesInterceptor('images'))
  async upload(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.productsService.addImages(productId, files);
  }

  // DELETE - Deleta uma imagem atribuída a um produto
  @Delete(':productId/images/:imageId')
  @Roles(Role.ADMIN)
  async deleteImage(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    return this.productsService.deleteImage(productId, imageId);
  }

  // DELETE - Deleta todas as imagens de um produto
  @Delete(':productId/images')
  @Roles(Role.ADMIN)
  async deleteAllImage(@Param('productId', ParseIntPipe) productId: number) {
    return this.productsService.deleteAllImages(productId);
  }

  // GET - Lista todos os produtos no DB
  @Get()
  @Public()
  findAll(@Query('search') search?: string) {
    return this.productsService.getAllProducts(search);
  }

  // GET - Busca um produto específico pelo id
  @Get(':id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getOneProduct(id);
  }

  // UPDATE - Atualiza um produto existente (Apenas admin)
  @Put(':id')
  @Roles(Role.ADMIN)
  update(@Param('id', ParseIntPipe) id: number,@Body() dto: UpdateProductDto,) {
    return this.productsService.updateProduct(id, dto);
  }

  // DELETE - Deleta um produto existente (Apenas admin)
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteProduct(id);
  }
}
