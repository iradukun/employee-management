import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceService } from './attendance.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';
import { User } from '../users/entities/user.entity';
import { BadRequestException } from '@nestjs/common';

describe('AttendanceService', () => {
  let service: AttendanceService;
  let repo: Partial<Repository<Attendance>>;
  let queue: Partial<Queue>;

  beforeEach(async () => {
    repo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };
    queue = {
      add: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        {
          provide: getRepositoryToken(Attendance),
          useValue: repo,
        },
        {
          provide: getQueueToken('attendance'),
          useValue: queue,
        },
      ],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('clockIn', () => {
    it('should clock in a user successfully', async () => {
      const user = new User();
      user.id = 'user-1';
      user.email = 'test@example.com';
      user.firstName = 'Test';
      user.lastName = 'User';

      (repo.findOne as jest.Mock).mockResolvedValue(null); // No active session
      const newAttendance = new Attendance();
      newAttendance.entryTime = new Date();
      (repo.create as jest.Mock).mockReturnValue(newAttendance);
      (repo.save as jest.Mock).mockResolvedValue(newAttendance);

      const result = await service.clockIn(user);
      expect(result).toEqual(newAttendance);
      expect(queue.add).toHaveBeenCalledWith('clock-in', expect.any(Object));
    });

    it('should throw error if already clocked in', async () => {
      const user = new User();
      user.id = 'user-1';

      (repo.findOne as jest.Mock).mockResolvedValue(new Attendance()); // Active session exists

      await expect(service.clockIn(user)).rejects.toThrow(BadRequestException);
    });
  });
});
