export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server"
import { AnimatedSection } from "@/components/animated-section"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export const metadata = {
  title: "Blog | Youth Empowerment For Self Reliance",
  description: "Read our latest news, stories, and insights about youth empowerment and community development.",
}

export default async function BlogPage() {
  let posts = []

  try {
    const supabase = await createClient()

    // Fetch blog posts
    const { data: postsData, error: postsError } = await supabase
      .from("blog_posts")
      .select("*, admins(name)")
      .eq("published", true)
      .is("deleted_at", null)
      .order("published_date", { ascending: false })

    if (!postsError && postsData) {
      posts = postsData
    } else {
      console.error("Error fetching blog posts:", postsError)
    }
  } catch (error) {
    console.error("Error in BlogPage:", error)
  }

  return (
    <div className="container py-12 md:py-16">
      <AnimatedSection className="flex flex-col items-center text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-gradient">Our Blog</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Read our latest news, stories, and insights about youth empowerment and community development.
        </p>
      </AnimatedSection>

      {posts && posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <AnimatedSection key={post.id} delay={index * 100} className="group">
              <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={post.image_url || "/placeholder.svg?height=400&width=600&query=blog"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="flex-1 p-6">
                  <div className="mb-2 text-sm text-muted-foreground">
                    {new Date(post.published_date || post.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    {post.admins && ` • By ${post.admins.name}`}
                  </div>
                  <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{post.title}</h2>
                  <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="px-6 pb-6 pt-0">
                  <Link href={`/blog/${post.slug}`}>
                    <Button variant="outline">Read More</Button>
                  </Link>
                </CardFooter>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No blog posts available at the moment. Please check back later.</p>
        </div>
      )}
    </div>
  )
}