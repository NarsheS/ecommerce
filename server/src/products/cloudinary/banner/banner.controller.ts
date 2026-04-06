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
import { Roles } from "../../../common/roles/roles.decorator";
import { Role } from "../../../user/user.entity";

@Controller("banners")
export class BannerController {
  constructor(private readonly service: BannerService) {}

  @Get()
  findAll() {
    return this.service.findAll()
  }

  @Get("admin")
  @Roles(Role.ADMIN)
  findAllAdmin() {
    return this.service.findAllAdmin()
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor("file"))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any
  ) {
    console.log("FILE:", file) // 👈 aqui
    return this.service.create(file, body)
  }

  @Patch(":id")
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor("file"))
  update(
    @Param("id") id: string,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.service.update(Number(id), body, file)
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  remove(@Param("id") id: number) {
    return this.service.remove(Number(id))
  }

  @Patch(":id/toggle")
  @Roles(Role.ADMIN)
  toggle(@Param("id") id: string) {
    return this.service.toggleActive(Number(id))
  }
}