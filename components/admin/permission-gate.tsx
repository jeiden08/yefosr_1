"use client"

import { usePermissions } from "@/hooks/use-permissions"
import type { Permission } from "@/lib/permissions"
import type { ReactNode } from "react"

interface PermissionGateProps {
  resource: string
  action: string
  children: ReactNode
  fallback?: ReactNode
  permissions: Permission[]
}

export function PermissionGate({
  resource,
  action,
  children,
  fallback = null,
  permissions: initialPermissions,
}: PermissionGateProps) {
  const { hasPermission } = usePermissions(initialPermissions)

  if (hasPermission(resource, action)) {
    return <>{children}</>
  }

  return <>{fallback}</>
}
