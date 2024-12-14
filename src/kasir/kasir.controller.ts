import { Controller, Get, Post, Put, Body, Req, Param, Query, BadRequestException } from '@nestjs/common';
import { KasirService } from './kasir.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { MidtransService } from 'src/midtrans/midtrans.service';

@Controller('kasir')
export class KasirController {
  constructor(
    private readonly kasirService: KasirService,
    private readonly midtransService: MidtransService
  ) {}

  @Get('transactions')
  async getTransactions(
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    // Convert startDate and endDate to Date objects if provided
    const filters = {
      status,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    return this.kasirService.findAll(filters);
  }
  
  @Get('transactions/:id')
  // @UseGuards(RolesGuard) // Apply the guard to the entire controller
  // @Roles('ADMIN')
  async findOne(@Param('id') id: string) {
    return this.kasirService.findOne(id);
  }

  @Post()
  // @UseGuards(RolesGuard) // Apply the guard to the entire controller
  // @Roles('KASIR')
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    if (!createTransactionDto.details || createTransactionDto.details.length === 0) {
      throw new BadRequestException('Transaction must include at least one menu item.');
    }

    return this.kasirService.create(createTransactionDto);
  }

  @Put('transactions/:id/pay')
  // @UseGuards(RolesGuard) // Apply the guard to the entire controller
  // @Roles('KASIR')
  async markAsPaid(@Param('id') id: string) {
    return this.kasirService.markAsPaid(id);
  }

  @Get('transactions/:id/receipt')
  // @UseGuards(RolesGuard) // Apply the guard to the entire controller
  // @Roles('KASIR')
  async printReceipt(@Param('id') id: string) {
    return this.kasirService.printReceipt(id);
  }
}
