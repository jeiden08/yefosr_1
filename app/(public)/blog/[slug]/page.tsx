import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { AnimatedSection } from "@/components/animated-section"
import Link from "next/link"
import Image from "next/image"

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const supabase = await createClient()
    const { data: post, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", params.slug)
      .eq("published", true)
      .is("deleted_at", null)
      .single()

    if (error || !post) {
      return {
        title: "Post Not Found",
      }
    }

    return {
      title: `${post.title} | Youth Empowerment For Self Reliance`,
      description: post.excerpt,
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Blog Post | Youth Empowerment For Self Reliance",
    }
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  let post = null
  let relatedPosts = []

  try {
    const supabase = await createClient()

    // Fetch blog post
    const { data: postData, error: postError } = await supabase
      .from("blog_posts")
      .select("*, admins(name)")
      .eq("slug", params.slug)
      .eq("published", true)
      .is("deleted_at", null)
      .single()

    if (postError) {
      console.error("Error fetching blog post:", postError)
      notFound()
    }

    post = postData

    // Fetch related posts
    const { data: relatedData, error: relatedError } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .is("deleted_at", null)
      .neq("id", post.id)
      .order("published_date", { ascending: false })
      .limit(3)

    if (!relatedError && relatedData) {
      relatedPosts = relatedData
    } else {
      console.error("Error fetching related posts:", relatedError)
    }
  } catch (error) {
    console.error("Error in BlogPostPage:", error)
    notFound()
  }

  if (!post) {
    notFound()
  }

  return (
    <div className="container py-12 md:py-16">
      <AnimatedSection>
        <Link href="/blog" className="text-primary hover:underline flex items-center mb-6">
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
          Back to Blog
        </Link>
      </AnimatedSection>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <AnimatedSection>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
            <div className="mt-4 flex items-center text-muted-foreground">
              <span>
                {new Date(post.published_date || post.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              {post.admins && (
                <>
                  <span className="mx-2">•</span>
                  <span>By {post.admins.name}</span>
                </>
              )}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <div className="relative aspect-video overflow-hidden rounded-lg mb-6">
              <Image
                src={post.image_url || "/placeholder.svg?height=400&width=600&query=blog"}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br />") }} />
            </div>
          </AnimatedSection>
        </div>

        <div className="space-y-6">
          <AnimatedSection delay={300} className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Related Posts</h3>
            {relatedPosts && relatedPosts.length > 0 ? (
              <div className="space-y-4">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="block">
                    <div className="flex items-start gap-3 group">
                      <div className="relative flex-shrink-0 w-16 h-16 rounded overflow-hidden">
                        <Image
                          src={relatedPost.image_url || "/placeholder.svg?height=64&width=64&query=blog"}
                          alt={relatedPost.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium group-hover:text-primary transition-colors">{relatedPost.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(relatedPost.published_date || relatedPost.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No related posts available.</p>
            )}
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
