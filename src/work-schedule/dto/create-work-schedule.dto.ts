import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWorkScheduleDto {
  @IsString()
  @IsNotEmpty()
  type: string;
}
