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

  const response = await resend.emails.send({
    from: options.from || 'Gradverse <onboarding@gradvers.com>',
    to: options.to,
    subject: options.subject,
    html: options.html,
    attachments: [
      {
        path: 'https://gradvers.com/logo.png',
        filename: 'logo.png',
        contentId: 'logo-image',
      },
      ...(options.attachments || []),
    ],
  })
  return response
}
