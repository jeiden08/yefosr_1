import { NextResponse } from "next/server"
import { Resend } from "resend"

// Create Resend instance with fallback for missing API key
const resendApiKey = process.env.RESEND_API_KEY || ""
const resend = new Resend(resendApiKey)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // Check if API key is available
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is not set. Email functionality is disabled.")
      return NextResponse.json(
        {
          warning: "Email functionality is disabled. Please set RESEND_API_KEY environment variable.",
          mockSuccess: true,
        },
        { status: 200 },
      )
    }

    // Send test email
    const { data, error } = await resend.emails.send({
      from: "YEFOSR Notifications <onboarding@resend.dev>",
      to: email,
      subject: "Test Notification - YEFOSR Website",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h1 style="color: #26A65B; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">Test Email</h1>
          
          <div style="margin: 20px 0;">
            <p>This is a test email from your YEFOSR website.</p>
            <p>If you're receiving this email, it means your notification system is working correctly!</p>
          </div>
          
          <div style="margin-top: 30px; font-size: 12px; color: #666; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 10px;">
            <p>This is an automated test message from your YEFOSR website.</p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("Error sending test email:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Server error sending test email:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
