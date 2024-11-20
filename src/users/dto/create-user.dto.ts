import { IsString, IsEnum, IsOptional, IsBoolean } from '@nestjs/class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role; // Defaults to ADMIN in the schema

  @IsOptional()
  @IsBoolean()
  unalived?: boolean; // Defaults to false in the schema
}
