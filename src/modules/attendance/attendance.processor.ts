import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from '../mail/mail.service';

@Processor('attendance')
export class AttendanceProcessor {
  constructor(private readonly mailService: MailService) {}

  @Process('clock-in')
  async handleClockIn(job: Job<{ email: string; name: string; time: string }>) {
    const { email, name, time } = job.data;
    await this.mailService.sendEmail({
      to: email,
      subject: 'Clock In Notification',
      html: `<p>Hello ${name},</p><p>You have clocked in at ${time}.</p>`,
    });
  }

  @Process('clock-out')
  async handleClockOut(job: Job<{ email: string; name: string; time: string }>) {
    const { email, name, time } = job.data;
    await this.mailService.sendEmail({
      to: email,
      subject: 'Clock Out Notification',
      html: `<p>Hello ${name},</p><p>You have clocked out at ${time}.</p>`,
    });
  }
}
