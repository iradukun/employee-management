import { Body, Controller, Post, Query } from '@nestjs/common'
import {
  ApiBody,
  ApiQuery,
  ApiTags,
  ApiResponse as SwaggerResponse,
} from '@nestjs/swagger'
import { Allow } from 'src/decorators/allow.decorator'
import { ApiResponse } from 'src/lib/types/api-response'
import { User } from '../users/entities/user.entity'
import { AuthService } from './auth.service'
import { LoginPayload } from './dto/login-payload.dto'
import { loginDto } from './dto/login.dto'
import { ResetPasswordDTO } from './dto/ResetPasswordDTO.dto'
import { SignupDto } from './dto/signup-dto'
import { ValidateCodeDTO } from './dto/ValidateCodeDTO.dto'
import { VerifyCodeDto } from './dto/verify-code-dto'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor (private readonly authService: AuthService) {}

  // credential login
  @Allow()
  @Post('/login')
  @ApiBody({ type: loginDto })
  @SwaggerResponse({ type: LoginPayload })
  async login (@Body() loginDto: loginDto): Promise<ApiResponse<LoginPayload>> {
    return new ApiResponse<LoginPayload>(
      true,
      'Logged in Successfully',
      await this.authService.login(loginDto),
      200,
    )
  }

  @Allow()
  @Post('/signup')
  @ApiBody({ type: SignupDto })
  @SwaggerResponse({ type: User })
  async signup (@Body() signupDto: SignupDto): Promise<ApiResponse<User>> {
    console.log('signupDto', signupDto)
    return new ApiResponse<User>(
      true,
      'Signed up Successfully',
      await this.authService.signup(signupDto),
      200,
    )
  }

  // resend verification code
  @Allow()
  @Post('/resend-verification-code')
  @ApiQuery({ name: 'email', type: String })
  async resendVerificationEmail (
    @Query('email') email: string,
  ): Promise<ApiResponse<string>> {
    return new ApiResponse<string>(
      true,
      'Verification email sent',
      await this.authService.resendVerificationEmail(email),
      200,
    )
  }

  // verify email
  @Allow()
  @Post('/verify-account')
  @ApiBody({ type: VerifyCodeDto })
  async verifyAccount (
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
    )
  }

  // Initiate Password Reset
  @Allow()
  @Post('/initiate-password-reset')
  @ApiBody({ type: ResetPasswordDTO })
  async initiatePasswordReset (
    @Body() resetPasswordDto: ResetPasswordDTO,
  ): Promise<ApiResponse<boolean>> {
    return new ApiResponse<boolean>(
      true,
      'Password reset initiated',
      await this.authService.initiatePasswordReset(resetPasswordDto.email),
      200,
    )
  }

  // Validate Code
  @Allow()
  @Post('/validate-code')
  @ApiBody({ type: ValidateCodeDTO })
  async validateCode (
    @Body() validateCodeDto: ValidateCodeDTO,
  ): Promise<ApiResponse<boolean>> {
    return new ApiResponse<boolean>(
      true,
      'Code validated',
      await this.authService.validateCode(
        validateCodeDto.email,
        validateCodeDto.code,
      ),
      200,
    )
  }

  // Reset Password
  @Allow()
  @Post('/reset-password')
  @ApiBody({ type: ResetPasswordDTO })
  async resetPassword (
    @Body() resetPasswordDto: ResetPasswordDTO,
  ): Promise<ApiResponse<boolean>> {
    return new ApiResponse<boolean>(
      true,
      'Password reset successfully',
      await this.authService.resetPassword(
        resetPasswordDto.email,
        resetPasswordDto.code,
        resetPasswordDto.newPassword,
      ),
      200,
    )
  }
}
