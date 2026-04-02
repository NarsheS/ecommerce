import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Banner } from "./banner.entity"
import { BannerService } from "./banner.service"
import { BannerController } from "./banner.controller"
import { UploadService } from "../upload.service"
import { CloudinaryProvider } from "../cloudinary.provider"

@Module({
  imports: [
    TypeOrmModule.forFeature([Banner]),
],
  controllers: [BannerController],
  providers: [
    BannerService,
    UploadService,
    CloudinaryProvider
  ],
})
export class BannerModule {}