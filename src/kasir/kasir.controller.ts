import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { KasirService } from './kasir.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('kasir')
export class KasirController {
  constructor(private readonly kasirService: KasirService) {}

  @Get('transactions')
  async findAll(@Query() filters: { status?: string; date?: string }) {
    const { status, date } = filters;
    return this.kasirService.findAll({
      status,
      date: date ? new Date(date) : undefined, // Convert date string to Date object
    });
  }
  
  @Get('transactions/:id')
  async findOne(@Param('id') id: string) {
    return this.kasirService.findOne(id);
  }

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    if (!createTransactionDto.details || createTransactionDto.details.length === 0) {
      throw new BadRequestException('Transaction must include at least one menu item.');
    }

    return this.kasirService.create(createTransactionDto);
  }

  @Put('transactions/:id/pay')
  async markAsPaid(@Param('id') id: string) {
    return this.kasirService.markAsPaid(id);
  }

  @Get('transactions/:id/receipt')
  async printReceipt(@Param('id') id: string) {
    return this.kasirService.printReceipt(id);
  }
}
