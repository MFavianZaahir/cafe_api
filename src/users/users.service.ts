import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
  
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
  }
  

  async getUserById(id_user: string) {
    return this.prisma.user.findUnique({ where: { id_user } });
  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  async updateUser(id_user: string, data: Prisma.userUpdateInput) {
    return this.prisma.user.update({
      where: { id_user },
      data,
    });
  }

  async deleteUser(id_user: string) {
    return this.prisma.user.update({
      where: { id_user },
      data: { unalived: true },
    });
  }
}
