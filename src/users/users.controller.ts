import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Prisma } from '@prisma/client';

@Controller('users')
@UseGuards(RolesGuard) // Apply the guard to the entire controller
@Roles('ADMIN')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  async findAll() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  async findOne(@Param('id') id_user: string) {
    return this.usersService.getUserById(id_user);
  }

  @Put(':id')
  async update(
    @Param('id') id_user: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id_user, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id_user: string) {
    return this.usersService.deleteUser(id_user);
  }
}
