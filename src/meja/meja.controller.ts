import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    BadRequestException,
  } from '@nestjs/common';
  import { MejaService } from './meja.service';
  import { CreateMejaDto } from './dto/create-meja.dto';
  import { UpdateMejaDto } from './dto/update-meja.dto';
  import { UseGuards } from '@nestjs/common';
  import { Roles } from '../auth/roles.decorator';
  import { RolesGuard } from '../auth/roles.guard';
  
  @Controller('meja')
  @UseGuards(RolesGuard) // Apply the guard to the entire controller
  @Roles('ADMIN')
  export class MejaController {
    constructor(private readonly mejaService: MejaService) {}
  
    @Get()
    async findAll() {
      return this.mejaService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string) {
      return this.mejaService.findOne(id);
    }
  
    @Post()
    async create(@Body() createMejaDto: CreateMejaDto) {
      return this.mejaService.create(createMejaDto);
    }
  
    @Put(':id/empty')
    async empty(
      @Param('id') id: string,
      @Body() updateMejaDto: UpdateMejaDto,
    ) {
      return this.mejaService.empty(id, updateMejaDto);
    }

    @Put(':id/vacant')
    async vacant(
      @Param('id') id: string,
    ) {
      return this.mejaService.vacant(id);
    }
  
    @Delete(':id')
    async delete(@Param('id') id: string) {
      return this.mejaService.delete(id);
    }
  }
  