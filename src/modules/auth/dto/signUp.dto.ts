import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';
export class SignUpDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName?: string;
}
