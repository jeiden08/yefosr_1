import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
  const supabase = await createClient()

  try {
    // Get the retention period setting
    const { data: settingData } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "audit_retention_days")
      .single()

    const retentionDays = Number.parseInt(settingData?.value || "90")

    // Calculate the cutoff date
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

    // Call the archive function
    const { data, error } = await supabase.rpc("archive_old_audit_logs", { cutoff_date: cutoffDate.toISOString() })

    if (error) {
      console.error("Error archiving audit logs:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, archivedCount: data })
  } catch (error) {
    console.error("Error in archive process:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
