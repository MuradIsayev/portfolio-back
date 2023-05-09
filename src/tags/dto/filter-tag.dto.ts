import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FilterTagDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  tag: string;
}
