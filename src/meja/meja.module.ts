import { Module } from '@nestjs/common';
import { MejaController } from './meja.controller';
import { MejaService } from './meja.service';

@Module({
    imports: [],
    controllers: [MejaController],
    providers: [MejaService],
})
export class MejaModule {}