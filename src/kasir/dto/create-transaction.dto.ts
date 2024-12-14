import { IsNotEmpty, IsString, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class TransactionDetailDto {
    @IsNotEmpty()
    @IsString()
    nama_menu: string;

    @IsNotEmpty()
    @IsNumber()
    qty: number;

    @IsNotEmpty()
    @IsNumber()
    harga: number;
}

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  nomor_meja: number;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  nama_pelanggan: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionDetailDto)
  details: TransactionDetailDto[];

  @IsNotEmpty()
  @IsString()
  id_outlet: string;
  }
