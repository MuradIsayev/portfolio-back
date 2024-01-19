import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class TypingChatDto {
  @IsBoolean()
  @IsNotEmpty()
  isTyping: boolean;

  @IsString()
  @IsNotEmpty()
  uuid: string;
}
