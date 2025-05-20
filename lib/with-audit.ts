import { recordAuditLog, type AuditAction, type AuditResourceType } from "@/lib/audit-logger"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

type HandlerFunction<T> = (params: T) => Promise<NextResponse>

interface AuditOptions {
  action: AuditAction
  resourceType: AuditResourceType
  getResourceId?: (params: any, result?: any) => string
  getPreviousData?: (params: any) => Promise<any>
  getNewData?: (params: any, result?: any) => any
  skipAuditOnError?: boolean
}

/**
 * Higher-order function that wraps an API route handler with audit logging
 *
 * @param handler The API route handler function
 * @param options Audit logging options
 * @returns A new handler function with audit logging
 */
export function withAudit<T>(handler: HandlerFunction<T>, options: AuditOptions): HandlerFunction<T> {
  return async (params: T) => {
    const supabase = await createClient()

    // Get admin ID from session
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const adminId = session?.user?.id

    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get previous data if needed
    let previousData
    if (options.getPreviousData) {
      try {
        previousData = await options.getPreviousData(params)
      } catch (error) {
        console.error("Error fetching previous data for audit log:", error)
      }
    }

    let result: NextResponse
    let resultData: any
    let success = true

    try {
      // Execute the original handler
      result = await handler(params)

      // Check if the response indicates an error
      if (!result.ok) {
        success = false
        if (options.skipAuditOnError) {
          return result
        }
      }

      // Clone the result to get the data
      try {
        resultData = await result.clone().json()
      } catch (error) {
        console.error("Error parsing response JSON for audit log:", error)
        resultData = { error: "Failed to parse response" }
      }
    } catch (error) {
      console.error("Error in handler execution:", error)
      success = false

      // Create an error response
      result = NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
      resultData = { error: "Internal Server Error" }

      if (options.skipAuditOnError) {
        return result
      }
    }

    // Get resource ID
    let resourceId
    if (options.getResourceId) {
      try {
        resourceId = options.getResourceId(params, resultData)
      } catch (error) {
        console.error("Error getting resource ID for audit log:", error)
      }
    }

    // Get new data
    let newData
    if (options.getNewData) {
      try {
        newData = options.getNewData(params, resultData)
      } catch (error) {
        console.error("Error getting new data for audit log:", error)
        newData = resultData
      }
    } else {
      newData = resultData
    }

    // Record audit log
    try {
      await recordAuditLog({
        adminId,
        action: options.action,
        resourceType: options.resourceType,
        resourceId,
        previousData,
        newData,
      })
    } catch (error) {
      console.error("Error recording audit log:", error)
      // Don't fail the request if audit logging fails
    }

    return result
  }
}
