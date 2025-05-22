import type React from "react";
import { AuthProvider } from "@/hooks/use-auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 p-6 bg-muted/40">{children}</main>
      </div>
    </AuthProvider>
  );
}