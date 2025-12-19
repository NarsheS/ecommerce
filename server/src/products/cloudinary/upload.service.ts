import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class UploadService {
  constructor(
    @Inject('CLOUDINARY') private cloudinary: any,
  ) {}

  
  // Faz o upload da imagem para o cloudinary
  uploadImage(file: Express.Multer.File): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(
        { folder: 'products' },
        (error, result) => {
          if (error) reject(error);
          else resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        },
      );

      stream.end(file.buffer);
    });
  }

  // Deleta a imagem no cloudinary
  async deleteImageFromCloudinary(publicId: string): Promise<void> {
    await this.cloudinary.uploader.destroy(publicId);
  }

}
