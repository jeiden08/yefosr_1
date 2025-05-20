import { createClient } from "@/lib/supabase/server"
import type { ContactSubmission } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export const metadata = {
  title: "Contact Messages | Admin Dashboard",
}

export default async function ContactMessagesPage() {
  const supabase = createClient()

  const { data: messages } = await supabase
    .from("contact_submissions")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Messages</h1>
          <p className="text-muted-foreground">Manage contact form submissions from website visitors.</p>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages && messages.length > 0 ? (
              messages.map((message: ContactSubmission) => (
                <TableRow key={message.id}>
                  <TableCell className="font-medium">{message.name}</TableCell>
                  <TableCell>{message.email}</TableCell>
                  <TableCell>{message.subject || "N/A"}</TableCell>
                  <TableCell>{new Date(message.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={message.status === "unread" ? "default" : "outline"}>
                      {message.status === "unread" ? "Unread" : "Read"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/contact-messages/${message.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                  No contact messages found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
