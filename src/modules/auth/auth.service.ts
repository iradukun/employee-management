import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from 'generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { log } from 'console';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginPayload } from './dto/login-payload.dto';
import { loginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup-dto';
import { codeGenerator } from 'src/lib/utils/func.util';
import type { AuthRequest, TokenProps } from 'src/lib/types';

type UserWithRoles = Prisma.UserGetPayload<{ include: { roles: true } }>;

@Injectable()
export class AuthService {
  constructor(
    private readonly mailService: MailService,
    private readonly databaseService: PrismaService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  validateAll = async (credential: string): Promise<number> => {
    // Check if the credential is a valid email address
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(credential)) {
      return 1;
    }

    // Check if the credential matches the pattern for a Rwandan phone number
    const phoneNumberPattern = /^250\d{9}$/;
    if (phoneNumberPattern.test(credential)) {
      return 2;
    }

    // If neither of the above conditions are met, return 3
    return 3;
  };

  async login(loginDto: loginDto): Promise<LoginPayload> {
    let user: UserWithRoles | null = null;
    const credentialType = await this.validateAll(loginDto.credential);
    log('The credential type is ' + credentialType);

    switch (credentialType) {
      case 1:
        user = await this.validateEmailUser(
          loginDto.credential,
          loginDto.password,
        );
        break;
      default:
        throw new UnauthorizedException('Invalid credential type');
    }

    if (!user) {
      throw new UnauthorizedException('User not found or invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('User not verified');
    }

    const tokenProps: TokenProps = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
    };
    // console.log('Debug secret ' + process.env.SECRET_KEY);

    const loginPayload: LoginPayload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
      token: this.jwtService.sign(tokenProps, {
        secret: process.env.SECRET_KEY,
      }),
    };

    return loginPayload;
  }

  async signup(signupDto: SignupDto): Promise<UserEntity> {
    const userRole = await this.databaseService.role.findUnique({
      where: { name: 'USER' },
    });
    if (!userRole) {
      throw new NotFoundException('Role not found');
    }

    // check if the user already exists
    const existingUser = await this.userService.findOne({
      email: signupDto.email,
    });
    if (existingUser) {
      // check if the user is not verified
      if (existingUser.isVerified) {
        throw new BadRequestException(
          'User already with this email exists, please verify your account',
          {
            cause: {
              email: signupDto.email,
              notVerified: !existingUser.isVerified,
            },
          },
        );
      }
      throw new BadRequestException('User already with this email exists');
    }

    // Create the user
    const user = await this.userService.createUser({
      ...signupDto,
      roles: [userRole.id],
    });

    // Generate verification code
    const verificationCode = codeGenerator();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Code expires in 24 hours

    // Create verification record
    await this.databaseService.verification.create({
      data: {
        code: verificationCode,
        expires: expiresAt,
        userId: user.id,
      },
    });

    try {
      // Send verification email
      await this.mailService.sendVerificationEmail(
        user.email,
        verificationCode,
        `${user.firstName} ${user.lastName}`,
      );
    } catch (error) {
      console.log('Error sending verification email', error);
    }
    return user;
  }

  // resend verification email
  async resendVerificationEmail(email: string): Promise<string> {
    const user = await this.databaseService.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const verificationCode = codeGenerator();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Code expires in 24 hours

    await this.databaseService.verification.create({
      data: {
        code: verificationCode,
        expires: expiresAt,
        userId: user.id,
      },
    });

    await this.mailService.sendVerificationEmail(
      user.email,
      verificationCode,
      `${user.firstName} ${user.lastName}`,
    );

    return 'Verification email sent';
  }

  // Initiate Password Reset
  async initiatePasswordReset(email: string): Promise<boolean> {
    const user = await this.databaseService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const resetCode = codeGenerator();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Code expires in 1 hour

    // Create verification record for password reset
    await this.databaseService.verification.create({
      data: {
        code: resetCode,
        expires: expiresAt,
        userId: user.id,
      },
    });

    await this.mailService.sendPasswordResetEmail(
      user.email,
      resetCode,
      `${user.firstName} ${user.lastName}`,
    );
    return true;
  }

  // Reset Password
  async resetPassword(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<boolean> {
    const user = await this.databaseService.user.findUnique({
      where: { email },
      include: {
        verifications: {
          where: {
            code: code,
            expires: {
              gt: new Date(), // Check if code hasn't expired
            },
          },
          orderBy: {
            expires: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!user || user.verifications.length === 0) {
      throw new UnauthorizedException('Invalid or expired reset code');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user's password
    await this.databaseService.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    });

    // Delete the used verification code
    await this.databaseService.verification.delete({
      where: { id: user.verifications[0].id },
    });

    return true;
  }

  async createAdmin(createAdminDto: CreateAdminDto): Promise<User> {
    const dto = {
      ...createAdminDto,
      fullName: `${createAdminDto.firstName} ${createAdminDto.lastName}`,
    };
    return (await this.userService.createAdmin(dto)) as unknown as User;
  }

  // Validate Code (for both email verification and password reset)
  async validateCode(email: string, code: string): Promise<boolean> {
    const user = await this.databaseService.user.findUnique({
      where: { email },
      include: {
        verifications: {
          where: {
            code: code,
            expires: {
              gt: new Date(), // Check if code hasn't expired
            },
          },
          orderBy: {
            expires: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!user || user.verifications.length === 0) {
      throw new UnauthorizedException('Invalid or expired code');
    }

    // verify user
    await this.databaseService.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
      },
    });

    // Delete the used verification code
    await this.databaseService.verification.delete({
      where: { id: user.verifications[0].id },
    });

    return true;
  }

  async validateEmailUser(
    email: string,
    password: string,
  ): Promise<UserWithRoles> {
    const user = await this.userService.findOne({ email: email });
    if (!user) {
      throw new UnauthorizedException('User Not Found');
    }
    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return user;
    } else throw new UnauthorizedException('Wrong email or password');
  }

  // get logged in user
  async getLoggedInUser(req: AuthRequest): Promise<User> {
    console.log('The user is ' + JSON.stringify(req.user));
    // get the user id from the request
    const userId = req?.user?.id;
    // get the user from the database
    const user = await this.databaseService.user.findUnique({
      where: {
        id: userId,
      },
      include: { roles: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async testEmail(): Promise<boolean> {
    try {
      await this.mailService.sendPasswordResetEmail(
        'charlesndungutse19@gmail.com',
        '90897',
        'Test User',
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // Change Password
  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<boolean> {
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      12,
    );

    // Update user's password
    await this.databaseService.user.update({
      where: { id: userId },
      data: {
        password: hashedNewPassword,
      },
    });

    return true;
  }

  // Logout (invalidate token)
  async logout(userId: string): Promise<boolean> {
    // In a more sophisticated implementation, you might want to:
    // 1. Add the token to a blacklist
    // 2. Store logout timestamp
    // 3. Use refresh tokens

    // For now, we'll just return true as the frontend handles token removal
    // In a production environment, you might want to implement token blacklisting
    return true;
  }
}
