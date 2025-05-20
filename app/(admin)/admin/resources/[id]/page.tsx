import { createClient } from "@/lib/supabase/server"
import ResourceForm from "@/components/admin/resource-form"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Edit Resource | Admin Dashboard",
}

export default async function EditResourcePage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // If this is a new resource
  if (params.id === "new") {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link href="/admin/resources">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Resources
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Add New Resource</h1>
        </div>
        <ResourceForm isNew />
      </div>
    )
  }

  // Fetch existing resource
  const { data: resource } = await supabase.from("resources").select("*").eq("id", params.id).single()

  if (!resource) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin/resources">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resources
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Resource</h1>
      </div>
      <ResourceForm resource={resource} />
    </div>
  )
}
