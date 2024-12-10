import { Module } from '@nestjs/common';
import { KasirService } from './kasir.service';
import { KasirController } from './kasir.controller';
import { MidtransModule } from 'src/midtrans/midtrans.module';

@Module({
  imports: [MidtransModule], // Import the module containing MidtransService
  providers: [KasirService],
  controllers: [KasirController],
})
export class KasirModule {}
