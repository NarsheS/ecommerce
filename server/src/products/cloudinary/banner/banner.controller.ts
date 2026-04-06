import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { BannerService } from "./banner.service"

@Controller("banners")
export class BannerController {
  constructor(private readonly service: BannerService) {}

  @Get()
  findAll() {
    return this.service.findAll()
  }

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any
  ) {
    console.log("FILE:", file) // 👈 aqui
    return this.service.create(file, body)
  }

  @Patch(":id")
  @UseInterceptors(FileInterceptor("file"))
  update(
    @Param("id") id: number,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.service.update(Number(id), body, file)
  }

  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.service.remove(Number(id))
  }
}