import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const pageSize = Number.parseInt(searchParams.get("pageSize") || "20")
  const adminId = searchParams.get("adminId")
  const resourceType = searchParams.get("resourceType")
  const action = searchParams.get("action")
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")
  const search = searchParams.get("search")

  const supabase = await createClient()

  // Build the query
  let query = supabase
    .from("audit_logs")
    .select("*, admins(name, email)", { count: "exact" })
    .order("created_at", { ascending: false })

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

  // Apply pagination
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  query = query.range(from, to)

  // Execute the query
  const { data: logs, error, count } = await query

  if (error) {
    console.error("Error fetching audit logs:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ logs, count })
}
