import 'dotenv/config'
import { Attachment, Resend } from 'resend'

export type EmailOptions = {
  to: string
  subject: string
  html: string
  from?: string
  attachments?: Attachment[]
}

/**
 * Send an email using Resend.
 * @param options - The email options.
 * @param options.to - The recipient's email address.
 * @param options.subject - The email subject.
 * @param options.html - The HTML content of the email.
 */
export const sendEmail = async (options: EmailOptions) => {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.warn('RESEND_API_KEY is not defined. Email sending skipped.')
    return { error: 'Missing API Key' }
  }

  const resend = new Resend(apiKey)

  try {
    const response = await resend.emails.send({
      from: options.from || 'Employee Management <onboarding@resend.dev>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments || [],
    })
    return response
  } catch (error) {
    console.warn(
      'Failed to send email via Resend. Falling back to local logging.',
      error,
    )
    console.log('--- EMAIL SIMULATION ---')
    console.log('To:', options.to)
    console.log('Subject:', options.subject)
    console.log(
      'Content (HTML preview):',
      options.html.substring(0, 500) + '...',
    )
    console.log('------------------------')
    return { id: 'simulated-email-id', error: null }
  }
}
