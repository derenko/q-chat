import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateHandbookDto {
  @IsString()
  @IsNotEmpty()
  answer: string;
}
