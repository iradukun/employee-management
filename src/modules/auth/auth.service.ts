import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import type { AuthRequest, TokenProps } from 'src/lib/types'
import { codeGenerator } from 'src/lib/utils/func.util'
import { MoreThan, Repository } from 'typeorm'
import { MailService } from '../mail/mail.service'
import { Role } from '../users/entities/role.entity'
import { User } from '../users/entities/user.entity'
import { Verification } from '../users/entities/verification.entity'
import { UsersService } from '../users/users.service'
import { ChangePasswordDto } from './dto/change-password.dto'
import { CreateAdminDto } from './dto/create-admin.dto'
import { LoginPayload } from './dto/login-payload.dto'
import { LoginDto } from './dto/login.dto'
import { SignupDto } from './dto/signup.dto'

@Injectable()
export class AuthService {
  constructor (
    private readonly mailService: MailService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,
  ) {}

  validateAll = async (credential: string): Promise<number> => {
    // Check if the credential is a valid email address
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (emailPattern.test(credential)) {
      return 1
    }

    // Check if the credential matches the pattern for a Rwandan phone number
    const phoneNumberPattern = /^250\d{9}$/
    if (phoneNumberPattern.test(credential)) {
      return 2
    }

    // If neither of the above conditions are met, return 3
    return 3
  }

  async login (loginDto: LoginDto): Promise<LoginPayload> {
    let user: User | null = null

    // Only support email login now
    user = await this.validateEmailUser(loginDto.email, loginDto.password)

    if (!user) {
      throw new UnauthorizedException('User not found or invalid credentials')
    }

    if (!user.isVerified) {
      // Auto resend verification email if user attempts to login but is not verified
      try {
        await this.resendVerificationEmail(user.email)
        console.log(
          `Resent verification email to unverified user: ${user.email}`,
        )
      } catch (err) {
        console.error(
          `Failed to resend verification email to ${user.email}`,
          err,
        )
      }
      throw new UnauthorizedException(
        'User not verified. A new verification code has been sent to your email.',
      )
    }

    const tokenProps: TokenProps = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
    }

