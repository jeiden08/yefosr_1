import { toast } from "@/components/ui/use-toast"

type ErrorWithMessage = {
  message: string
  details?: string
  hint?: string
  code?: string
}

export function handleSupabaseError(error: unknown, customMessage?: string): void {
  console.error("Supabase error:", error)

  let message = customMessage || "An unexpected error occurred"

  if (error && typeof error === "object" && "message" in error) {
    const supabaseError = error as ErrorWithMessage
    message = supabaseError.message

    // Log additional details if available
    if (supabaseError.details) {
      console.error("Error details:", supabaseError.details)
    }

    if (supabaseError.hint) {
      console.error("Error hint:", supabaseError.hint)
    }

    // Handle specific error codes
    if (supabaseError.code === "PGRST301") {
      message = "Resource not found"
    } else if (supabaseError.code === "23505") {
      message = "This record already exists"
    } else if (supabaseError.code === "42501") {
      message = "You don't have permission to perform this action"
    }
  }

  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  })
}
