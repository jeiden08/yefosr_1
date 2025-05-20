import type React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AuthProvider } from "@/hooks/use-auth"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/admin/login")
  }

  // Check if user is an admin
  const { data: admin, error } = await supabase.from("admins").select("*").eq("email", session.user.email).single()

  if (error || !admin) {
    // Sign out the user if they're not an admin
    await supabase.auth.signOut()
    redirect("/admin/login")
  }

  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <AdminHeader admin={admin} />
        <div className="flex flex-1">
          <AdminSidebar />
          <main className="flex-1 p-6 bg-muted/40">{children}</main>
        </div>
      </div>
    </AuthProvider>
  )
}
