import { Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm'
import { CurrentUser } from '../../decorators/current-user.decorator'
import { AuthGuard } from '../../guards/auth.guard'
import { User } from '../users/entities/user.entity'
import { AttendanceService } from './attendance.service'
import { ReportsService } from './reports.service'

@ApiTags('attendance')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor (
    private readonly attendanceService: AttendanceService,
    private readonly reportsService: ReportsService,
  ) {}

  @Post('clock-in')
  @ApiResponse({ status: 201, description: 'Clocked in successfully.' })
  async clockIn (@CurrentUser() user: User) {
    return this.attendanceService.clockIn(user)
  }

  @Post('clock-out')
  @ApiResponse({ status: 200, description: 'Clocked out successfully.' })
  async clockOut (@CurrentUser() user: User) {
    return this.attendanceService.clockOut(user)
  }

  @Get('history')
  @ApiResponse({ status: 200, description: 'Get attendance history.' })
  async getHistory (@CurrentUser() user: User) {
    return this.attendanceService.getHistory(user)
  }

  @Get('reports/excel')
  @ApiResponse({
    status: 200,
    description: 'Download attendance report (Excel).',
  })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  async downloadExcel (
    @Res() res: Response,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const where: any = {}
    if (startDate && endDate) {
      where.entryTime = Between(new Date(startDate), new Date(endDate))
    } else if (startDate) {
      where.entryTime = MoreThanOrEqual(new Date(startDate))
    } else if (endDate) {
      where.entryTime = LessThanOrEqual(new Date(endDate))
    }

    const attendances = await this.attendanceService.findAll({ where })
    const buffer = await this.reportsService.generateExcel(attendances)

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=attendance_report.xlsx',
      'Content-Length': buffer.length,
    })

    res.end(buffer)
  }

  @Get('reports/pdf')
  @ApiResponse({
    status: 200,
    description: 'Download attendance report (PDF).',
  })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  async downloadPdf (
    @Res() res: Response,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const where: any = {}
    if (startDate && endDate) {
      where.entryTime = Between(new Date(startDate), new Date(endDate))
    } else if (startDate) {
      where.entryTime = MoreThanOrEqual(new Date(startDate))
    } else if (endDate) {
      where.entryTime = LessThanOrEqual(new Date(endDate))
    }

    const attendances = await this.attendanceService.findAll({ where })
    const buffer = await this.reportsService.generatePdf(attendances)

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=attendance_report.pdf',
      'Content-Length': buffer.length,
    })

    res.end(buffer)
  }
}
