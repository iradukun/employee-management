import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '../../guards/auth.guard';

@ApiTags('attendance')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('clock-in')
  @ApiResponse({ status: 201, description: 'Clocked in successfully.' })
  async clockIn(@CurrentUser() user: User) {
    return this.attendanceService.clockIn(user);
  }

  @Post('clock-out')
  @ApiResponse({ status: 200, description: 'Clocked out successfully.' })
  async clockOut(@CurrentUser() user: User) {
    return this.attendanceService.clockOut(user);
  }

  @Get('history')
  @ApiResponse({ status: 200, description: 'Get attendance history.' })
  async getHistory(@CurrentUser() user: User) {
    return this.attendanceService.getHistory(user);
  }
}
