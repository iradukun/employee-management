import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/render'
// import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend';
// import { EmailOptions } from '../../utils/mailersend';
import { sendEmail } from 'src/lib/utils/resend'
import { ResearchGroupInvitationEmail } from './templates/ResearchGroupInvitationEmail'
import { ResetPasswordEmail } from './templates/ResetPasswordEmail'
import { UserJoinedGroupEmail } from './templates/UserJoinedGroupEmail'
import { VerificationEmail } from './templates/VerificationEmail'
import { WelcomeEmail } from './templates/WelcomeEmail'

type AttachmentType = {
  filename: string
  content: Buffer
  contentType?: string
}

type MailParameters = {
  to: string
  subject: string
  body?: string
  html: string
  attachments?: AttachmentType[]
}

@Injectable()
export class MailService {
  constructor (private readonly configService: ConfigService) {
    // Commented out MailerSend implementation
    // console.log('MailService constructor called');
    // const apiKey = this.configService.get('MAILERSEND_API_KEY');
    // console.log('MailerSend API Key configured:', apiKey ? 'Yes' : 'No');
    // console.log('API Key length:', apiKey?.length || 0);
    // console.log('API Key value (first 10 chars):', apiKey ? apiKey.substring(0, 10) + '...' : 'undefined');
    // this.mailerSend = new MailerSend({
    //   apiKey: apiKey || '',
    // });
    // console.log('MailerSend instance created');
  }

  async sendEmailWithResend ({
    to,
    subject,
    body,
    html,
    attachments,
  }: MailParameters): Promise<void> {
    try {
      const response = await sendEmail({
        to: to,
        subject: subject,
        html: (html || body) ?? '',
        attachments,
      })
      console.log('Email sent with Resend', response)
    } catch (error) {
      console.log('Error sending email with Resend', error)
      throw error
    }
  }

  async sendEmail ({
    to,
    subject,
    body,
    html,
    attachments,
  }: MailParameters): Promise<void> {
    console.log('Sending email with Resend', {
      to,
      subject,
      body,
      html,
      attachments,
    })
    return this.sendEmailWithResend({ to, subject, body, html, attachments })
  }

  /**
   * Send a password reset email with a reset code.
   * @param to Recipient email address.
   * @param resetCode The code for resetting the password.
   * @param fullName The full name of the recipient.
   */
  async sendPasswordResetEmail (
    to: string,
    resetCode: string,
    fullName: string,
  ) {
    const subject = 'Reset Your Password'
    const emailHtml = await render(
      ResetPasswordEmail({
        resetCode,
        fullName,
      }),
    )

    await this.sendEmail({
      to: to,
      subject,
      html: emailHtml,
    })
  }

  /**
   * Send a verification email with a verification code.
   * @param to Recipient email address.
   * @param verificationCode The code to verify the user's email address.
   * @param fullName The full name of the recipient.
   */
  async sendVerificationEmail (
    to: string,
    verificationCode: string,
    fullName: string,
  ) {
    const subject = 'Verify Your Email Address'
    const emailHtml = await render(
      VerificationEmail({
        verificationCode,
        fullName,
      }),
    )

    await this.sendEmail({
      to: to,
      subject,
      html: emailHtml,
    })
  }

  /**
   * Send a welcome email to new users.
   * @param to Recipient email address.
   * @param fullName The full name of the recipient.
   * @param password The initial password for the account.
   */
  async sendWelcomeEmail (to: string, fullName: string, password: string) {
    const subject = 'Welcome to GradVers - Your Academic Journey Starts Here!'
    const emailHtml = await render(
      WelcomeEmail({
        fullName,
        email: to,
        password,
      }),
    )

    await this.sendEmail({
      to: to,
      subject,
      html: emailHtml,
    })
  }

  async sendUserJoinedGroupEmail (
    to: string,
    fullName: string,
    groupName: string,
    inviterName: string,
  ) {
    const subject = `You've joined ${groupName}! 🎓`
    const emailHtml = await render(
      UserJoinedGroupEmail({
        fullName,
        groupName,
        inviterName,
      }),
    )

    await this.sendEmail({
      to,
      subject,
      html: emailHtml,
    })
  }

  async sendResearchGroupInvitationEmail (
    to: string,
    inviteeName: string | undefined,
    groupName: string,
    inviterName: string,
    invitationLink: string,
    message?: string,
  ): Promise<void> {
    const subject = `Invitation to join ${groupName} 🎓`
    const emailHtml = await render(
      ResearchGroupInvitationEmail({
        inviteeName,
        groupName,
        inviterName,
        message,
        invitationLink,
      }),
    )

    await this.sendEmail({
      to,
      subject,
      html: emailHtml,
    })
  }
}
