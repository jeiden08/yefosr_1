import { createClient } from "@/lib/supabase/server"
import { AnimatedSection } from "@/components/animated-section"
import Image from "next/image"
import Link from "next/link"

export const metadata = {
  title: "About Us | Youth Empowerment For Self Reliance - YEFOSR",
  description: "Learn about our mission, vision, and the impact we're making in empowering youth for self-reliance.",
}

export default async function AboutPage() {
  let aboutContent = null
  let teamMembers = []

  try {
    const supabase = await createClient()

    // Fetch about page content from site settings
    const { data: aboutData, error: aboutError } = await supabase
      .from("site_settings")
      .select("*")
      .eq("key", "about_content")
      .single()

    if (!aboutError) {
      aboutContent = aboutData
    } else {
      console.error("Error fetching about content:", aboutError)
    }

    // Fetch team members if you have them
    const { data: teamData, error: teamError } = await supabase
      .from("team_members")
      .select("*")
      .eq("published", true)
      .is("deleted_at", null)
      .order("order_index")

    if (!teamError && teamData) {
      teamMembers = teamData
    } else {
      console.error("Error fetching team members:", teamError)
    }
  } catch (error) {
    console.error("Error in AboutPage:", error)
  }

  return (
    <div className="container py-12 md:py-16">
      <AnimatedSection className="flex flex-col items-center text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-gradient">About Us</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Learn about our mission, vision, and the impact we're making in empowering youth for self-reliance.
        </p>
      </AnimatedSection>

      <div className="grid gap-12 md:grid-cols-2 items-center mb-16">
        <AnimatedSection>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image src="/about-image.png" alt="Youth Empowerment Team" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-4 text-white">
                <h3 className="text-xl font-bold">Our Team at Work</h3>
                <p className="text-sm">Making a difference in our communities</p>
              </div>
            </div>
          </div>
        </AnimatedSection>
        <AnimatedSection animation="slide-right">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">About YEFOSR</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Youth Empowerment for Self Reliance (YEFOSR) is a registered refugee youth-led Community-Based
                Organization under Obongi Local Government (Reg. No. ODLG/CBO/913-2023-038).
              </p>
              <p>
                Founded on 28th June 2019, YEFOSR was established to tackle key challenges affecting rural
                communities—especially vulnerable and marginalized youth—including poverty, unemployment, tribal
                conflict, and cultural intolerance.
              </p>
              <p>
                Through community-led innovation, YEFOSR empowers rural women, girls, and youth with the tools to build
                resilience, restore livelihoods, and take active roles in leadership, decision-making, peacebuilding,
                environmental protection, and development initiatives.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>

      <AnimatedSection className="mb-16">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="bg-primary/10 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Our Mission</h3>
            <p className="text-muted-foreground">
              To improve the quality of life and socio-economic status of the youth and rural community through
              provision of integrated services.
            </p>
          </div>
          <div className="bg-primary/10 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Our Vision</h3>
            <p className="text-muted-foreground">
              Empowered and Economically Self-reliant youth and rural communities using their full potential.
            </p>
          </div>
          <div className="bg-primary/10 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Our Goal</h3>
            <p className="text-muted-foreground">
              Impacting generational transformation with incremental improvement on quality of life and socioeconomic
              status of rural communities and youth.
            </p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-4 text-muted-foreground">
            <p>
              Founded by refugee youth, YEFOSR emerged from a heartfelt dedication to overcoming the structural barriers
              confronting impoverished rural communities and disadvantaged young individuals.
            </p>
            <p>
              Situated in a region that shelters a large refugee population, primarily from South Sudan, we possess an
              intimate understanding of the local challenges. Fueled by a desire to drive meaningful transformation, we
              work tirelessly to foster self-reliance and resilience among the youth and rural communities.
            </p>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image src="/youth-workshop.png" alt="Youth Empowerment Workshop" fill className="object-cover" />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-muted/50 p-6 rounded-lg hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-2 flex items-center">
              <span className="bg-primary/20 text-primary p-1 rounded-full mr-2">•</span>
              Voluntarism
            </h3>
            <p className="text-muted-foreground">
              We believe in the power of voluntary service and community participation to drive sustainable change.
            </p>
          </div>
          <div className="bg-muted/50 p-6 rounded-lg hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-2 flex items-center">
              <span className="bg-primary/20 text-primary p-1 rounded-full mr-2">•</span>
              Inclusiveness
            </h3>
            <p className="text-muted-foreground">
              We embrace diversity and ensure that all community members have equal opportunities to participate and
              benefit.
            </p>
          </div>
          <div className="bg-muted/50 p-6 rounded-lg hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-2 flex items-center">
              <span className="bg-primary/20 text-primary p-1 rounded-full mr-2">•</span>
              Accountability
            </h3>
            <p className="text-muted-foreground">
              We maintain transparency in our operations and take responsibility for our actions and decisions.
            </p>
          </div>
          <div className="bg-muted/50 p-6 rounded-lg hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-2 flex items-center">
              <span className="bg-primary/20 text-primary p-1 rounded-full mr-2">•</span>
              Hard Work
            </h3>
            <p className="text-muted-foreground">
              We are committed to diligence and perseverance in pursuing our mission and achieving our goals.
            </p>
          </div>
          <div className="bg-muted/50 p-6 rounded-lg hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-2 flex items-center">
              <span className="bg-primary/20 text-primary p-1 rounded-full mr-2">•</span>
              Conflict Sensitivity
            </h3>
            <p className="text-muted-foreground">
              We approach our work with awareness of conflict dynamics and strive to promote peace and harmony.
            </p>
          </div>
          <div className="bg-muted/50 p-6 rounded-lg hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-2 flex items-center">
              <span className="bg-primary/20 text-primary p-1 rounded-full mr-2">•</span>
              Partnerships
            </h3>
            <p className="text-muted-foreground">
              We value collaboration with various stakeholders to leverage resources and maximize impact.
            </p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Thematic Areas</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-primary/10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <div className="h-3 w-3 bg-primary rounded-full animate-ping"></div>
            </div>
            <h3 className="text-xl font-bold mb-3">Education</h3>
            <p className="text-muted-foreground">
              Skills development and education advocacy to ensure access to quality education for all.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-primary/10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <div className="h-3 w-3 bg-primary rounded-full animate-ping"></div>
            </div>
            <h3 className="text-xl font-bold mb-3">Livelihood</h3>
            <p className="text-muted-foreground">
              Youth Skilling, Village Savings and Loan Association (VSLA), Persons with Specific Needs (PSN) Services to
              improve economic opportunities and self-reliance.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-primary/10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <div className="h-3 w-3 bg-primary rounded-full animate-ping"></div>
            </div>
            <h3 className="text-xl font-bold mb-3">Environmental Protection</h3>
            <p className="text-muted-foreground">
              Waste management and greening campaigns for sustainable communities and environmental conservation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-primary/10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <div className="h-3 w-3 bg-primary rounded-full animate-ping"></div>
            </div>
            <h3 className="text-xl font-bold mb-3">Youth Voice Leadership and Governance</h3>
            <p className="text-muted-foreground">
              Empowering young people to actively participate in decision-making processes, take up leadership roles,
              and influence policies that affect their lives and communities.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-primary/10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <div className="h-3 w-3 bg-primary rounded-full animate-ping"></div>
            </div>
            <h3 className="text-xl font-bold mb-3">Protection</h3>
            <p className="text-muted-foreground">
              Promoting peacebuilding, preventing sexual and gender-based violence (SGBV), improving access to Sexual
              and Reproductive Health and Rights (SRHR), providing psychosocial support, and fostering community
              wellbeing through sports and other initiatives.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-primary/10 flex items-center justify-center">
            <Link href="/programs" className="group">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                  <span className="font-bold text-primary">→</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Explore Our Programs</h3>
                <p className="text-primary">Learn more about our initiatives</p>
              </div>
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {teamMembers && teamMembers.length > 0 && (
        <AnimatedSection className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Team</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="text-center">
                <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full mb-4">
                  <Image
                    src={member.image_url || "/placeholder.svg?height=160&width=160&query=person"}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-primary">{member.position}</p>
                <p className="text-sm text-muted-foreground mt-2">{member.bio}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      )}
    </div>
  )
}
