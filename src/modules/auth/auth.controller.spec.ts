import { Test, TestingModule } from '@nestjs/testing'
import { ApiResponse } from '../../lib/types/api-response'
import { User } from '../users/entities/user.entity'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { LoginPayload } from './dto/login-payload.dto'
import { LoginDto } from './dto/login.dto'
import { SignupDto } from './dto/signup.dto'

describe('AuthController', () => {
  let controller: AuthController
  let authService: Partial<AuthService>

  beforeEach(async () => {
    authService = {
      signup: jest.fn(),
      login: jest.fn(),
      // verifyEmail: jest.fn(), // Not in AuthService interface directly? It's validateCode
      validateCode: jest.fn(),
      initiatePasswordReset: jest.fn(),
      resetPassword: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile()

    controller = module.get<AuthController>(AuthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('signup', () => {
    it('should create a new user', async () => {
      const signupDto: SignupDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        password: 'password123',
      }
      const user = new User()
      Object.assign(user, signupDto)
      user.id = '1'

      ;(authService.signup as jest.Mock).mockResolvedValue(user)

      const result = await controller.signup(signupDto)
      expect(result).toBeInstanceOf(ApiResponse)
      expect(result.data).toEqual(user)
    })
  })

  describe('login', () => {
    it('should return a JWT token', async () => {
      const loginDto: LoginDto = {
        credential: 'john@example.com',
        password: 'password123',
      }
      const payload: LoginPayload = {
        id: '1',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        token: 'jwt-token',
        roles: [],
      }

      ;(authService.login as jest.Mock).mockResolvedValue(payload)

      const result = await controller.login(loginDto)
      expect(result).toBeInstanceOf(ApiResponse)
      expect(result.data).toEqual(payload)
    })
  })
})
