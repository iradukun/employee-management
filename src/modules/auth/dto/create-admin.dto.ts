import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class CreateAdminDto extends OmitType(CreateUserDto, ['roles']) {
  @IsNotEmpty()
  @ApiProperty({ description: 'Admin key for validation' })
  @IsString()
  adminKey: string;
}
