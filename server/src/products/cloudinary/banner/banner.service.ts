import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Banner } from "./banner.entity"
import { UploadService } from "../upload.service"

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private repo: Repository<Banner>,
    private uploadService: UploadService
  ) {}

  async findAll() {
    return this.repo.find({
      where: { isActive: true },
      order: { order: "ASC" }
    })
  }

  async findAllAdmin() {
    return this.repo.find({
      order: { order: "ASC" }
    })
  }

  async create(
    file: Express.Multer.File,
    data: { title?: string; link?: string; order?: number }
  ) {
    const upload = await this.uploadService.uploadImage(file)

    const banner = this.repo.create({
      url: upload.url,
      publicId: upload.publicId,
      title: data.title,
      link: data.link,
      order: data.order ?? 0
    })

    return this.repo.save(banner)
  }

  async update(
    id: number,
    data: Partial<Banner>,
    file?: Express.Multer.File
  ) {
    const banner = await this.repo.findOneBy({ id })

    if (!banner) throw new Error("Banner não encontrado")

    // 🔥 se enviou nova imagem → substitui
    if (file) {
      await this.uploadService.deleteImageFromCloudinary(banner.publicId)

      const upload = await this.uploadService.uploadImage(file)

      banner.url = upload.url
      banner.publicId = upload.publicId
    }

    Object.assign(banner, data)

    return this.repo.save(banner)
  }

  async remove(id: number) {
    const banner = await this.repo.findOneBy({ id })

    if (!banner) throw new Error("Banner não encontrado")

    await this.uploadService.deleteImageFromCloudinary(banner.publicId)

    return this.repo.delete(id)
  }

  async toggleActive(id: number) {
    const banner = await this.repo.findOneBy({ id })

    if (!banner) throw new Error("Banner não encontrado")

    banner.isActive = !banner.isActive

    return this.repo.save(banner)
  }
  
}