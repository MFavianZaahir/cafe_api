import { Module } from '@nestjs/common';
import { KasirService } from './kasir.service';
import { KasirController } from './kasir.controller';

@Module({
  providers: [KasirService],
  controllers: [KasirController]
})
export class KasirModule {}
