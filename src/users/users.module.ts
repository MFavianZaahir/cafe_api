import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Module({
  imports: [CloudinaryModule],
  providers: [UsersService, PrismaService],
  controllers: [UsersController]
})
export class UsersModule {}
