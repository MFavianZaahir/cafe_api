import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { MidtransService } from 'src/midtrans/midtrans.service';

@Injectable()
export class KasirService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly midtransService: MidtransService
  ) { }

  // View all transactions
  async findAll(filters: { status?: string; startDate?: Date; endDate?: Date }) {
    const { status, startDate, endDate } = filters;

    // Construct the where clause dynamically based on the provided filters
    const whereClause: any = {
      status,
      tgl_transaksi: startDate || endDate
        ? {
          gte: startDate || undefined, // Greater than or equal to startDate
          lte: endDate || undefined,  // Less than or equal to endDate
        }
        : undefined,
    };

    // Fetch transactions based on filters
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
  // kasir.service.ts
  async markAsPaid(id: string) {
    // Step 1: Fetch transaction details
    const transaksi = await this.prisma.transaksi.findUnique({
      where: { id_transaksi: id },
      include: {
        user: true,
        details: {
          include: {
            menu: true
          }
        }
      },
    });

    if (!transaksi) throw new NotFoundException('Transaction not found');
    if (transaksi.status === 'LUNAS') throw new BadRequestException('Transaction already paid');

    // Step 2: Prepare Midtrans transaction payload
    const grossAmount = transaksi.details.reduce(
      (total, detail) => total + Number(detail.harga) * detail.qty,
      0
    );

    const transactionDetails = {
      transaction_details: {
        order_id: transaksi.id_transaksi,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: transaksi.nama_pelanggan,
        // email: transaksi.user.email
      },
      item_details: transaksi.details.map((detail) => ({
        id: detail.id_menu,
        price: Number(detail.harga),
        quantity: detail.qty,
        name: detail.menu.nama_menu,
      })),
    };

    // Step 3: Create Midtrans transaction
    const midtransTransaction = await this.midtransService.createTransaction(transactionDetails);

    // Return payment URL to client
    return {
      message: 'Transaction created successfully. Proceed to payment.',
      paymentUrl: midtransTransaction.redirect_url,
    };
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