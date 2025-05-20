import { createClient } from "@/lib/supabase/server"
import { getUserPermissions } from "@/lib/permissions"
import { PermissionGate } from "@/components/admin/permission-gate"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export default async function RolesPage() {
  const supabase = await createClient()
  const { data: roles = [] } = await supabase.from("roles").select("*").order("name")

  // Get current user's permissions
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const permissions = await getUserPermissions(user?.id || "")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Roles & Permissions</h1>

        <PermissionGate resource="users" action="manage" permissions={permissions}>
          <Button asChild>
            <Link href="/admin/roles/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Role
            </Link>
          </Button>
        </PermissionGate>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Roles</CardTitle>
          <CardDescription>Manage user roles and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell className="text-right">
                    <PermissionGate resource="users" action="manage" permissions={permissions}>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/roles/${role.id}`}>Edit</Link>
                      </Button>
                    </PermissionGate>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
