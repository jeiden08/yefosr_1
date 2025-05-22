export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import type { Testimonial, Partner, Event } from "@/lib/types"
import { AnimatedSection } from "@/components/animated-section"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  let programs = []
  let partners = []
  let testimonials = []
  let galleryImages = []
  let events = []
  let impactStats = []

  try {
    const supabase = await createClient()

    // Fetch featured programs
    const { data: programsData, error: programsError } = await supabase
      .from("programs")
      .select("*")
      .eq("published", true)
      .eq("featured", true)
      .is("deleted_at", null)
      .order("order_index")
      .limit(3)

    if (!programsError && programsData) {
      programs = programsData
    } else {
      console.error("Error fetching featured programs:", programsError)
    }

    // Fetch partners
    const { data: partnersData, error: partnersError } = await supabase
      .from("partners")
      .select("*")
      .eq("published", true)
      .eq("active", true)
      .is("deleted_at", null)
      .order("order_index")

    if (!partnersError && partnersData) {
      partners = partnersData
    } else {
      console.error("Error fetching partners:", partnersError)
    }

    // Fetch testimonials
    const { data: testimonialsData, error: testimonialsError } = await supabase
      .from("testimonials")
      .select("*")
      .eq("published", true)
      .is("deleted_at", null)
      .order("order_index")
      .limit(3)

    if (!testimonialsError && testimonialsData) {
      testimonials = testimonialsData
    } else {
      console.error("Error fetching testimonials:", testimonialsError)
    }

    // Fetch gallery images for homepage
    const { data: galleryData, error: galleryError } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("featured", true)
      .is("deleted_at", null)
      .limit(4)

    if (!galleryError && galleryData) {
      // Map image_url to imageUrl for compatibility with <Image src={image.imageUrl} ... />
      galleryImages = galleryData.map(img => ({
        ...img,
        imageUrl: img.image_url,
      }))
    } else {
      console.error("Error fetching gallery images:", galleryError)
    }

    // Fetch upcoming events
    const { data: eventsData, error: eventsError } = await supabase
      .from("events")
      .select("*")
      .eq("published", true)
      .is("deleted_at", null)
      .gte("start_date", new Date().toISOString())
      .order("start_date")
      .limit(3)

    if (!eventsError && eventsData) {
      events = eventsData
    } else {
      console.error("Error fetching upcoming events:", eventsError)
    }

    // Fetch impact stats
    const { data: statsData, error: statsError } = await supabase
      .from("impact_stats")
      .select("*")
      .eq("active", true)
      .order("order_index")

    if (!statsError && statsData) {
      impactStats = statsData
    } else {
      console.error("Error fetching impact stats:", statsError)
    }
  } catch (error) {
    console.error("Error in HomePage:", error)
  }

  // Fallback data for programs if none are found
  const fallbackPrograms = [
    {
      id: 1,
      title: "Peace Building",
      description: "Fostering peace education and capacity building initiatives on conflict resolution and management.",
      image_url: "/peace-building.png",
      slug: "peace-building",
    },
    {
      id: 2,
      title: "Education & Skilling",
      description:
        "Ensuring young people access quality educational, life skills and personal development training opportunities.",
      image_url: "/education-training.png",
      slug: "education-skilling",
    },
    {
      id: 3,
      title: "Livelihood & Economic Empowerment",
      description:
        "Providing relevant skills for employment, decent jobs and entrepreneurship to youth and rural communities.",
      image_url: "/placeholder-b51fd.png",
      slug: "livelihood-empowerment",
    },
  ]

  // Fallback data for gallery images if none are found
  const fallbackGalleryImages = [
    {
      id: "1",
      title: "Youth Workshop",
      imageUrl: "/youth-workshop.png",
    },
    {
      id: "2",
      title: "Community Outreach",
      imageUrl: "/community-outreach.png",
    },
    {
      id: "3",
      title: "Skills Training",
      imageUrl: "/skills-training.png",
    },
    {
      id: "4",
      title: "Youth Conference",
      imageUrl: "/youth-conference.png",
    },
  ]

  // Fallback data for partners if none are found
  const fallbackPartners = [
    {
      id: 1,
      name: "Youth Initiative",
      logo_url: "/youth-initiative-logo.png",
      website_url: "https://example.com",
    },
    {
      id: 2,
      name: "Education Alliance",
      logo_url: "/education-alliance-logo.png",
      website_url: "https://example.com",
    },
    {
      id: 3,
      name: "Community Foundation",
      logo_url: "/placeholder-i898u.png",
      website_url: "https://example.com",
    },
    {
      id: 4,
      name: "Global Youth Network",
      logo_url: "/placeholder-i898u.png",
      website_url: "https://example.com",
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-secondary/10 py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/pattern-bg.png')] opacity-5"></div>
        </div>
        <div className="container relative z-10 flex flex-col items-center text-center">
          <AnimatedSection animation="fade-in">
            <div className="inline-block bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium text-primary mb-4">
              Inspiring Generations!
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="text-gradient">Empowering Youth</span> for a Better Future
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={200} className="mt-6 max-w-2xl">
            <p className="text-lg text-muted-foreground">
              "Become a friend to our youth, to our community, to our future... In poverty and other misfortunes of
              life, true friends are a sure refuge."
            </p>
          </AnimatedSection>
          <AnimatedSection delay={400} className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link href="/programs">
              <Button size="lg" className="rounded-full">
                Our Programs
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="rounded-full">
                Contact Us
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Impact Stats Section */}
      {impactStats && impactStats.length > 0 && (
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {impactStats.map((stat, index) => (
                <AnimatedSection key={stat.id} delay={index * 100} className="text-center">
                  <div className="p-6 rounded-lg bg-background border hover:shadow-md transition-shadow">
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                    <h3 className="text-lg font-medium">{stat.label}</h3>
                    {stat.description && <p className="mt-2 text-sm text-muted-foreground">{stat.description}</p>}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Vision & Mission Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <AnimatedSection className="space-y-6">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Our Vision
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Empowered and Economically Self-reliant youth and rural communities
              </h2>
              <p className="text-muted-foreground">
                We envision a society where young people are using their full potential to create positive change in
                their communities and build sustainable livelihoods.
              </p>
              <div className="pt-4">
                <Link href="/about">
                  <Button variant="outline" className="rounded-full">
                    Learn More About Us
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="slide-right" className="space-y-6">
              <div className="inline-block rounded-lg bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary">
                Our Mission
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Improving Quality of Life</h2>
              <p className="text-muted-foreground">
                To improve the quality of life and socio-economic status of the youth and rural community through
                provision of integrated services, focusing on peace building, education, livelihoods, and leadership
                development.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <span className="h-3 w-3 rounded-full bg-primary animate-pulse"></span>
                  </div>
                  <div>
                    <h3 className="font-medium">Peace Building</h3>
                    <p className="text-sm text-muted-foreground">Fostering conflict resolution and harmony</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <span className="h-3 w-3 rounded-full bg-primary animate-pulse"></span>
                  </div>
                  <div>
                    <h3 className="font-medium">Education & Skilling</h3>
                    <p className="text-sm text-muted-foreground">Providing quality learning opportunities</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <span className="h-3 w-3 rounded-full bg-primary animate-pulse"></span>
                  </div>
                  <div>
                    <h3 className="font-medium">Leadership Development</h3>
                    <p className="text-sm text-muted-foreground">Nurturing tomorrow's community leaders</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <AnimatedSection className="flex flex-col items-center text-center mb-12">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
              Our Programs
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Transforming Lives Through Action</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Discover how we're making a difference in the lives of young people through our various programs focused
              on education, economic empowerment, and leadership.
            </p>
          </AnimatedSection>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {(programs?.length ? programs : fallbackPrograms).map((program: any, index: number) => (
              <AnimatedSection key={program.id} delay={index * 100} className="group">
                <Link href={`/programs/${program.slug}`}>
                  <div className="overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md hover-scale">
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={program.image_url || "/placeholder.svg?height=400&width=600&query=program"}
                        alt={program.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {program.title}
                      </h3>
                      <p className="mt-2 text-muted-foreground line-clamp-3">{program.description}</p>
                      <div className="mt-4 flex items-center text-sm font-medium text-primary">
                        Learn more
                        <span className="ml-1 text-xs">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection delay={400} className="mt-12 flex justify-center">
            <Link href="/programs">
              <Button variant="outline" className="rounded-full">
                View All Programs
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <AnimatedSection className="flex flex-col items-center text-center mb-12">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
              Our Gallery
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Capturing Moments of Impact</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Browse through our visual journey of empowering youth and transforming communities through our various
              programs and initiatives.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(galleryImages?.length ? galleryImages : fallbackGalleryImages).map((image: any, index: number) => (
              <AnimatedSection key={image.id} delay={index * 100} className="overflow-hidden rounded-lg hover-scale">
                <Link href="/gallery" className="block">
                  <div className="aspect-square relative">
                    <Image
                      src={image.imageUrl || "/placeholder.svg"}
                      alt={image.title}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors duration-300 flex items-end">
                      <div className="p-4 text-white transform translate-y-full opacity-0 hover:translate-y-0 hover:opacity-100 transition-all duration-300">
                        <h3 className="font-bold">{image.title}</h3>
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={400} className="mt-12 flex justify-center">
            <Link href="/gallery">
              <Button variant="outline" className="rounded-full">
                View Full Gallery
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <AnimatedSection className="flex flex-col items-center text-center mb-12">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                Testimonials
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Voices of Change</h2>
              <p className="mt-4 max-w-2xl text-muted-foreground">
                Hear from those who have benefited from our programs and how their lives have been transformed.
              </p>
            </AnimatedSection>
            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial: Testimonial, index: number) => (
                <AnimatedSection key={testimonial.id} delay={index * 100}>
                  <div className="rounded-lg border bg-background p-6 hover-scale">
                    <div className="flex flex-col gap-4 h-full">
                      <div className="relative">
                        <span className="absolute -left-3 -top-3 text-4xl text-primary/20">"</span>
                        <p className="text-muted-foreground italic relative z-10 pl-4">{testimonial.content}</p>
                        <span className="absolute -bottom-5 right-0 text-4xl text-primary/20">"</span>
                      </div>
                      <div className="flex items-center gap-4 mt-auto pt-4">
                        {testimonial.image_url && (
                          <div className="relative h-12 w-12 overflow-hidden rounded-full">
                            <Image
                              src={testimonial.image_url || "/placeholder.svg"}
                              alt={testimonial.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold">{testimonial.name}</h4>
                          {(testimonial.position || testimonial.organization) && (
                            <p className="text-sm text-muted-foreground">
                              {testimonial.position}
                              {testimonial.position && testimonial.organization && ", "}
                              {testimonial.organization}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events Section */}
      {events && events.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container">
            <AnimatedSection className="flex flex-col items-center text-center mb-12">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                Upcoming Events
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Join Us and Be Part of the Change</h2>
              <p className="mt-4 max-w-2xl text-muted-foreground">
                Participate in our upcoming events and be part of our mission to empower youth and transform
                communities.
              </p>
            </AnimatedSection>
            <div className="grid gap-8 md:grid-cols-3">
              {events.map((event: Event, index: number) => (
                <AnimatedSection key={event.id} delay={index * 100} className="group">
                  <Link href={`/events/${event.slug}`}>
                    <div className="overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md hover-scale">
                      <div className="aspect-video relative overflow-hidden">
                        <Image
                          src={event.image_url || "/placeholder.svg?height=400&width=600&query=event"}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 m-3 rounded-full text-sm font-medium">
                          {new Date(event.start_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                          {event.title}
                        </h3>
                        <p className="mt-2 text-muted-foreground line-clamp-2">{event.description}</p>
                        <div className="mt-4 flex items-center text-sm font-medium text-primary">
                          Learn more
                          <span className="ml-1 text-xs">→</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
            <AnimatedSection delay={400} className="mt-12 flex justify-center">
              <Link href="/events">
                <Button variant="outline" className="rounded-full">
                  View All Events
                </Button>
              </Link>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Partners Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <AnimatedSection className="flex flex-col items-center text-center mb-12">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
              Our Partners
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Collaborating for Greater Impact</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              We work with these amazing organizations to create positive change and transform lives in our communities.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
            {(partners?.length > 0 ? partners : fallbackPartners).map((partner: Partner, index: number) => (
              <AnimatedSection
                key={partner.id}
                delay={index * 50}
                className="flex flex-col items-center justify-center p-4"
              >
                {partner.website_url ? (
                  <a href={partner.website_url} target="_blank" rel="noopener noreferrer" className="group text-center">
                    <div className="relative h-16 w-full mb-2">
                      <Image
                        src={partner.logo_url || "/placeholder.svg?height=100&width=200&query=logo"}
                        alt={partner.name}
                        fill
                        className="object-contain transition-opacity group-hover:opacity-80"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                      {partner.name}
                    </p>
                  </a>
                ) : (
                  <div className="text-center">
                    <div className="relative h-16 w-full mb-2">
                      <Image
                        src={partner.logo_url || "/placeholder.svg?height=100&width=200&query=logo"}
                        alt={partner.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">{partner.name}</p>
                  </div>
                )}
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16 md:py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/pattern-bg.png')] opacity-10"></div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

        <div className="container relative z-10">
          <AnimatedSection className="flex flex-col items-center text-center">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium text-white mb-4">
              Join Our Movement
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Ready to Make a Difference?</h2>
            <p className="mt-6 max-w-2xl text-lg">
              Join us in our mission to empower youth and create positive change in our communities. Together, we can
              build a better future for all.
            </p>

            <div className="mt-10">
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="rounded-full">
                  Get In Touch
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}