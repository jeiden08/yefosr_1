import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { AnimatedSection } from "@/components/animated-section"
import { Button } from "@/components/ui/button"
import { Download, FileText, FileArchive, Calendar, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const supabase = await createClient()
    const { data: resource, error } = await supabase
      .from("resources")
      .select("*")
      .eq("slug", params.slug)
      .eq("published", true)
      .is("deleted_at", null)
      .single()

    if (error || !resource) {
      return {
        title: "Resource Not Found",
      }
    }

    return {
      title: `${resource.title} | Youth Empowerment For Self Reliance`,
      description: resource.description,
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Resource | Youth Empowerment For Self Reliance",
    }
  }
}

export default async function ResourceDetailPage({ params }: { params: { slug: string } }) {
  let resource = null
  let relatedResources = []

  try {
    const supabase = await createClient()

    // Fetch resource
    const { data: resourceData, error: resourceError } = await supabase
      .from("resources")
      .select("*")
      .eq("slug", params.slug)
      .eq("published", true)
      .is("deleted_at", null)
      .single()

    if (resourceError) {
      console.error("Error fetching resource:", resourceError)
      notFound()
    }

    resource = resourceData

    // Fetch related resources
    if (resource) {
      const { data: relatedData, error: relatedError } = await supabase
        .from("resources")
        .select("*")
        .eq("resource_type", resource.resource_type)
        .eq("published", true)
        .is("deleted_at", null)
        .neq("id", resource.id)
        .limit(3)

      if (!relatedError && relatedData) {
        relatedResources = relatedData
      } else {
        console.error("Error fetching related resources:", relatedError)
      }
    }
  } catch (error) {
    console.error("Error in ResourceDetailPage:", error)
    notFound()
  }

  if (!resource) {
    notFound()
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

  const getFileType = (fileUrl: string) => {
    const ext = fileUrl.split(".").pop()?.toLowerCase()

    if (ext === "pdf") return "PDF Document"
    if (ext === "doc" || ext === "docx") return "Word Document"
    if (ext === "xls" || ext === "xlsx") return "Excel Spreadsheet"
    if (ext === "ppt" || ext === "pptx") return "PowerPoint Presentation"
    if (ext === "zip") return "ZIP Archive"
    if (ext === "rar") return "RAR Archive"

    return "Document"
  }

  const getFileSize = (fileUrl: string) => {
    // In a real implementation, you would store the file size in the database
    // For now, we'll just return a placeholder
    return "Unknown size"
  }

  return (
    <div className="container py-12 md:py-16">
      <AnimatedSection>
        <Link href="/resources" className="text-primary hover:underline flex items-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Resources
        </Link>
      </AnimatedSection>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <AnimatedSection>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{resource.title}</h1>
            <p className="mt-4 text-muted-foreground">{resource.description}</p>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: resource.content.replace(/\n/g, "<br />") }} />
            </div>
          </AnimatedSection>
        </div>

        <div className="space-y-6">
          <AnimatedSection delay={200} className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Download Resource</h3>

            <div className="flex items-center justify-center mb-6">
              {resource.image_url ? (
                <div className="relative w-32 h-32">
                  <Image
                    src={resource.image_url || "/placeholder.svg"}
                    alt={resource.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 bg-muted rounded-md flex items-center justify-center">
                  {getFileIcon(resource.file_url)}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{getFileType(resource.file_url)}</span>
              </div>

              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Published: {new Date(resource.created_at).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Last updated: {new Date(resource.updated_at).toLocaleDateString()}</span>
              </div>

              <a href={resource.file_url} target="_blank" rel="noopener noreferrer" download>
                <Button className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </a>
            </div>
          </AnimatedSection>

          {relatedResources && relatedResources.length > 0 && (
            <AnimatedSection delay={300} className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4">Related Resources</h3>
              <div className="space-y-4">
                {relatedResources.map((related) => (
                  <Link key={related.id} href={`/resources/${related.slug}`} className="block">
                    <div className="flex items-start gap-3 group">
                      <div className="flex-shrink-0">{getFileIcon(related.file_url)}</div>
                      <div>
                        <h4 className="font-medium group-hover:text-primary transition-colors">{related.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{related.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </AnimatedSection>
          )}
        </div>
      </div>
    </div>
  )
}
