import { PartialType } from '@nestjs/mapped-types';
import { CreateMejaDto } from './create-meja.dto';

export class UpdateMejaDto extends PartialType(CreateMejaDto) {}
