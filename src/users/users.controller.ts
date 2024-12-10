import { Controller, Get, Post, Body, Param, Delete, UseGuards, UploadedFile, UseInterceptors, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Prisma } from '@prisma/client';

@Controller('users')
@UseGuards(RolesGuard) // Apply the guard to the entire controller
@Roles('ADMIN')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.createUser(createUserDto, file);
  }

  @Get()
  async findAll() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  async findOne(@Param('id') id_user: string) {
    return this.usersService.getUserById(id_user);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))  
  async update(
    @Param('id') id_user: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.updateUser(id_user, updateUserDto, file);
  }

  @Delete(':id')
  async remove(@Param('id') id_user: string) {
    return this.usersService.deleteUser(id_user);
  }
}
