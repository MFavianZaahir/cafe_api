import { IsString, IsArray, IsUUID } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  id_meja: string;

  @IsUUID()
  id_user: string;

  @IsString()
  nama_pelanggan: string;

  @IsArray()
  items: {
    id_menu: string;
    qty: number;
  }[];
}
