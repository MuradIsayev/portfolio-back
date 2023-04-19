import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChatDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  message: string;

  @IsString()
  @IsNotEmpty()
  photoURL: string;

  @IsString()
  @IsNotEmpty()
  uuid: string;
}
