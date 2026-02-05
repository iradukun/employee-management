import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { MailService } from '../mail/mail.service'

@Processor('attendance')
export class AttendanceProcessor {
  constructor (private readonly mailService: MailService) {}

  @Process('clock-in')
  async handleClockIn (job: Job<{ email: string; name: string; time: string }>) {
    const { email, name, time } = job.data
    await this.mailService.sendAttendanceEmail(email, name, 'Clock In', time)
  }

  @Process('clock-out')
  async handleClockOut (
    job: Job<{ email: string; name: string; time: string }>,
  ) {
    const { email, name, time } = job.data
    await this.mailService.sendAttendanceEmail(email, name, 'Clock Out', time)
  }
}
