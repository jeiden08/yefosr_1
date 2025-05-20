import { createClient } from "@/lib/supabase/server"
import { AnimatedSection } from "@/components/animated-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileText, FileArchive } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const metadata = {
  title: "Resources | Youth Empowerment For Self Reliance",
  description: "Download useful resources, reports, and toolkits from Youth Empowerment For Self Reliance.",
}

export default async function ResourcesPage() {
  let resources = []
  let resourcesByType = {}
  let resourceTypes = []

  try {
    const supabase = await createClient()

    // Fetch resources
    const { data: resourcesData, error: resourcesError } = await supabase
      .from("resources")
      .select("*")
      .eq("published", true)
      .is("deleted_at", null)
      .order("order_index", { ascending: true })

    if (!resourcesError && resourcesData) {
      resources = resourcesData

      // Group resources by type
      resourcesByType = resources.reduce((acc: Record<string, any[]>, resource) => {
        const type = resource.resource_type || "other"
        if (!acc[type]) {
          acc[type] = []
        }
        acc[type].push(resource)
        return acc
      }, {})

      // Get resource types for filtering
      resourceTypes = Object.keys(resourcesByType).sort()
    } else {
      console.error("Error fetching resources:", resourcesError)
    }
  } catch (error) {
    console.error("Error in ResourcesPage:", error)
  }

  const getResourceTypeLabel = (type: string) => {
    switch (type) {
      case "document":
        return "Documents"
      case "report":
        return "Reports"
      case "guide":
        return "Guides"
      case "toolkit":
        return "Toolkits"
      case "presentation":
        return "Presentations"
      default:
        return type.charAt(0).toUpperCase() + type.slice(1) + "s"
    }
  }

  const getFileIcon = (fileUrl: string) => {
    const ext = fileUrl.split(".").pop()?.toLowerCase()

    if (ext === "pdf") return <FileText className="h-8 w-8 text-red-500" />
    if (["doc", "docx"].includes(ext || "")) return <FileText className="h-8 w-8 text-blue-500" />
    if (["xls", "xlsx"].includes(ext || "")) return <FileText className="h-8 w-8 text-green-500" />
    if (["ppt", "pptx"].includes(ext || "")) return <FileText className="h-8 w-8 text-orange-500" />
    if (["zip", "rar"].includes(ext || "")) return <FileArchive className="h-8 w-8 text-purple-500" />

    return <FileText className="h-8 w-8 text-gray-500" />
  }

  return (
    <div className="container py-12 md:py-16">
      <AnimatedSection className="flex flex-col items-center text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-gradient">Resources</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Download useful resources, reports, and toolkits to learn more about our work and how you can get involved.
        </p>
      </AnimatedSection>

      {resourceTypes.length > 0 ? (
        <div className="space-y-12">
          {resourceTypes.map((type) => (
            <AnimatedSection key={type} className="space-y-6">
              <h2 className="text-2xl font-bold">{getResourceTypeLabel(type)}</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {resourcesByType[type].map((resource) => (
                  <Card key={resource.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    {resource.image_url ? (
                      <div className="aspect-[2/1] relative">
                        <Image
                          src={resource.image_url || "/placeholder.svg"}
                          alt={resource.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[2/1] bg-muted flex items-center justify-center">
                        {getFileIcon(resource.file_url)}
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>{resource.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-3">{resource.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <Link href={`/resources/${resource.slug}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                      <a href={resource.file_url} target="_blank" rel="noopener noreferrer" download>
                        <Button size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </a>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </AnimatedSection>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No resources available at the moment. Please check back later.</p>
        </div>
      )}
    </div>
  )
}
