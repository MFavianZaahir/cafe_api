/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { resolve } from 'path';

@Injectable()
export class CloudinaryService {
      constructor(private configService: ConfigService) {
            cloudinary.config({
                  cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
                  api_key: this.configService.get('CLOUDINARY_API_KEY'),
                  api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
            });
      }

      async uploadImage(file: Express.Multer.File): Promise<string> {
            return new Promise((resolve, reject) => {      
                  cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
                        if (error) return reject(error);
                        resolve(result.url);
                        return result.url;
                  }).end(file.buffer);
            });
      }
}      
