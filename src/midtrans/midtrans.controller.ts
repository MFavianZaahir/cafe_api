import { Controller, Post, Body, Req } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Controller('midtrans')
export class MidtransController {
      constructor(private readonly prisma: PrismaService) { }

      @Post('callback')
      async handleCallback(@Body() body: any) {
            const { order_id, transaction_status } = body;

            const statusMapping: Record<string, string> = {
                  settlement: 'LUNAS',
                  pending: 'BELUM_BAYAR',
                  cancel: 'CANCELED',
                  expire: 'EXPIRED',
            };

            const status: any = statusMapping[transaction_status] || 'UNKNOWN';

            await this.prisma.transaksi.update({
                  where: { id_transaksi: order_id },
                  data: { status },
            });

            return { message: 'Transaction updated successfully' };
      }
}
