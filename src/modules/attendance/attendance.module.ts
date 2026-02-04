import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MailModule } from '../mail/mail.module'
import { UsersModule } from '../users/users.module'
import { AttendanceController } from './attendance.controller'
import { AttendanceProcessor } from './attendance.processor'
import { AttendanceService } from './attendance.service'
import { Attendance } from './entities/attendance.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance]),
    BullModule.registerQueue({
      name: 'attendance',
    }),
    UsersModule,
    MailModule,
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService, AttendanceProcessor, JwtService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
