import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { AnimatedSection } from "@/components/animated-section"
import Link from "next/link"
import Image from "next/image"

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const supabase = await createClient()
    const { data: program, error } = await supabase
      .from("programs")
      .select("*")
      .eq("slug", params.slug)
      .eq("published", true)
      .is("deleted_at", null)
      .single()

    if (error || !program) {
      return {
        title: "Program Not Found",
      }
    }

    return {
      title: `${program.title} | Youth Empowerment For Self Reliance`,
      description: program.description,
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Program | Youth Empowerment For Self Reliance",
    }
  }
}

export default async function ProgramDetailPage({ params }: { params: { slug: string } }) {
  let program = null
  let otherPrograms = []

  try {
    const supabase = await createClient()

    // Fetch program
    const { data: programData, error: programError } = await supabase
      .from("programs")
      .select("*")
      .eq("slug", params.slug)
      .eq("published", true)
      .is("deleted_at", null)
      .single()

    if (programError) {
      console.error("Error fetching program:", programError)
      notFound()
    }

    program = programData

    // Fetch other programs
    const { data: otherProgramsData, error: otherProgramsError } = await supabase
      .from("programs")
      .select("*")
      .eq("published", true)
      .is("deleted_at", null)
      .neq("id", program.id)
      .order("order_index")
      .limit(3)

    if (!otherProgramsError && otherProgramsData) {
      otherPrograms = otherProgramsData
    } else {
      console.error("Error fetching other programs:", otherProgramsError)
    }
  } catch (error) {
    console.error("Error in ProgramDetailPage:", error)
    notFound()
  }

  if (!program) {
    notFound()
  }

  return (
    <div className="container py-12 md:py-16">
      <AnimatedSection>
        <Link href="/programs" className="text-primary hover:underline flex items-center mb-6">
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
          Back to Programs
        </Link>
      </AnimatedSection>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <AnimatedSection>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{program.title}</h1>
            <p className="mt-4 text-muted-foreground">{program.description}</p>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <div className="relative aspect-video overflow-hidden rounded-lg mb-6">
              <Image
                src={program.image_url || "/placeholder.svg?height=400&width=600&query=program"}
                alt={program.title}
                fill
                className="object-cover"
              />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: program.content.replace(/\n/g, "<br />") }} />
            </div>
          </AnimatedSection>
        </div>

        <div className="space-y-6">
          <AnimatedSection delay={300} className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Other Programs</h3>
            {otherPrograms && otherPrograms.length > 0 ? (
              <div className="space-y-4">
                {otherPrograms.map((otherProgram) => (
                  <Link key={otherProgram.id} href={`/programs/${otherProgram.slug}`} className="block">
                    <div className="flex items-start gap-3 group">
                      <div className="relative flex-shrink-0 w-16 h-16 rounded overflow-hidden">
                        <Image
                          src={otherProgram.image_url || "/placeholder.svg?height=64&width=64&query=program"}
                          alt={otherProgram.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium group-hover:text-primary transition-colors">{otherProgram.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{otherProgram.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No other programs available.</p>
            )}
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
