import { IsInt, IsBoolean } from 'class-validator';

export class CreateTableDto {
  @IsInt()
  nomor_meja: number;

  @IsBoolean()
  isVacant?: boolean;

  @IsBoolean()
  destructed?: boolean;
}
