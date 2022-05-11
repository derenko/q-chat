import { SentBy } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  chatId: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  from: SentBy;
}
