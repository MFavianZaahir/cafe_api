import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOutletDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  longitude: number;

  @IsNumber()
  latitude: number;
}
