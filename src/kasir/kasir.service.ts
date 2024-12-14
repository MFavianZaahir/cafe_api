import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { MidtransService } from 'src/midtrans/midtrans.service';
import { Status } from '@prisma/client';

@Injectable()
export class KasirService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly midtransService: MidtransService
  ) {}

  // View all transactions
  async findAll(filters: { status?: string; startDate?: Date; endDate?: Date }) {
    const { status, startDate, endDate } = filters;

    // Construct the where clause dynamically based on the provided filters
    const whereClause: any = {};

    if (status && status !== '') {
      whereClause.status = status as Status; // Ensure the status matches the Prisma Status enum
    }

    if (startDate || endDate) {
      whereClause.tgl_transaksi = {
        ...(startDate && { gte: startDate }), // Add gte condition if startDate is provided
        ...(endDate && { lte: endDate }),    // Add lte condition if endDate is provided
      };
    }

    // Fetch transactions based on filters
    return this.prisma.transaksi.findMany({
      where: whereClause,
      include: {
        details: {
          include: { menu: true }, // Include menu details for all items
        },
        meja: true,
        user: true,
        outlet: true, // Include outlet details
      },
    });
  }

  // Get specific transaction
  async findOne(id: string) {
    const transaksi = await this.prisma.transaksi.findUnique({
      where: { id_transaksi: id },
      include: {
        details: {
          include: { menu: true }, // Include menu details for all items
        },
        meja: true,
        user: true,
        outlet: true, // Include outlet details
      },
    });
    

    if (!transaksi) {
      throw new NotFoundException('Transaction not found');
    }

    return transaksi;
  }

  // Create a new transaction
// kasir.service.ts

async create(data: CreateTransactionDto) {
  const { nomor_meja, username, nama_pelanggan, details, id_outlet } = data;

  // Validate outlet
  const outlet = await this.prisma.outlet.findUnique({
    where: { id_outlet },
  });
  if (!outlet) {
    throw new NotFoundException(`Outlet with ID "${id_outlet}" not found.`);
  }

  // Validate table
  const meja = await this.prisma.meja.findUnique({ where: { nomor_meja } });
  if (!meja) throw new NotFoundException(`Table with number ${nomor_meja} not found.`);
  if (!meja.isVacant) throw new BadRequestException(`Table ${nomor_meja} is not vacant.`);

  // Validate user
  const user = await this.prisma.user.findUnique({ where: { username } });
  if (!user) throw new NotFoundException(`User with username "${username}" not found.`);

  // Prepare transaction details
  const preparedDetails = await Promise.all(
    details.map(async (detail) => {
      const menu = await this.prisma.menu.findUnique({ where: { nama_menu: detail.nama_menu } });
      if (!menu) throw new NotFoundException(`Menu item "${detail.nama_menu}" not found.`);
      return {
        id_menu: menu.id_menu,
        harga: menu.harga,
        qty: detail.qty,
        totalHarga: BigInt(menu.harga * detail.qty),
      };
    }),
  );

  // Create transaction in database
  const transaction = await this.prisma.transaksi.create({
    data: {
      nama_pelanggan,
      user: { connect: { id_user: user.id_user } },
      meja: { connect: { id_meja: meja.id_meja } },
      details: { create: preparedDetails },
      status: 'BELUM_BAYAR',
      outlet: { connect: { id_outlet } }, // Connect to the validated outlet
    },
    include: {
      details: {
        include: { menu: true },
      },
    },
  });

  // Prepare Midtrans payload
  const grossAmount = transaction.details.reduce(
    (total, detail) => total + Number(detail.harga) * detail.qty,
    0,
  );

  const transactionDetails = {
    transaction_details: {
      order_id: transaction.id_transaksi,
      gross_amount: grossAmount,
    },
    customer_details: {
      first_name: nama_pelanggan,
    },
    item_details: transaction.details.map((detail) => ({
      id: detail.id_menu,
      price: Number(detail.harga),
      quantity: detail.qty,
      name: detail.menu.nama_menu,
    })),
  };

  // Create Midtrans transaction
  const midtransTransaction = await this.midtransService.createTransaction(transactionDetails);

  return {
    message: 'Transaction created successfully. Proceed to payment.',
    paymentUrl: midtransTransaction.redirect_url,
  };
}


async markAsPaid(id: string) {
  const transaksi = await this.prisma.transaksi.findUnique({
    where: { id_transaksi: id },
    include: { details: { include: { menu: true } } }, // Include details and menu
  });
  

  if (!transaksi) throw new NotFoundException('Transaction not found');

  // Check Midtrans transaction status
  const statusResponse = await this.midtransService.checkTransactionStatus(id);
  const transactionStatus = statusResponse.transaction_status;

  // Map Midtrans status to your application's status
  const statusMapping: Record<string, string> = {
      settlement: 'LUNAS',
      pending: 'BELUM_BAYAR',
      cancel: 'CANCELED',
      expire: 'EXPIRED',
  };

  
  const newStatus: Status = Status.LUNAS; // Use enum directly
  await this.prisma.transaksi.update({
    where: { id_transaksi: id },
    data: { status: newStatus },
  });
  

  // Update transaction status
  const updatedTransaction = await this.prisma.transaksi.update({
      where: { id_transaksi: id },
      data: { status: newStatus },
  });

  return updatedTransaction;
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