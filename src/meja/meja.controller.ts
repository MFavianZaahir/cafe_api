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
  
  @Controller('meja')
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
  
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() updateMejaDto: UpdateMejaDto,
    ) {
      return this.mejaService.update(id, updateMejaDto);
    }
  
    @Delete(':id')
    async delete(@Param('id') id: string) {
      return this.mejaService.delete(id);
    }
  }
  