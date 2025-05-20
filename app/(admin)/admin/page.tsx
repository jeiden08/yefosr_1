import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, BookOpen, Calendar, FileBox, MessageSquare, Users } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Admin Dashboard | Youth Empowerment For Self Reliance",
}

export default async function AdminDashboardPage() {
  const supabase = createClient()

  // Fetch counts for various content types
  const [
    blogPostsResponse,
    programsResponse,
    eventsResponse,
    resourcesResponse,
    contactMessagesResponse,
    testimonialsResponse,
  ] = await Promise.all([
    supabase.from("blog_posts").select("id", { count: "exact" }).is("deleted_at", null),
    supabase.from("programs").select("id", { count: "exact" }).is("deleted_at", null),
    supabase.from("events").select("id", { count: "exact" }).is("deleted_at", null),
    supabase.from("resources").select("id", { count: "exact" }).is("deleted_at", null),
    supabase.from("contact_submissions").select("id", { count: "exact" }).is("deleted_at", null),
    supabase.from("testimonials").select("id", { count: "exact" }).is("deleted_at", null),
  ])

  // Get unread contact messages count
  const { count: unreadMessagesCount } = await supabase
    .from("contact_submissions")
    .select("id", { count: "exact" })
    .eq("status", "unread")
    .is("deleted_at", null)

  // Get upcoming events
  const { data: upcomingEvents } = await supabase
    .from("events")
    .select("*")
    .is("deleted_at", null)
    .gte("start_date", new Date().toISOString())
    .order("start_date")
    .limit(5)

  // Get recent blog posts
  const { data: recentBlogPosts } = await supabase
    .from("blog_posts")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Youth Empowerment For Self Reliance admin dashboard.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/blog-posts">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blogPostsResponse.count || 0}</div>
              <p className="text-xs text-muted-foreground">
                {recentBlogPosts && recentBlogPosts.length > 0
                  ? `Last updated ${new Date(recentBlogPosts[0].updated_at).toLocaleDateString()}`
                  : "No blog posts yet"}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/programs">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Programs</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{programsResponse.count || 0}</div>
              <p className="text-xs text-muted-foreground">Active programs</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/events">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{eventsResponse.count || 0}</div>
              <p className="text-xs text-muted-foreground">
                {upcomingEvents && upcomingEvents.length > 0
                  ? `${upcomingEvents.length} upcoming events`
                  : "No upcoming events"}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/resources">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Resources</CardTitle>
              <FileBox className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resourcesResponse.count || 0}</div>
              <p className="text-xs text-muted-foreground">Downloadable resources</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/contact-messages">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contactMessagesResponse.count || 0}</div>
              <p className="text-xs text-muted-foreground">
                {unreadMessagesCount && unreadMessagesCount > 0
                  ? `${unreadMessagesCount} unread messages`
                  : "No unread messages"}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/testimonials">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{testimonialsResponse.count || 0}</div>
              <p className="text-xs text-muted-foreground">Published testimonials</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Blog Posts</CardTitle>
            <CardDescription>The latest blog posts on your website.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentBlogPosts && recentBlogPosts.length > 0 ? (
              <div className="space-y-4">
                {recentBlogPosts.map((post) => (
                  <div key={post.id} className="flex items-center gap-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{post.title}</p>
                      <p className="text-xs text-muted-foreground">{new Date(post.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/blog-posts/${post.id}`}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No blog posts found.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Events scheduled for the near future.</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingEvents && upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{new Date(event.start_date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/events/${event.id}`}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming events found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
