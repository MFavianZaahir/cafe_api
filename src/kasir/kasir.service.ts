import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class KasirService {
  constructor(private readonly prisma: PrismaService) {}

  // View all transactions
  async findAll(filters: { status?: string; date?: Date }) {
    const { status, date } = filters;

    const whereClause: any = {
      status,
      tgl_transaksi: date ? { gte: date } : undefined,
    };

    return this.prisma.transaksi.findMany({
      where: whereClause,
      include: { details: true, meja: true, user: true },
    });
  }

  // Get specific transaction
  async findOne(id: string) {
    const transaksi = await this.prisma.transaksi.findUnique({
      where: { id_transaksi: id },
      include: {
        details: {
          include: { menu: true }, // Include menu relation
        },
        meja: true,
        user: true,
      },
    });
  
    if (!transaksi) {
      throw new NotFoundException('Transaction not found');
    }
  
    return transaksi;
  }
  

  // Create a new transaction
  async create(createTransactionDto: CreateTransactionDto) {
    const { id_meja, id_user, nama_pelanggan, items } = createTransactionDto;

    // Check if the table is vacant
    const meja = await this.prisma.meja.findUnique({ where: { id_meja } });
    if (!meja || !meja.isVacant) {
      throw new BadRequestException('Table is not available');
    }

    // Calculate totals
    let total = 0;
    const detailTransaksi = await Promise.all(
      items.map(async (item) => {
        const menu = await this.prisma.menu.findUnique({ where: { id_menu: item.id_menu } });
        if (!menu) throw new NotFoundException(`Menu item not found: ${item.id_menu}`);

        const subTotal = menu.harga * item.qty;
        total += subTotal;

        return {
          id_menu: item.id_menu,
          harga: menu.harga,
          qty: item.qty,
          totalHarga: subTotal,
        };
      }),
    );

    // Create transaction and mark table as occupied
    const transaksi = await this.prisma.transaksi.create({
      data: {
        id_user,
        id_meja,
        nama_pelanggan,
        status: 'BELUM_BAYAR',
        details: {
          create: detailTransaksi,
        },
      },
    });

    await this.prisma.meja.update({
      where: { id_meja },
      data: { isVacant: false },
    });

    return transaksi;
  }

  // Update transaction status to "LUNAS" (Paid)
  async create(data: CreateTransactionDto) {
    const { nomor_meja, username, nama_pelanggan, details } = data;

    // Validate and fetch the table (meja) ID
    const meja = await this.prisma.meja.findUnique({
      where: { nomor_meja },
    });
    if (!meja || !meja.isVacant) {
      throw new BadRequestException('Table is either occupied or does not exist.');
    }

    // Prepare details with fetched menu prices
    const preparedDetails = await Promise.all(
      details.map(async (detail) => {
        const menu = await this.prisma.menu.findUnique({
          where: { nama_menu: detail.nama_menu },
        });
        if (!menu) {
          throw new NotFoundException(`Menu item "${detail.nama_menu}" not found.`);
        }

        return {
          id_menu: menu.id_menu,
          harga: menu.harga,
          qty: detail.qty,
          totalHarga: BigInt(menu.harga * detail.qty),
        };
      }),
    );

    // Calculate total price for the transaction
    const totalPrice = preparedDetails.reduce((sum, detail) => sum + detail.totalHarga, BigInt(0));

    // Create transaction and mark table as occupied
    const transaction = await this.prisma.transaksi.create({
      data: {
        id_meja: meja.id_meja,
        username,
        nama_pelanggan,
        details: {
          create: preparedDetails,
        },
        status: 'BELUM_BAYAR',
      },
      include: {
        details: true,
      },
    });

    await this.prisma.meja.update({
      where: { id_meja: meja.id_meja },
      data: { isVacant: false },
    });

    return { ...transaction, totalPrice };
  }
}

  // Print receipt
  async printReceipt(id: string) {
    const transaksi = await this.findOne(id);
  
    const receipt = {
      cafeName: 'Wikusama Cafe',
      transactionDate: transaksi.tgl_transaksi,
      cashierName: transaksi.user.name,
      tableNumber: transaksi.meja.nomor_meja,
      customerName: transaksi.nama_pelanggan,
      items: transaksi.details.map((detail) => ({
        menuName: detail.menu.nama_menu,
        qty: detail.qty,
        price: detail.harga,
        total: Number(detail.totalHarga), // Convert BigInt to number
      })),
      totalPrice: transaksi.details.reduce(
        (sum, detail) => sum + Number(detail.totalHarga), // Convert BigInt to number
        0,
      ),
    };
  
    return receipt;
  }
  
}
