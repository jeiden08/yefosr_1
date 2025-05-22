export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server"
import { AnimatedSection } from "@/components/animated-section"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export const metadata = {
  title: "Programs | Youth Empowerment For Self Reliance",
  description: "Explore our programs focused on youth empowerment, education, and community development.",
}

export default async function ProgramsPage() {
  let programs = []

  try {
    const supabase = await createClient()

    // Fetch programs
    const { data: programsData, error: programsError } = await supabase
      .from("programs")
      .select("*")
      .eq("published", true)
      .is("deleted_at", null)
      .order("order_index")

    if (!programsError && programsData) {
      programs = programsData
    } else {
      console.error("Error fetching programs:", programsError)
    }
  } catch (error) {
    console.error("Error in ProgramsPage:", error)
  }

  return (
    <div className="container py-12 md:py-16">
      <AnimatedSection className="flex flex-col items-center text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-gradient">Our Programs</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Discover how we're making a difference in the lives of young people through our various programs focused on
          education, economic empowerment, and leadership.
        </p>
      </AnimatedSection>

      <div className="space-y-16">
        {programs && programs.length > 0 ? (
          programs.map((program, index) => (
            <AnimatedSection key={program.id} className="group">
              <div className={`grid gap-8 md:grid-cols-2 items-center ${index % 2 === 1 ? "md:grid-flow-dense" : ""}`}>
                <div className={`${index % 2 === 1 ? "md:col-start-2" : ""}`}>
                  <div className="relative aspect-video overflow-hidden rounded-lg">
                    <Image
                      src={program.image_url || "/placeholder.svg?height=400&width=600&query=program"}
                      alt={program.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">{program.title}</h2>
                  <p className="text-muted-foreground">{program.description}</p>
                  <Link href={`/programs/${program.slug}`}>
                    <Button className="mt-2">Learn More</Button>
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No programs available at the moment. Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  )
}