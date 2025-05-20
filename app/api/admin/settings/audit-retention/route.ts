import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  // Get the current retention setting
  const { data, error } = await supabase.from("settings").select("value").eq("key", "audit_retention_days").single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ days: Number.parseInt(data?.value || "90") })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { days } = await request.json()

  // Validate the input
  const retentionDays = Number.parseInt(days)
  if (isNaN(retentionDays) || retentionDays < 1) {
    return NextResponse.json({ error: "Invalid retention period" }, { status: 400 })
  }

  // Update the setting
  const { error } = await supabase
    .from("settings")
    .update({ value: retentionDays.toString() })
    .eq("key", "audit_retention_days")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, days: retentionDays })
}
