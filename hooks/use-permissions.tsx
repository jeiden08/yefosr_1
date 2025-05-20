"use client"

import { useEffect, useState } from "react"
import type { Permission } from "@/lib/permissions"

export function usePermissions(initialPermissions: Permission[] = []) {
  const [permissions, setPermissions] = useState<Permission[]>(initialPermissions)

  useEffect(() => {
    setPermissions(initialPermissions)
  }, [initialPermissions])

  const hasPermission = (resource: string, action: string): boolean => {
    // Super admin has all permissions
    if (permissions.some((p) => p.name === "manage_users" && p.resource === "users")) {
      return true
    }

    // Check for specific permission
    return permissions.some(
      (p) => (p.resource === resource && p.action === action) || (p.resource === resource && p.action === "manage"),
    )
  }

  return { permissions, hasPermission }
}
