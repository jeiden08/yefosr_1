import { NextResponse } from "next/server"
import { sendContactNotification } from "@/lib/email-service"

export async function POST(request: Request) {
  try {
    // Check if email functionality is disabled
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

    const formData = await request.json()
    const result = await sendContactNotification(formData)

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Server error sending notification:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
