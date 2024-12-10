import { MidtransController } from './midtrans.controller';
import { MidtransService } from './midtrans.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
    // // imports: [],
    // controllers: [
    //     MidtransController, ],
    providers: [
        MidtransService,],
    exports: [
        MidtransService
    ]
})
export class MidtransModule { }
