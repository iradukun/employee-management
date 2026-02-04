import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

export class CreateSuperAdminDto extends CreateUserDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  registration_code: string;
}
