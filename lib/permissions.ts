import { createClient } from "@/lib/supabase/server"
import { cache } from "react"

export type Permission = {
  id: string
  name: string
  description: string | null
  resource: string
  action: string
}

export type Role = {
  id: string
  name: string
  description: string | null
}

// Cache the getUserPermissions function to avoid repeated database calls
export const getUserPermissions = cache(async (userId: string): Promise<Permission[]> => {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("permissions")
      .select(`
        id, name, description, resource, action,
        role_permissions!inner(
          role_id,
          admin_roles!inner(
            admin_id
          )
        )
      `)
      .eq("role_permissions.admin_roles.admin_id", userId)

    if (error) {
      console.error("Error fetching user permissions:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getUserPermissions:", error)
    return []
  }
})

export const getUserRoles = cache(async (userId: string): Promise<Role[]> => {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("roles")
      .select(`
        id, name, description,
        admin_roles!inner(admin_id)
      `)
      .eq("admin_roles.admin_id", userId)

    if (error) {
      console.error("Error fetching user roles:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getUserRoles:", error)
    return []
  }
})

export function hasPermission(permissions: Permission[], resource: string, action: string): boolean {
  // Super admin has all permissions
  if (permissions.some((p) => p.name === "manage_users" && p.resource === "users")) {
    return true
  }

  // Check for specific permission
  return permissions.some(
    (p) => (p.resource === resource && p.action === action) || (p.resource === resource && p.action === "manage"),
  )
}
