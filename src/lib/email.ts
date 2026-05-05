import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    })
    return true
  } catch (error) {
    console.error("Email error:", error)
    return false
  }
}

export async function sendBulkEmail(emails: string[], subject: string, html: string) {
  const results = await Promise.all(
    emails.map((email) => sendEmail(email, subject, html))
  )
  return results.filter(Boolean).length
}