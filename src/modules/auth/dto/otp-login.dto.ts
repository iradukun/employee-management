import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class OtpLoginDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @Length(12)
  @Matches(/^250\d{9}$/)
  telephone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  otp: string;
}
