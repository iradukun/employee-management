import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiResponse as SwaggerResponse,
} from '@nestjs/swagger';
import type { User } from 'generated/prisma/client';
import { Allow } from 'src/decorators/allow.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiResponse } from 'src/lib/types/api-response';
import type { AuthRequest } from 'src/lib/types';
import { UserEntity } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginPayload } from './dto/login-payload.dto';
import { loginDto } from './dto/login.dto';
import { ResetPasswordDTO } from './dto/ResetPasswordDTO.dto';
import { SignupDto } from './dto/signup-dto';
import { ValidateCodeDTO } from './dto/ValidateCodeDTO.dto';
import { VerifyCodeDto } from './dto/verify-code-dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // credential login
  @Allow()
  @Post('/login')
  @ApiBody({ type: loginDto })
  @SwaggerResponse({ type: LoginPayload })
  async login(@Body() loginDto: loginDto): Promise<ApiResponse<LoginPayload>> {
    return new ApiResponse<LoginPayload>(
      true,
      'Logged in Successfully',
      await this.authService.login(loginDto),
      200,
    );
  }

  @Allow()
  @Post('/signup')
  @ApiBody({ type: SignupDto })
  @SwaggerResponse({ type: UserEntity })
  async signup(@Body() signupDto: SignupDto): Promise<ApiResponse<UserEntity>> {
    console.log('signupDto', signupDto);
    return new ApiResponse<UserEntity>(
      true,
      'Signed up Successfully',
      await this.authService.signup(signupDto),
      200,
    );
  }

  // resend verification code
  @Allow()
  @Post('/resend-verification-code')
  @ApiQuery({ name: 'email', type: String })
  async resendVerificationEmail(
    @Query('email') email: string,
  ): Promise<ApiResponse<string>> {
    return new ApiResponse<string>(
      true,
      'Verification email sent',
      await this.authService.resendVerificationEmail(email),
      200,
    );
  }

  // verify email
  @Allow()
  @Post('/verify-account')
  @ApiBody({ type: VerifyCodeDto })
  async verifyAccount(
    @Body() verifyCodeDto: VerifyCodeDto,
  ): Promise<ApiResponse<boolean>> {
    return new ApiResponse<boolean>(
      true,
      'Account verified',
      await this.authService.validateCode(
        verifyCodeDto.email,
        verifyCodeDto.code,
      ),
      200,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/profile/token')
  getCurrentUserToken(@CurrentUser() user: User): ApiResponse<User> {
    return new ApiResponse<User>(true, 'Logged in user found', user, 200);
  }

  @Post('create-admin')
  @Allow()
  @ApiOperation({ summary: 'Create a new admin user' })
  @SwaggerResponse({
    status: 201,
    description: 'The admin has been successfully created',
    // type: Admin,
  })
  @ApiBody({ type: CreateAdminDto })
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    const admin = await this.authService.createAdmin(createAdminDto);
    return new ApiResponse<User>(
      true,
      'Admin created successfully',
      admin,
      201,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/profile')
  async getCurrentUser(@Req() req: AuthRequest): Promise<ApiResponse<User>> {
    return new ApiResponse<User>(
      true,
      'Logged in user found',
      await this.authService.getLoggedInUser(req),
      200,
    );
  }

  // Initiate Password Reset
  @Allow()
  @Post('/password-reset/initiate/:email')
  @ApiParam({ name: 'email', type: String })
  async initiatePasswordReset(
    @Param('email') email: string,
  ): Promise<ApiResponse<string>> {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    await this.authService.initiatePasswordReset(email);
    return new ApiResponse<string>(
      true,
      'Password reset code sent to email',
      'Password reset initiation successful. Check your email for the reset code.',
      200,
    );
  }

  // Reset Password
  @Allow()
  @Post('/password-reset/complete')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDTO,
  ): Promise<ApiResponse<string>> {
    await this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.code,
      resetPasswordDto.newPassword,
    );
    return new ApiResponse<string>(
      true,
      'Password reset successful',
      'Password reset successful. You can now login with your new password.',
      200,
    );
  }

  // Validate Reset Code
  @Allow()
  @Post('/password-reset/validate')
  async validateResetCode(
    @Body() validateCodeDto: ValidateCodeDTO,
  ): Promise<ApiResponse<boolean>> {
    const isValid = await this.authService.validateCode(
      validateCodeDto.email,
      validateCodeDto.code,
    );
    return new ApiResponse<boolean>(
      true,
      'Code validation successful',
      isValid,
      200,
    );
  }

  @Allow()
  @Post('/test-mail')
  async testMail() {
    await this.authService.testEmail();
    return new ApiResponse<string>(
      true,
      'Mail sent successfully',
      'Mail sent successfully',
      200,
    );
  }

  // Change Password
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/change-password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(
    @CurrentUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(user.id, changePasswordDto);
    return new ApiResponse<string>(
      true,
      'Password changed successfully',
      'Password changed successfully',
      200,
    );
  }

  // Logout
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/logout')
  @ApiOperation({ summary: 'Logout user' })
  async logout(@CurrentUser() user: User) {
    await this.authService.logout(user.id);
    return new ApiResponse<string>(
      true,
      'Logged out successfully',
      'Logged out successfully',
      200,
    );
  }
}
