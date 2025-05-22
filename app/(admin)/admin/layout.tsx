import type React from "react";
import { AuthProvider } from "@/hooks/use-auth";
import { getAdminById } from "@/lib/supabase/fetch-admin";
import { AdminHeader } from "@/components/admin/admin-header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Hardcoded admin ID for now; replace with session-based ID in production.
  const admin = await getAdminById("84580430-1f03-4c87-8162-5eea1f410545");

  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <AdminHeader admin={admin} />
        <main className="flex-1 p-6 bg-muted/40">{children}</main>
      </div>
    </AuthProvider>
  );
}