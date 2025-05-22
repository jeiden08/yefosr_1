import { createClient } from "./server"
import type { Admin } from "@/lib/types"

export async function getAdminById(id: string): Promise<Admin | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) return null
  return data as Admin
}