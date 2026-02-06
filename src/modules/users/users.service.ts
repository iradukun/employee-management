import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm'
import { CreateAdminDto } from '../auth/dto/create-admin.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Role } from './entities/role.entity'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
  constructor (
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findOne (where: FindOptionsWhere<User>): Promise<User | null> {
    try {
      return await this.userRepository.findOne({
        where,
        relations: ['roles'],
      })
    } catch (error) {
      return null
    }
  }

  async findAll (options?: FindManyOptions<User>): Promise<User[]> {
    return this.userRepository.find({
      ...options,
      relations: ['roles'],
    })
  }

  async createUser (data: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: data.email },
    })

    if (existingUser) {
      throw new BadRequestException('User already with this email exists')
    }
    if (data.phoneNumber) {
      const existingUserPhone = await this.userRepository.findOne({
        where: { phoneNumber: data.phoneNumber },
      })
      if (existingUserPhone) {
        throw new BadRequestException(
          'User already with this phone number exists',
        )
      }
    }

    if (data.employeeIdentifier) {
      const existingUserEmpId = await this.userRepository.findOne({
        where: { employeeIdentifier: data.employeeIdentifier },
      })
      if (existingUserEmpId) {
        throw new BadRequestException(
          'User already with this Employee Identifier exists',
        )
      }
    }
    const hashedPassword = await this.hashPassword(data.password)

    // Fetch roles
    const roles: Role[] = []
    if (data.roles && data.roles.length > 0) {
      for (const roleId of data.roles) {
        const role = await this.roleRepository.findOne({
          where: { id: roleId },
        })
        if (role) {
          roles.push(role)
        }
      }
    }

    const newUser = this.userRepository.create({
      ...data,
      password: hashedPassword,
      roles: roles,
    })

    return this.userRepository.save(newUser)
  }

  async createAdmin (createAdminDto: CreateAdminDto): Promise<User> {
    const adminKey = process.env.ADMIN_KEY

    if (!adminKey || createAdminDto.adminKey !== adminKey) {
      throw new UnauthorizedException('Invalid admin key')
    }

    const { adminKey: _, ...userData } = createAdminDto

    const hashedPassword = await this.hashPassword(userData.password)

    let adminRole = await this.roleRepository.findOne({
      where: { name: 'ADMIN' },
    })
    if (!adminRole) {
      adminRole = this.roleRepository.create({
        name: 'ADMIN',
        description: 'Administrator',
      })
      await this.roleRepository.save(adminRole)
    }

    const newUser = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      roles: [adminRole],
    })

    return this.userRepository.save(newUser)
  }

  async updateUser (params: {
    where: FindOptionsWhere<User>
    data: UpdateUserDto
  }): Promise<User> {
    const { where, data } = params

    const user = await this.userRepository.findOne({
      where,
      relations: ['roles'],
    })
    if (!user) throw new BadRequestException('User not found')

    if (data.employeeIdentifier) {
      const existingUserEmpId = await this.userRepository.findOne({
        where: { employeeIdentifier: data.employeeIdentifier },
      })
      if (existingUserEmpId && existingUserEmpId.id !== user.id) {
        throw new BadRequestException(
          'User already with this Employee Identifier exists',
        )
      }
    }

    if (data.password) {
      data.password = await this.hashPassword(data.password)
    }

    if (data.roles) {
      const roles: Role[] = []
      for (const roleId of data.roles) {
        const role = await this.roleRepository.findOne({
          where: { id: roleId },
        })
        if (role) {
          roles.push(role)
        }
      }
      user.roles = roles
      delete data.roles // Prevent Object.assign from overwriting with string[]
    }

    Object.assign(user, data)

    return this.userRepository.save(user)
  }

  async deleteUser (where: FindOptionsWhere<User>): Promise<User> {
    const user = await this.userRepository.findOne({
      where,
      relations: ['roles'],
    })
    if (!user) throw new BadRequestException('User not found')

    return this.userRepository.remove(user)
  }

  private async hashPassword (password: string): Promise<string> {
    const saltRounds = 10
    return bcrypt.hash(password, saltRounds)
  }
}
