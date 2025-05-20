import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

export type AuditAction = "create" | "update" | "delete" | "login" | "logout" | "view" | "download" | "upload"

export type AuditResourceType =
  | "program"
  | "event"
  | "resource"
  | "blog_post"
  | "gallery_item"
  | "partner"
  | "impact_stat"
  | "user"
  | "role"
  | "permission"
  | "setting"

interface AuditLogParams {
  adminId: string
  action: AuditAction
  resourceType: AuditResourceType
  resourceId?: string
  previousData?: any
  newData?: any
}

export async function recordAuditLog({
  adminId,
  action,
  resourceType,
  resourceId,
  previousData,
  newData,
}: AuditLogParams) {
  try {
    const supabase = await createClient()
    const headersList = headers()

    // Get IP address and user agent
    const ipAddress = headersList.get("x-forwarded-for") || "unknown"
    const userAgent = headersList.get("user-agent") || "unknown"

    const { error } = await supabase.from("audit_logs").insert({
      admin_id: adminId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      previous_data: previousData || null,
      new_data: newData || null,
      ip_address: ipAddress,
      user_agent: userAgent,
    })

    if (error) {
      console.error("Error recording audit log:", error)
    }
  } catch (error) {
    console.error("Error in recordAuditLog:", error)
  }
}

export async function getAuditLogs({
  adminId,
  resourceType,
  action,
  startDate,
  endDate,
  page = 1,
  pageSize = 20,
}: {
  adminId?: string
  resourceType?: AuditResourceType
  action?: AuditAction
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
}) {
  try {
    const supabase = await createClient()
    let query = supabase.from("audit_logs").select("*, admins(name, email)")

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
      query = query.gte("created_at", startDate)
    }

    if (endDate) {
      query = query.lte("created_at", endDate)
    }

    // Apply pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to)
      .returns<any[]>()

    if (error) {
      console.error("Error fetching audit logs:", error)
      return { logs: [], count: 0 }
    }

    return { logs: data || [], count: count || 0 }
  } catch (error) {
    console.error("Error in getAuditLogs:", error)
    return { logs: [], count: 0 }
  }
}
