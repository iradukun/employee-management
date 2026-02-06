import { ApiProperty } from '@nestjs/swagger'
import { Role } from '../../users/entities/role.entity'

export class LoginPayload {
  @ApiProperty({ description: 'User ID' })
  id: string

  @ApiProperty({ description: 'User email' })
  email: string

  @ApiProperty({ description: 'User first name' })
  firstName: string

  @ApiProperty({ description: 'User last name' })
  lastName: string

  @ApiProperty({ description: 'JWT Access Token' })
  token: string

  @ApiProperty({ description: 'User roles', type: [Role] })
  roles: Role[]
}
