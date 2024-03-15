import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cloudinary from 'cloudinary';
const streamifier = require('streamifier');
@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.v2.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File) {
    if (!file.mimetype.startsWith('image')) {
      throw new BadRequestException(
        'Invalid file type. Only images are allowed.',
      );
    }

    if (file.size > 4 * 1024 * 1024) {
      throw new BadRequestException('File size exceeds the limit of 4MB.');
    }
    return new Promise<{ url: string }>((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        { folder: 'devtalles' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({ url: result.secure_url });
          }
        },
      );

      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  }
}
