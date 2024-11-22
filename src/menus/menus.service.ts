import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMenuDto} from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenusService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.menu.findMany({
      where: { isPerished: false },
    });
  }

  async findOne(id: string) {
    const menu = await this.prisma.menu.findUnique({
      where: { id_menu: id },
    });
    if (!menu || menu.isPerished) {
      throw new NotFoundException('Menu item not found or unavailable');
    }
    return menu;
  }

  async create(createMenuDto: CreateMenuDto, gambar: string) {
    const { nama_menu, jenis, deskripsi, harga } = createMenuDto;
  
    // Ensure 'jenis' is a valid enum value
    const validJenis: ['MAKANAN', 'MINUMAN'] = ['MAKANAN', 'MINUMAN'];
    if (!validJenis.includes(jenis as 'MAKANAN' | 'MINUMAN')) {
      throw new BadRequestException('Invalid jenis value.');
    }
  
    // Convert harga to a number
    const parsedHarga = parseInt(harga, 10);
    if (isNaN(parsedHarga)) {
      throw new BadRequestException('Invalid value for harga. It must be a number.');
    }
  
    return this.prisma.menu.create({
      data: {
        nama_menu,
        jenis: jenis as 'MAKANAN' | 'MINUMAN', // Use the enum value directly
        deskripsi,
        harga: parsedHarga, // Use the parsed integer here
        gambar, // File name from multer
      },
    });
  }
  
  async update(id: string, updateMenuDto: UpdateMenuDto, filename?: string) {
    const menu = await this.prisma.menu.findUnique({
      where: { id_menu: id },
    });
    if (!menu) {
      throw new NotFoundException('Menu item not found');
    }
  
    // Ensure jenis is valid enum
    const validJenis: ['MAKANAN', 'MINUMAN'] = ['MAKANAN', 'MINUMAN'];
    const updatedJenis = updateMenuDto.jenis
      ? (updateMenuDto.jenis as 'MAKANAN' | 'MINUMAN')
      : menu.jenis;
  
    // Convert harga to a number before update
    const parsedHarga = parseInt(updateMenuDto.harga, 10);
    if (isNaN(parsedHarga)) {
      throw new BadRequestException('Invalid value for harga. It must be a number.');
    }
  
    return this.prisma.menu.update({
      where: { id_menu: id },
      data: {
        ...updateMenuDto,
        jenis: validJenis.includes(updatedJenis) ? updatedJenis : menu.jenis,
        gambar: filename || menu.gambar,
        harga: parsedHarga, // Use the parsed integer here
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
}
