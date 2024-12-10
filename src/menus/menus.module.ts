import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [CloudinaryModule],
  providers: [MenusService, PrismaClient],
  controllers: [MenusController]
})
export class MenusModule {}
