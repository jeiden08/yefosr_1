export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server"
import { AnimatedSection } from "@/components/animated-section"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Calendar, Clock, MapPin } from "lucide-react"

export const metadata = {
  title: "Events | Youth Empowerment For Self Reliance",
  description: "Join our upcoming events and be part of our mission to empower youth and transform communities.",
}

export default async function EventsPage() {
  let upcomingEvents = []
  let pastEvents = []

  try {
    const supabase = await createClient()

    // Get current date in ISO format
    const currentDate = new Date().toISOString()

    // Fetch upcoming events
    const { data: upcomingData, error: upcomingError } = await supabase
      .from("events")
      .select("*")
      .eq("published", true)
      .is("deleted_at", null)
      .gte("start_date", currentDate)
      .order("start_date")

    if (!upcomingError && upcomingData) {
      upcomingEvents = upcomingData
    } else {
      console.error("Error fetching upcoming events:", upcomingError)
    }

    // Fetch past events
    const { data: pastData, error: pastError } = await supabase
      .from("events")
      .select("*")
      .eq("published", true)
      .is("deleted_at", null)
      .lt("start_date", currentDate)
      .order("start_date", { ascending: false })
      .limit(6)

    if (!pastError && pastData) {
      pastEvents = pastData
    } else {
      console.error("Error fetching past events:", pastError)
    }
  } catch (error) {
    console.error("Error in EventsPage:", error)
  }

  return (
    <div className="container py-12 md:py-16">
      <AnimatedSection className="flex flex-col items-center text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-gradient">Events</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Join our upcoming events and be part of our mission to empower youth and transform communities.
        </p>
      </AnimatedSection>

      <AnimatedSection className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
        {upcomingEvents && upcomingEvents.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={event.image_url || "/placeholder.svg?height=400&width=600&query=event"}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 m-3 rounded-full text-sm font-medium">
                    {new Date(event.start_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <CardContent className="flex-1 p-6">
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>
                        {new Date(event.start_date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>
                        {new Date(event.start_date).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground line-clamp-3">{event.description}</p>
                </CardContent>
                <CardFooter className="px-6 pb-6 pt-0">
                  <Link href={`/events/${event.slug}`}>
                    <Button>View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">No upcoming events at the moment. Please check back later.</p>
          </div>
        )}
      </AnimatedSection>

      {pastEvents && pastEvents.length > 0 && (
        <AnimatedSection>
          <h2 className="text-2xl font-bold mb-6">Past Events</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={event.image_url || "/placeholder.svg?height=400&width=600&query=event"}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-muted text-muted-foreground px-3 py-1 m-3 rounded-full text-sm font-medium">
                    {new Date(event.start_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <CardContent className="flex-1 p-6">
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>
                        {new Date(event.start_date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground line-clamp-3">{event.description}</p>
                </CardContent>
                <CardFooter className="px-6 pb-6 pt-0">
                  <Link href={`/events/${event.slug}`}>
                    <Button variant="outline">View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </AnimatedSection>
      )}
    </div>
  )
}
