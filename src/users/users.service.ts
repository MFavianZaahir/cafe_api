import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) { }

  async createUser(createUserDto: CreateUserDto, file?: Express.Multer.File) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    let imageUrl = null
    console.log(file);

    if (file) {
      imageUrl = await this.cloudinaryService.uploadImage(file);
    }

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        image: imageUrl,
      },
    });
  }


  async getUserById(id_user: string) {
    return this.prisma.user.findUnique({ where: { id_user } });
  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  async updateUser(id_user: string, data: Prisma.userUpdateInput, file?: Express.Multer.File) {
    let imageUrl = null

    if (file) {
      imageUrl = await this.cloudinaryService.uploadImage(file);
    }
    return this.prisma.user.update({
      where: { id_user },
      data: {
        ...data,
        image: file ? imageUrl : data.image,
      },
    });
  }

  async deleteUser(id_user: string) {
    const user = await this.prisma.$transaction(async (prisma) => {
      const existingUser = await prisma.user.findUnique({
        where: { id_user },
      });

      if (!existingUser) {
        throw new Error('User not found');
      }

      return prisma.user.update({
        where: { id_user },
        data: { unalived: true },
      });
    });

    return user;
  }

}
