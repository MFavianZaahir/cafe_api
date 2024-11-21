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
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import * as path from 'path';
  
  @Controller('menus')
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
      })
    )
    async create(
      @Body() createMenuDto: CreateMenuDto,
      @UploadedFile() file?: Express.Multer.File,
    ) {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }
  
      // Ensure the file path is passed correctly
      const filename = file.filename;
  
      // Call the service to create the menu with the image filename
      return this.menusService.create(createMenuDto, filename);
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
      })
    )
    async update(
      @Param('id') id: string,
      @Body() updateMenuDto: UpdateMenuDto,
      @UploadedFile() file?: Express.Multer.File,
    ) {
      // If file is uploaded, use its filename; otherwise, use existing image
      const filename = file ? file.filename : undefined;
      return this.menusService.update(id, updateMenuDto, filename);
    }
  
    // Uncomment the delete method if needed
    // @Delete(':id')
    // async delete(@Param('id') id: string) {
    //     return this.menusService.delete(id);
    // }
  }
  