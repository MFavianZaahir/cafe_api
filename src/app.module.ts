import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { MenusModule } from './menus/menus.module';
import { TablesModule } from './tables/tables.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),PrismaModule, UsersModule, MenusModule, TablesModule, AuthModule],
})
export class AppModule {}
