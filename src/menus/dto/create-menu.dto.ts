import { IsString, IsInt, IsBoolean, IsEnum } from 'class-validator';
import { Jenis } from '@prisma/client';

export class CreateMenuDto {
  @IsString()
  nama_menu: string;

  @IsEnum(Jenis)
  jenis: Jenis;

  @IsString()
  deskripsi: string;

  @IsString()
  gambar: string;

  @IsInt()
  harga: number;

  @IsBoolean()
  isPerished?: boolean;
}
