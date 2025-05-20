import { Resend } from "resend"

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Email addresses
const ADMIN_EMAIL = "yefosr@gmail.com"
const FROM_EMAIL = "YEFOSR Notifications <onboarding@resend.dev>" // You'll change this when you verify your domain

export type ContactFormData = {
  name: string
  email: string
  phone?: string | null
  subject: string
  message: string
}

export async function sendContactNotification(formData: ContactFormData) {
  const { name, email, phone, subject, message } = formData

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Contact Form Message: ${subject || "No Subject"}`,
      html: getContactEmailTemplate(formData),
    })

    if (error) {
      console.error("Error sending email:", error)
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error("Failed to send email notification:", error)
    throw error
  }
}

function getContactEmailTemplate(formData: ContactFormData): string {
  const { name, email, phone, subject, message } = formData

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h1 style="color: #26A65B; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">New Contact Form Submission</h1>
      
      <div style="margin: 20px 0;">
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
        <p><strong>Subject:</strong> ${subject || "No Subject"}</p>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px;">
        <h2 style="font-size: 16px; margin-top: 0;">Message:</h2>
        <p style="white-space: pre-line;">${message}</p>
      </div>
      
      <div style="margin-top: 30px; font-size: 12px; color: #666; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 10px;">
        <p>This is an automated notification from your YEFOSR website.</p>
      </div>
    </div>
  `
}
