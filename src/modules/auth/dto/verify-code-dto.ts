import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyCodeDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user to verify',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'The verification code sent to the user email',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
