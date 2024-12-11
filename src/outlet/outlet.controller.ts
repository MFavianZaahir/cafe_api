import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { OutletService } from './outlet.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOutletDto } from './dto/create-outlet.dto';
import { UpdateOutletDto } from './dto/update-outlet.dto';

@Controller('outlets')
export class OutletController {
  constructor(private readonly outletService: OutletService) {}

  @Post()
  create(@Body() createOutletDto: CreateOutletDto) {
    return this.outletService.create(createOutletDto);
  }

  @Get()
  findAll() {
    return this.outletService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.outletService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateOutletDto: UpdateOutletDto) {
    return this.outletService.update(id, updateOutletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.outletService.remove(id);
  }
  
  // @Get('outlets')
  // async getAllOutlets() {
  //   return this.prisma.outlet.findMany({
  //     select: {
  //       id_outlet: true,
  //       name: true,
  //       lat: true,
  //       lon: true,
  //     },
  //   });
  // }

}
