import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InitiateChatDto {
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

  @IsBoolean()
  @IsNotEmpty()
  isOnline: boolean;
}
