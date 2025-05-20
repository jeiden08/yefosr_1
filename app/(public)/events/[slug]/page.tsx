import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { AnimatedSection } from "@/components/animated-section"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin } from "lucide-react"

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const supabase = await createClient()
    const { data: event, error } = await supabase
      .from("events")
      .select("*")
      .eq("slug", params.slug)
      .eq("published", true)
      .is("deleted_at", null)
      .single()

    if (error || !event) {
      return {
        title: "Event Not Found",
      }
    }

    return {
      title: `${event.title} | Youth Empowerment For Self Reliance`,
      description: event.description,
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Event | Youth Empowerment For Self Reliance",
    }
  }
}

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  let event = null
  let otherEvents = []
  let isUpcoming = false

  try {
    const supabase = await createClient()

    // Fetch event
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("slug", params.slug)
      .eq("published", true)
      .is("deleted_at", null)
      .single()

    if (eventError) {
      console.error("Error fetching event:", eventError)
      notFound()
    }

    event = eventData

    // Get current date in ISO format
    const currentDate = new Date().toISOString()
    isUpcoming = new Date(event.start_date) > new Date(currentDate)

    // Fetch other upcoming events
    const { data: otherEventsData, error: otherEventsError } = await supabase
      .from("events")
      .select("*")
      .eq("published", true)
      .is("deleted_at", null)
      .neq("id", event.id)
      .gte("start_date", currentDate)
      .order("start_date")
      .limit(3)

    if (!otherEventsError && otherEventsData) {
      otherEvents = otherEventsData
    } else {
      console.error("Error fetching other events:", otherEventsError)
    }
  } catch (error) {
    console.error("Error in EventDetailPage:", error)
    notFound()
  }

  if (!event) {
    notFound()
  }

  return (
    <div className="container py-12 md:py-16">
      <AnimatedSection>
        <Link href="/events" className="text-primary hover:underline flex items-center mb-6">
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
          Back to Events
        </Link>
      </AnimatedSection>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <AnimatedSection>
            <div className="relative aspect-video overflow-hidden rounded-lg mb-6">
              <Image
                src={event.image_url || "/placeholder.svg?height=400&width=600&query=event"}
                alt={event.title}
                fill
                className="object-cover"
              />
              {!isUpcoming && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="bg-white/90 text-black px-6 py-3 rounded-full text-lg font-bold">Event Completed</div>
                </div>
              )}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{event.title}</h1>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center text-sm font-medium mb-1">
                  <Calendar className="mr-2 h-4 w-4 text-primary" />
                  <span>Date</span>
                </div>
                <p className="text-muted-foreground">
                  {new Date(event.start_date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center text-sm font-medium mb-1">
                  <Clock className="mr-2 h-4 w-4 text-primary" />
                  <span>Time</span>
                </div>
                <p className="text-muted-foreground">
                  {new Date(event.start_date).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center text-sm font-medium mb-1">
                  <MapPin className="mr-2 h-4 w-4 text-primary" />
                  <span>Location</span>
                </div>
                <p className="text-muted-foreground">{event.location}</p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: event.content.replace(/\n/g, "<br />") }} />
            </div>
          </AnimatedSection>

          {isUpcoming && (
            <AnimatedSection delay={300} className="flex justify-center">
              <Button size="lg" className="rounded-full">
                Register for this Event
              </Button>
            </AnimatedSection>
          )}
        </div>

        <div className="space-y-6">
          {isUpcoming && (
            <AnimatedSection delay={400} className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4">Event Details</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">When</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.start_date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    <br />
                    {new Date(event.start_date).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Where</h4>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
                <div className="pt-2">
                  <Button className="w-full">Register Now</Button>
                </div>
              </div>
            </AnimatedSection>
          )}

          {otherEvents && otherEvents.length > 0 && (
            <AnimatedSection delay={500} className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                {otherEvents.map((otherEvent) => (
                  <Link key={otherEvent.id} href={`/events/${otherEvent.slug}`} className="block">
                    <div className="flex items-start gap-3 group">
                      <div className="relative flex-shrink-0 w-16 h-16 rounded overflow-hidden">
                        <Image
                          src={otherEvent.image_url || "/placeholder.svg?height=64&width=64&query=event"}
                          alt={otherEvent.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium group-hover:text-primary transition-colors">{otherEvent.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(otherEvent.start_date).toLocaleDateString()}
                        </p>
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