    const loginPayload: LoginPayload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
      token: this.jwtService.sign(tokenProps, {
        secret: process.env.SECRET_KEY,
      }),
    }

    return loginPayload
  }

  async signup (signupDto: SignupDto): Promise<User> {
    const userRole = await this.roleRepository.findOne({
      where: { name: 'USER' },
    })
    if (!userRole) {
      throw new NotFoundException('Role not found')
    }

    // check if the user already exists
    const existingUser = await this.userService.findOne({
      email: signupDto.email,
    })
    if (existingUser) {
      // check if the user is verified
      if (existingUser.isVerified) {
        throw new BadRequestException(
          'User with this email already exists. Please login.',
        )
      }

      // If user exists but is not verified, resend the verification code
      await this.resendVerificationEmail(existingUser.email)
      throw new BadRequestException(
        'User with this email already exists but is not verified. A new verification code has been sent to your email.',
      )
    }

    // Create the user
    // Note: UsersService.createUser expects role IDs
    const user = await this.userService.createUser({
      ...signupDto,
      roles: [userRole.id],
    })

    // Generate verification code
    const verificationCode = codeGenerator()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // Code expires in 24 hours

    // Create verification record
    const verification = this.verificationRepository.create({
      code: verificationCode,
      expires: expiresAt,
      userId: user.id,
    })
    await this.verificationRepository.save(verification)

    try {
      // Send verification email
      await this.mailService.sendVerificationEmail(
        user.email,
        verificationCode,
        `${user.firstName} ${user.lastName}`,
      )
    } catch (error) {
      console.log('Error sending verification email', error)
    }
    return user
  }

  // resend verification email
  async resendVerificationEmail (email: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { email },
    })
    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    const verificationCode = codeGenerator()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // Code expires in 24 hours

    const verification = this.verificationRepository.create({
      code: verificationCode,
      expires: expiresAt,
      userId: user.id,
    })
    await this.verificationRepository.save(verification)

    await this.mailService.sendVerificationEmail(
      user.email,
      verificationCode,
      `${user.firstName} ${user.lastName}`,
    )

    return 'Verification email sent'
  }

  // Initiate Password Reset
  async initiatePasswordReset (email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { email },
    })

    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    const resetCode = codeGenerator()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) // Code expires in 1 hour

    // Create verification record for password reset
    const verification = this.verificationRepository.create({
      code: resetCode,
      expires: expiresAt,
      userId: user.id,
    })
    await this.verificationRepository.save(verification)

    await this.mailService.sendPasswordResetEmail(
      user.email,
      resetCode,
      `${user.firstName} ${user.lastName}`,
    )
    return true
  }

  // Reset Password
  async resetPassword (
    email: string,
    code: string,
    newPassword: string,
  ): Promise<boolean> {
    // Find user with valid verification code
    const user = await this.userRepository.findOne({
      where: { email },
    })

    if (!user) {
      throw new UnauthorizedException('Invalid or expired reset code')
    }

    const verification = await this.verificationRepository.findOne({
      where: {
        code: code,
        expires: MoreThan(new Date()),
        userId: user.id,
      },
      order: { expires: 'DESC' },
    })

    if (!verification) {
      throw new UnauthorizedException('Invalid or expired reset code')
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update user's password
    user.password = hashedPassword
    await this.userRepository.save(user)

    // Delete the used verification code
    await this.verificationRepository.remove(verification)

    // Send welcome email
    try {
      await this.mailService.sendWelcomeEmail(
        user.email,
        `${user.firstName} ${user.lastName}`,
      )
    } catch (error) {
      console.log('Error sending welcome email', error)
    }

    return true
  }

  async createAdmin (createAdminDto: CreateAdminDto): Promise<User> {
    const dto = {
      ...createAdminDto,
      fullName: `${createAdminDto.firstName} ${createAdminDto.lastName}`,
    }
    return await this.userService.createAdmin(dto)
  }

  // Validate Code (for both email verification and password reset)
  async validateCode (email: string, code: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } })

    if (!user) {
      throw new UnauthorizedException('Invalid or expired code')
    }

    const verification = await this.verificationRepository.findOne({
      where: {
        code: code,
        expires: MoreThan(new Date()),
        userId: user.id,
      },
      order: { expires: 'DESC' },
    })

    if (!verification) {
      throw new UnauthorizedException('Invalid or expired code')
    }

    // verify user
    user.isVerified = true
    await this.userRepository.save(user)

    // Delete the used verification code
    await this.verificationRepository.remove(verification)

    return true
  }

  async validateEmailUser (email: string, password: string): Promise<User> {
    const user = await this.userService.findOne({ email: email })
    if (!user) {
      throw new UnauthorizedException('User Not Found')
    }
    const isMatch: boolean = await bcrypt.compare(password, user.password)
    if (isMatch) {
      return user
    } else throw new UnauthorizedException('Wrong email or password')
  }

  // get logged in user
  async getLoggedInUser (req: AuthRequest): Promise<User> {
    console.log('The user is ' + JSON.stringify(req.user))
    // get the user id from the request
    const userId = req?.user?.id
    // get the user from the database
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['roles'],
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async testEmail (): Promise<boolean> {
    try {
      await this.mailService.sendPasswordResetEmail(
        'charlesndungutse19@gmail.com',
        '90897',
        'Test User',
      )
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  // Change Password
  async changePassword (
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    )
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect')
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      12,
    )

    // Update user's password
    user.password = hashedNewPassword
    await this.userRepository.save(user)

    return true
  }

  // Logout (invalidate token)
  async logout (userId: string): Promise<boolean> {
    // In a more sophisticated implementation, you might want to:
    // 1. Add the token to a blacklist
    // 2. Store logout timestamp
    // 3. Use refresh tokens

    // For now, we'll just return true as the frontend handles token removal
    // In a production environment, you might want to implement token blacklisting
    return true
  }
}
