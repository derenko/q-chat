import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHandbookDto {
  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsString()
  @IsNotEmpty()
  question: string;
}
