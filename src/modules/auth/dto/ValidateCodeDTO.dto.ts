import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';

export class ValidateCodeDTO {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Verification code', example: '123456' })
  @Length(6, 6, { message: 'Code must be exactly 6 characters long' })
  code: string;
}
