import { transporter } from '@/services/nodemaliler.config'

export async function sendWelcomeEmail(toEmail: string, name: string) {
  // Configure nodemailer transport (example using Gmail SMTP)
 
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Welcome to Prabisha Agency!',
    text: `Hi ${name},\n\nWelcome aboard! Your account has been created successfully.\n\nBest regards,\nPrabisha Team`,
  }

  // Send mail, returns info if success, throws error if fails
  return await transporter.sendMail(mailOptions)
}