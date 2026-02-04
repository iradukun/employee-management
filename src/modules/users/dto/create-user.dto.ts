import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'User first name' })
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'User last name' })
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'User phone number' })
  @IsString()
  @Matches(/^\+?[0-9]{10,15}$/, { message: 'Phone number must be valid' })
  phoneNumber: string;

  // role
  @IsNotEmpty()
  @ApiProperty({ description: 'User role' })
  @IsArray()
  roles: string[];

  @IsNotEmpty()
  @ApiProperty({ description: 'User password' })
  @IsString()
  @MinLength(3, { message: 'Password must be at least 3 characters long' })
  password: string;
}
