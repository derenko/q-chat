import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsString()
  website: string;
}
