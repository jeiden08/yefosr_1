"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { Mail, MailOpen } from "lucide-react"

interface MarkAsReadButtonProps {
  id: string
  status: string
}

export function MarkAsReadButton({ id, status }: MarkAsReadButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const isUnread = status === "unread"

  const handleToggleStatus = async () => {
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({
          status: isUnread ? "read" : "unread",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (error) throw error

      toast({
        title: `Message marked as ${isUnread ? "read" : "unread"}`,
        description: `The message has been marked as ${isUnread ? "read" : "unread"}.`,
      })

      router.refresh()
    } catch (error) {
      console.error("Error updating message status:", error)
      toast({
        title: "Something went wrong",
        description: "The message status could not be updated. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleToggleStatus} disabled={isLoading}>
      {isUnread ? (
        <>
          <MailOpen className="mr-2 h-4 w-4" />
          Mark as Read
        </>
      ) : (
        <>
          <Mail className="mr-2 h-4 w-4" />
          Mark as Unread
        </>
      )}
    </Button>
  )
}
