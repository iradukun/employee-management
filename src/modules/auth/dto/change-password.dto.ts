import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Current password', example: 'oldPassword123' })
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'New password', example: 'newPassword123' })
  @Length(8, 128, { message: 'Password must be between 8 and 128 characters' })
  newPassword: string;
}
