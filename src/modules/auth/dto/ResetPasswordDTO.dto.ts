import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class ResetPasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Length(6, 6, { message: 'Code must be exactly 6 characters long' })
  code: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Length(8, 128, { message: 'Password must be between 8 and 128 characters' })
  newPassword: string;
}
