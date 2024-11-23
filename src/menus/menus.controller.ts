import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
  } from '@nestjs/common';
  import { MenusService } from './menus.service';
  import { CreateMenuDto } from './dto/create-menu.dto';
  import { UpdateMenuDto } from './dto/update-menu.dto';
  import { Roles } from 'src/auth/roles.decorator';
  import { RolesGuard } from 'src/auth/roles.guard';
  import { UseGuards } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import * as path from 'path';

  @Controller('menus')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  export class MenusController {
    constructor(private readonly menusService: MenusService) {}
  
    @Get()
    async findAll() {
      return this.menusService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string) {
      return this.menusService.findOne(id);
    }
  
    @Post()
    @UseInterceptors(
      FileInterceptor('gambar', {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, callback) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const filename = `${uniqueSuffix}-${file.originalname}`;
            callback(null, filename);
          },
        }),
      }),
    )
    async create(
      @Body() createMenuDto: CreateMenuDto,
      @UploadedFile() file?: Express.Multer.File,
    ) {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }
      return this.menusService.create(createMenuDto, file.filename);
    }
  
    @Put(':id')
    @UseInterceptors(
      FileInterceptor('gambar', {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, callback) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const filename = `${uniqueSuffix}-${file.originalname}`;
            callback(null, filename);
          },
        }),
      }),
    )
    async update(
      @Param('id') id: string,
      @Body() updateMenuDto: UpdateMenuDto,
      @UploadedFile() file?: Express.Multer.File,
    ) {
      const filename = file ? file.filename : undefined;
      return this.menusService.update(id, updateMenuDto, filename);
    }
  
    @Delete(':id')
    async delete(@Param('id') id: string) {
      return this.menusService.delete(id);
    }
  }
  