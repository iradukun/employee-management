import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiResponse as SwaggerResponse,
} from '@nestjs/swagger'
import { AuthGuard } from 'src/guards/auth.guard'
import { RolesGuard } from 'src/guards/roles.guard'
import { Roles } from 'src/decorators/roles.decorator'
import { CurrentUser } from 'src/decorators/current-user.decorator'
import { ApiResponse } from 'src/lib/types/api-response'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'

@Controller('users')
@ApiTags('users')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor (private readonly usersService: UsersService) {}

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get all users' })
  @SwaggerResponse({
    status: 200,
    description: 'The found records',
    type: [User],
  })
  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'take', type: Number, required: false })
  async findAll (@Query('skip') skip: number, @Query('take') take: number) {
    const users = await this.usersService.findAll({
      skip: Number(skip) || undefined,
      take: Number(take) || undefined,
    })
    return new ApiResponse<User[]>(
      true,
      'Users fetched successfully',
      users,
      200,
    )
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  @SwaggerResponse({
    status: 200,
    description: 'The found record',
    type: User,
  })
  async findOne (@Param('id') id: string, @CurrentUser() currentUser: User) {
    // Allow if admin or own profile
    const isAdmin = currentUser.roles.some(r => r.name === 'ADMIN');
    if (!isAdmin && currentUser.id !== id) {
        throw new ForbiddenException('You can only view your own profile');
    }

    const user = await this.usersService.findOne({ id })
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return new ApiResponse<User>(true, 'User fetched successfully', user, 200)
  }

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new user' })
  @SwaggerResponse({
    status: 201,
    description: 'The record has been successfully created',
    type: User,
  })
  @ApiBody({ type: CreateUserDto })
  async create (@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto)
    return new ApiResponse<User>(true, 'User created successfully', user, 201)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @SwaggerResponse({
    status: 200,
    description: 'The record has been successfully updated',
    type: User,
  })
  @ApiBody({ type: UpdateUserDto })
  async update (@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @CurrentUser() currentUser: User) {
    // Allow if admin or own profile
    const isAdmin = currentUser.roles.some(r => r.name === 'ADMIN');
    if (!isAdmin && currentUser.id !== id) {
        throw new ForbiddenException('You can only update your own profile');
    }
    // Prevent non-admins from updating roles
    if (!isAdmin && updateUserDto.roles) {
        throw new ForbiddenException('You cannot update your own roles');
    }

    const user = await this.usersService.updateUser({
      where: { id },
      data: updateUserDto,
    })
    return new ApiResponse<User>(true, 'User updated successfully', user, 200)
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete a user' })
  @SwaggerResponse({
    status: 200,
    description: 'The record has been successfully deleted',
    type: User,
  })
  async delete (@Param('id') id: string) {
    const user = await this.usersService.deleteUser({ id })
    return new ApiResponse<User>(true, 'User deleted successfully', user, 200)
  }
}
