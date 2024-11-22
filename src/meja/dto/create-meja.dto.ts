import { IsInt, IsBoolean, IsOptional } from 'class-validator';

export class CreateMejaDto {
  @IsInt()
  nomor_meja: number;

  @IsBoolean()
  @IsOptional()
  isVacant?: boolean;
}
