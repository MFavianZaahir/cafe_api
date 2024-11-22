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
  async create(data: CreateTransactionDto) {
    const { nomor_meja, username, nama_pelanggan, details } = data;
  
    // Validate table
    const meja = await this.prisma.meja.findUnique({
      where: { nomor_meja },
    });
    if (!meja) {
      throw new NotFoundException(`Table with number ${nomor_meja} not found.`);
    }
    if (!meja.isVacant) {
      throw new BadRequestException(`Table ${nomor_meja} is not vacant.`);
    }
  
    // Fetch the userId dynamically based on the provided username (or other identification method)
    const user = await this.prisma.user.findUnique({
      where: { username }, // Assuming 'username' is passed in the request
    });
  
    if (!user) {
      throw new NotFoundException(`User with username "${username}" not found.`);
    }
  
    // Prepare transaction details
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
  
    // Create transaction with valid userId
    const transaction = await this.prisma.transaksi.create({
      data: {
        nama_pelanggan,
        user: { connect: { id_user: user.id_user } }, // Using user ID from the database
        meja: { connect: { id_meja: meja.id_meja } }, // Use the retrieved meja object
        details: { create: preparedDetails },
      },
      include: { details: true },
    });
  
    // Update table status
    await this.prisma.meja.update({
      where: { id_meja: meja.id_meja },
      data: { isVacant: false },
    });
  
    return transaction;
  }
  
  // Update transaction status to "LUNAS" (Paid)
  async markAsPaid(id: string) {
    const transaksi = await this.prisma.transaksi.findUnique({ where: { id_transaksi: id } });

    if (!transaksi) throw new NotFoundException('Transaction not found');
    if (transaksi.status === 'LUNAS') throw new BadRequestException('Transaction already paid');

    await this.prisma.meja.update({
      where: { id_meja: transaksi.id_meja },
      data: { isVacant: true },
    });

    return this.prisma.transaksi.update({
      where: { id_transaksi: id },
      data: { status: 'LUNAS' },
    });
  }

  async printReceipt(id: string) {
    const transaction = await this.prisma.transaksi.findUnique({
      where: { id_transaksi: id },
      include: {
        details: {
          include: {
            menu: true,
          },
        },
        meja: true,
      },
    });
  
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID "${id}" not found.`);
    }
  
    // Map details to convert BigInt totalHarga to string
    const orderDetails = transaction.details.map((detail) => ({
      menu: detail.menu.nama_menu,
      price: detail.harga,
      quantity: detail.qty,
      total: detail.totalHarga.toString(),  // Convert BigInt to string
    }));
  
    return {
      cafeName: "Wikusama Cafe",
      transactionDate: transaction.tgl_transaksi,
      cashierName: transaction.nama_pelanggan, // Adjust field as necessary
      orderDetails,  // Send the mapped details with total as string
      tableNumber: transaction.meja.nomor_meja,
    };
  }
  
}