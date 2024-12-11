import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOutletDto } from './dto/create-outlet.dto';
import { UpdateOutletDto } from './dto/update-outlet.dto';

@Injectable()
export class OutletService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new outlet
  async create(createOutletDto: CreateOutletDto) {
    return this.prisma.outlet.create({
      data: createOutletDto,
    });
  }

  // Fetch all outlets
  async findAll() {
    return this.prisma.outlet.findMany();
  }

  // Find a single outlet by ID
  async findOne(id_outlet: string) {
    const outlet = await this.prisma.outlet.findUnique({
      where: { id_outlet },
    });

    if (!outlet) {
      throw new NotFoundException(`Outlet with ID ${id_outlet} not found`);
    }

    return outlet;
  }

  // Update an existing outlet
  async update(id_outlet: string, updateOutletDto: UpdateOutletDto) {
    const outlet = await this.prisma.outlet.findUnique({
      where: { id_outlet },
    });

    if (!outlet) {
      throw new NotFoundException(`Outlet with ID ${id_outlet} not found`);
    }

    return this.prisma.outlet.update({
      where: { id_outlet },
      data: updateOutletDto,
    });
  }

  // Delete an outlet
  async remove(id_outlet: string) {
    const outlet = await this.prisma.outlet.findUnique({
      where: { id_outlet },
    });

    if (!outlet) {
      throw new NotFoundException(`Outlet with ID ${id_outlet} not found`);
    }

    return this.prisma.outlet.delete({
      where: { id_outlet },
    });
  }
}
