import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ApiResponse } from '../../lib/types/api-response';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: Partial<UsersService>;

  beforeEach(async () => {
    usersService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        phoneNumber: '0987654321',
        password: 'password123',
        roles: [],
      };
      const user = new User();
      Object.assign(user, createUserDto);
      user.id = '2';

      (usersService.createUser as jest.Mock).mockResolvedValue(user);

      const result = await controller.create(createUserDto);
      expect(result).toBeInstanceOf(ApiResponse);
      expect(result.data).toEqual(user);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [new User(), new User()];
      (usersService.findAll as jest.Mock).mockResolvedValue(users);

      const result = await controller.findAll(0, 10);
      expect(result).toBeInstanceOf(ApiResponse);
      expect(result.data).toHaveLength(2);
    });
  });
});
