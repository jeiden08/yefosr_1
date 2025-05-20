import { createClient } from "@/lib/supabase/server"
import { AnimatedSection } from "@/components/animated-section"
import { GalleryGrid } from "@/components/gallery-grid"

export const metadata = {
  title: "Gallery | Youth Empowerment For Self Reliance",
  description: "Browse through our visual journey of empowering youth and transforming communities.",
}

export default async function GalleryPage() {
  let images = []
  let categories = []

  try {
    const supabase = await createClient()

    // Fetch gallery images
    const { data: imagesData, error: imagesError } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("published", true)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })

    if (!imagesError && imagesData) {
      images = imagesData

      // Extract unique categories
      const categorySet = new Set<string>()
      images.forEach((image) => {
        if (image.category) {
          categorySet.add(image.category)
        }
      })
      categories = Array.from(categorySet)
    } else {
      console.error("Error fetching gallery images:", imagesError)
    }
  } catch (error) {
    console.error("Error in GalleryPage:", error)
  }

  return (
    <div className="container py-12 md:py-16">
      <AnimatedSection className="flex flex-col items-center text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-gradient">Gallery</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Browse through our visual journey of empowering youth and transforming communities through our various
          programs and initiatives.
        </p>
      </AnimatedSection>

      {images && images.length > 0 ? (
        <GalleryGrid images={images} categories={categories} />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No gallery images available at the moment. Please check back later.</p>
        </div>
      )}
    </div>
  )
}
