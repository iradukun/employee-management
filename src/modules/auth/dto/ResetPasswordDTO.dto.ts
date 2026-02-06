import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class ResetPasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Verification code', example: '123456' })
  @Length(6, 6, { message: 'Code must be exactly 6 characters long' })
  code: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'New password', example: 'newPassword123' })
  @Length(8, 128, { message: 'Password must be between 8 and 128 characters' })
  newPassword: string;
}
