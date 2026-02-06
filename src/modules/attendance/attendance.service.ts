import { InjectQueue } from '@nestjs/bull'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Queue } from 'bull'
import { FindManyOptions, IsNull, Repository } from 'typeorm'
import { User } from '../users/entities/user.entity'
import { Attendance } from './entities/attendance.entity'

@Injectable()
export class AttendanceService {
  constructor (
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectQueue('attendance') private attendanceQueue: Queue,
  ) {}

  async findAll(options?: FindManyOptions<Attendance>): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      ...options,
      relations: ['user'],
      order: { entryTime: 'DESC' },
    });
  }

  async clockIn (user: User): Promise<Attendance> {
    // Check if user is already clocked in (has an entry without exit)
    const activeAttendance = await this.attendanceRepository.findOne({
      where: {
        userId: user.id,
        exitTime: IsNull(),
      },
    })

    if (activeAttendance) {
      throw new BadRequestException('You are already clocked in.')
    }

    const attendance = this.attendanceRepository.create({
      userId: user.id,
      entryTime: new Date(),
    })

    const savedAttendance = await this.attendanceRepository.save(attendance)

    try {
      const addJob = this.attendanceQueue.add('clock-in', {
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        time: savedAttendance.entryTime.toLocaleString(),
      })
      // Timeout after 2 seconds to prevent hanging if Redis is down
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Queue timeout')), 2000),
      )
      await Promise.race([addJob, timeout])
    } catch (error) {
      console.error('Failed to add clock-in job to queue:', error)
      // Continue execution even if email notification fails
    }

    return savedAttendance
  }

  async clockOut (user: User): Promise<Attendance> {
    // Find active attendance
    const activeAttendance = await this.attendanceRepository.findOne({
      where: {
        userId: user.id,
        exitTime: IsNull(),
      },
    })

    if (!activeAttendance) {
      throw new BadRequestException('You are not clocked in.')
    }

    activeAttendance.exitTime = new Date()
    const savedAttendance = await this.attendanceRepository.save(
      activeAttendance,
    )

    try {
      const addJob = this.attendanceQueue.add('clock-out', {
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        time: savedAttendance.exitTime.toLocaleString(),
      })
      // Timeout after 2 seconds to prevent hanging if Redis is down
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Queue timeout')), 2000),
      )
      await Promise.race([addJob, timeout])
    } catch (error) {
      console.error('Failed to add clock-out job to queue:', error)
      // Continue execution even if email notification fails
    }

    return savedAttendance
  }

  async getHistory (user: User): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: { userId: user.id },
      order: { entryTime: 'DESC' },
    })
  }
}
