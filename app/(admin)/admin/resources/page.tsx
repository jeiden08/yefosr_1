import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Edit, Eye, EyeOff, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Resources | Admin Dashboard",
}

export default async function ResourcesPage() {
  const supabase = createClient()

  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .is("deleted_at", null)
    .order("order_index", { ascending: true })

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case "document":
        return "bg-blue-100 text-blue-800"
      case "report":
        return "bg-green-100 text-green-800"
      case "guide":
        return "bg-purple-100 text-purple-800"
      case "toolkit":
        return "bg-orange-100 text-orange-800"
      case "presentation":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
          <p className="text-muted-foreground">Manage downloadable resources for your website visitors.</p>
        </div>
        <Link href="/admin/resources/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Resource
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Title</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Order</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">File</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources && resources.length > 0 ? (
                  resources.map((resource) => (
                    <tr key={resource.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{resource.title}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={getResourceTypeColor(resource.resource_type)}>
                          {resource.resource_type.charAt(0).toUpperCase() + resource.resource_type.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{resource.order_index}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {resource.published ? (
                            <>
                              <Eye className="h-4 w-4 text-green-500 mr-2" />
                              <span>Published</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-4 w-4 text-muted-foreground mr-2" />
                              <span>Draft</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <a
                          href={resource.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          <span className="underline">View</span>
                        </a>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/resources/${resource.id}`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-muted-foreground">
                      No resources found. Add your first resource to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
