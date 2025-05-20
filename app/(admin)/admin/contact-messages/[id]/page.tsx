import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MarkAsReadButton } from "@/components/admin/mark-as-read-button"
import { DeleteContactMessageButton } from "@/components/admin/delete-contact-message-button"
import Link from "next/link"
import { ArrowLeft, Mail, Phone } from "lucide-react"

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: "Contact Message | Admin Dashboard",
  }
}

export default async function ContactMessagePage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: message } = await supabase.from("contact_submissions").select("*").eq("id", params.id).single()

  if (!message) {
    notFound()
  }

  // Mark message as read if it's unread
  if (message.status === "unread") {
    await supabase
      .from("contact_submissions")
      .update({ status: "read", updated_at: new Date().toISOString() })
      .eq("id", message.id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/admin/contact-messages">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Messages
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <MarkAsReadButton id={message.id} status={message.status} />
          <DeleteContactMessageButton id={message.id} />
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-xl">{message.subject || "No Subject"}</CardTitle>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant={message.status === "unread" ? "default" : "outline"}>
                {message.status === "unread" ? "Unread" : "Read"}
              </Badge>
              <span className="text-sm text-muted-foreground">{new Date(message.created_at).toLocaleString()}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-medium">From</h3>
            <div className="rounded-md border p-4">
              <div className="font-medium">{message.name}</div>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${message.email}`} className="hover:underline">
                  {message.email}
                </a>
              </div>
              {message.phone && (
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${message.phone}`} className="hover:underline">
                    {message.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium">Message</h3>
            <div className="rounded-md border p-4 whitespace-pre-wrap">{message.message}</div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href={`mailto:${message.email}?subject=Re: ${message.subject || "Your message"}`}>
              Reply via Email
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
