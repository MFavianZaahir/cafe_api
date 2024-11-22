import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMejaDto } from './dto/create-meja.dto';
import { UpdateMejaDto } from './dto/update-meja.dto';

@Injectable()
export class MejaService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.meja.findMany({
      where: { destructed: false },
    });
  }

  async findOne(id: string) {
    const meja = await this.prisma.meja.findUnique({
      where: { id_meja: id },
    });
    if (!meja || meja.destructed) {
      throw new NotFoundException('Table not found or is destructed');
    }
    return meja;
  }

  async create(createMejaDto: CreateMejaDto) {
    const { nomor_meja } = createMejaDto;

    const existingMeja = await this.prisma.meja.findUnique({
      where: { nomor_meja },
    });

    if (existingMeja) {
      throw new BadRequestException('Table number already exists');
    }

    return this.prisma.meja.create({
      data: createMejaDto,
    });
  }

  async update(id: string, updateMejaDto: UpdateMejaDto) {
    const meja = await this.prisma.meja.findUnique({
      where: { id_meja: id },
    });

    if (!meja) {
      throw new NotFoundException('Table not found');
    }

    return this.prisma.meja.update({
      where: { id_meja: id },
      data: updateMejaDto,
    });
  }

  async delete(id: string) {
    const meja = await this.prisma.meja.findUnique({
      where: { id_meja: id },
    });

    if (!meja) {
      throw new NotFoundException('Table not found');
    }

    return this.prisma.meja.update({
      where: { id_meja: id },
      data: { destructed: true },
    });
  }
}
