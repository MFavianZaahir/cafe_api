import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMenuDto {
  @IsNotEmpty()
  @IsString()
  nama_menu: string;

  @IsNotEmpty()
  @IsString()
  jenis: string;

  @IsNotEmpty()
  @IsString()
  deskripsi: string;

  @IsNotEmpty()
  @IsString() // Keep it as string for form-data compatibility
  harga: string;

  gambar?: string; // Optional since it's handled by multer
}
