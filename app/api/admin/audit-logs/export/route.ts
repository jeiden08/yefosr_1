import { createClient } from "@/lib/supabase/server"
import { format } from "date-fns"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const adminId = searchParams.get("adminId")
  const resourceType = searchParams.get("resourceType")
  const action = searchParams.get("action")
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")
  const search = searchParams.get("search")

  const supabase = await createClient()

  // Build the query
  let query = supabase.from("audit_logs").select("*, admins(name, email)").order("created_at", { ascending: false })

  // Apply filters
  if (adminId) {
    query = query.eq("admin_id", adminId)
  }

  if (resourceType) {
    query = query.eq("resource_type", resourceType)
  }

  if (action) {
    query = query.eq("action", action)
  }

  if (startDate) {
    query = query.gte("created_at", `${startDate}T00:00:00Z`)
  }

  if (endDate) {
    query = query.lte("created_at", `${endDate}T23:59:59Z`)
  }

  if (search) {
    query = query.or(`resource_id.ilike.%${search}%, previous_data.ilike.%${search}%, new_data.ilike.%${search}%`)
  }

  // Execute the query
  const { data: logs, error } = await query

  if (error) {
    console.error("Error fetching audit logs for export:", error)
    return new Response("Error exporting audit logs", { status: 500 })
  }

  // Convert logs to CSV
  const csvHeader = "Date,Time,Admin Name,Admin Email,Action,Resource Type,Resource ID,IP Address\n"

  const csvRows = logs
    .map((log) => {
      const date = new Date(log.created_at)
      const dateStr = format(date, "yyyy-MM-dd")
      const timeStr = format(date, "HH:mm:ss")

      const adminName = log.admins?.name || "Unknown"
      const adminEmail = log.admins?.email || "Unknown"
      const resourceType = log.resource_type
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      // Escape fields that might contain commas
      const escapeCsv = (field: string) => {
        if (field && (field.includes(",") || field.includes('"'))) {
          return `"${field.replace(/"/g, '""')}"`
        }
        return field
      }

      return [
        dateStr,
        timeStr,
        escapeCsv(adminName),
        escapeCsv(adminEmail),
        log.action,
        escapeCsv(resourceType),
        escapeCsv(log.resource_id || "N/A"),
        log.ip_address,
      ].join(",")
    })
    .join("\n")

  const csv = csvHeader + csvRows

  // Return CSV as a downloadable file
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="audit-logs-${format(new Date(), "yyyy-MM-dd")}.csv"`,
    },
  })
}
