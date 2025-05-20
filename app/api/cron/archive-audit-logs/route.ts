import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: Request) {
  try {
    // Check for secret token to prevent unauthorized access
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")
    const expectedToken = process.env.CRON_SECRET_TOKEN

    if (!token || token !== expectedToken) {
      // Return 404 instead of 401 to avoid revealing the endpoint exists
      return new Response(null, { status: 404 })
    }

    const supabase = await createClient()

    // Get retention period from settings
    const { data: settingData, error: settingError } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "audit_retention_days")
      .single()

    if (settingError && settingError.code !== "PGSQL_ERROR") {
      console.error("Error fetching audit retention setting:", settingError)
      return NextResponse.json({ error: "Failed to fetch audit retention setting" }, { status: 500 })
    }

    // Default to 90 days if not set
    const retentionDays = settingData?.value ? Number.parseInt(settingData.value) : 90

    // Calculate cutoff date
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays)
    const cutoffDateString = cutoffDate.toISOString()

    // Create audit_logs_archive table if it doesn't exist
    const { error: createTableError } = await supabase.rpc("create_audit_logs_archive_if_not_exists")

    if (createTableError) {
      console.error("Error creating audit_logs_archive table:", createTableError)
      return NextResponse.json({ error: "Failed to create archive table" }, { status: 500 })
    }

    // Move old logs to archive table
    const { data: archiveData, error: archiveError } = await supabase.rpc("archive_old_audit_logs", {
      cutoff_date: cutoffDateString,
    })

    if (archiveError) {
      console.error("Error archiving old audit logs:", archiveError)
      return NextResponse.json({ error: "Failed to archive old audit logs" }, { status: 500 })
    }

    // Record this action in the audit log using a system user ID or null
    const { error: auditError } = await supabase.from("audit_logs").insert({
      admin_id: null, // System action
      action: "archive",
      resource_type: "audit_log",
      new_data: { archived_count: archiveData || 0, cutoff_date: cutoffDateString },
    })

    if (auditError) {
      console.error("Error recording archive action in audit log:", auditError)
    }

    return NextResponse.json({
      success: true,
      message: `Archived audit logs older than ${cutoffDateString}`,
      archivedCount: archiveData || 0,
    })
  } catch (error) {
    console.error("Error in archive audit logs job:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
