import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MenusService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) { }

  async findAll() {
    return this.prisma.menu.findMany({
      where: { isPerished: false },
    });
  }

  async findOne(id: string, file?: Express.Multer.File) {
    const menu = await this.prisma.menu.findUnique({
      where: { id_menu: id },
    });
    if (!menu || menu.isPerished) {
      throw new NotFoundException('Menu item not found or unavailable');
    }
    return menu;
  }

  async create(createMenuDto: CreateMenuDto, file: Express.Multer.File) {
    const { nama_menu, jenis, deskripsi, harga } = createMenuDto;
    const parsedHarga = parseInt(harga, 10);

    if (isNaN(parsedHarga)) {
        throw new BadRequestException('Invalid value for harga. It must be a number.');
    }

    let imageUrl: string | null = null;
    if (file) {
        imageUrl = await this.cloudinary.uploadImage(file);
    }

    return this.prisma.menu.create({
        data: {
            nama_menu,
            jenis: jenis as 'MAKANAN' | 'MINUMAN',
            deskripsi,
            harga: parsedHarga,
            gambar: imageUrl,
        },
    });
}


  async update(id: string, updateMenuDto: UpdateMenuDto, filePath?: any) {
    const menu = await this.prisma.menu.findUnique({
      where: { id_menu: id },
    });
    if (!menu) {
      throw new NotFoundException('Menu item not found');
    }

    const validJenis: ['MAKANAN', 'MINUMAN'] = ['MAKANAN', 'MINUMAN'];
    const updatedJenis = updateMenuDto.jenis
      ? (updateMenuDto.jenis as 'MAKANAN' | 'MINUMAN')
      : menu.jenis;

    const parsedHarga = parseInt(updateMenuDto.harga, 10);
    if (isNaN(parsedHarga)) {
      throw new BadRequestException('Invalid value for harga. It must be a number.');
    }

    let imageUrl = menu.gambar;
    if (filePath) {
      try {
        const uploadResult: any = await this.cloudinary.uploadImage(filePath);
        imageUrl = uploadResult.secure_url;
      } catch (error) {
        throw new BadRequestException('Failed to upload image to Cloudinary.');
      }
    }

    return this.prisma.menu.update({
      where: { id_menu: id },
      data: {
        ...updateMenuDto,
        jenis: validJenis.includes(updatedJenis) ? updatedJenis : menu.jenis,
        gambar: imageUrl,
        harga: parsedHarga,
      },
    });
  }



  async delete(id: string) {
    const menu = await this.prisma.menu.findUnique({
      where: { id_menu: id },
    });
    if (!menu) {
      throw new NotFoundException('Menu item not found');
    }

    // Implement logic to handle deletion (e.g., setting a flag or actually deleting from the database)
    // This example sets the 'isPerished' flag to true
    return this.prisma.menu.update({
      where: { id_menu: id },
      data: {
        isPerished: true,
      },
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: 'menu_images', resource_type: 'auto' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url); // Secure URL of the uploaded image
            },
        ).end(file.buffer); // Use the buffer from Multer
    });
}

}
