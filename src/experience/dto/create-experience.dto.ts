import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  @IsNotEmpty()
  position!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  company!: string;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  departmentId!: number;

  @IsDateString()
  @IsNotEmpty()
  startedAt!: Date;

  @IsDateString()
  @IsOptional()
  endedAt?: Date;
}
