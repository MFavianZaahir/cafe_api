import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { MenusModule } from './menus/menus.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
// import { MejaController } from './meja/meja.controller';
// import { MejaService } from './meja/meja.service';
import { MejaModule } from './meja/meja.module';
import { KasirModule } from './kasir/kasir.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),PrismaModule, UsersModule, MenusModule, AuthModule, MejaModule, KasirModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
