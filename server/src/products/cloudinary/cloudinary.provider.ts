import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    cloudinary.config({
      cloud_name: config.get('CLOUDINARY_NAME'),
      api_key: config.get('CLOUDINARY_KEY'),
      api_secret: config.get('CLOUDINARY_SECRET'),
      secure: true
    });

    return cloudinary;
  },
};
