import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class UploadService {
  constructor(
    @Inject('CLOUDINARY') private cloudinary: any,
  ) {}

  uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(
        { folder: 'products' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        },
      );

      stream.end(file.buffer);
    });
  }
}
