import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Roles } from "src/common/roles/roles.decorator";
import { Role } from "src/user/user.entity";
import { FilesInterceptor } from "@nestjs/platform-express";

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateProductDto) {
    return this.productsService.addProduct(dto);
  }

  @Post(':id/images')
  @Roles(Role.ADMIN)
  @UseInterceptors(FilesInterceptor('images'))
  async upload(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.productsService.addImages(id, files);
  }

  @Get()
  findAll() {
    return this.productsService.getAllProducts();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getOneProduct(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  update(@Param('id', ParseIntPipe) id: number,@Body() dto: UpdateProductDto,) {
    return this.productsService.updateProduct(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteProduct(id);
  }
}
