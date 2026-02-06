import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'User first name', example: 'John' })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'User last name', example: 'Doe' })
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'User email address', example: 'john.doe@example.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/)
  @ApiProperty({ description: 'User phone number', example: '+1234567890' })
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @ApiProperty({ description: 'User password', example: 'securePassword123' })
  password: string;
}
