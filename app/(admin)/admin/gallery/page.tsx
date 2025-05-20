"use client"

import { useState } from "react"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PlusIcon, SearchIcon, Edit2Icon, TrashIcon } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function AdminGalleryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // This would be fetched from Supabase in the actual implementation
  const [images, setImages] = useState([
    {
      id: 1,
      title: "Youth Workshop",
      category: "Workshops",
      featured: true,
      imageUrl: "/youth-workshop.png",
    },
    {
      id: 2,
      title: "Community Outreach",
      category: "Outreach",
      featured: false,
      imageUrl: "/community-outreach.png",
    },
    {
      id: 3,
      title: "Skills Training",
      category: "Training",
      featured: true,
      imageUrl: "/skills-training.png",
    },
  ])

  const filteredImages = images.filter(
    (image) =>
      image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (image.category && image.category.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const toggleFeatured = async (id: number) => {
    setIsLoading(true)
    try {
      // In a real implementation, this would update the database
      setImages(images.map((img) => (img.id === id ? { ...img, featured: !img.featured } : img)))

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      router.refresh()
    } catch (error) {
      console.error("Error updating image:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <AdminHeader heading="Gallery" text="Manage your gallery images.">
        <Button asChild>
          <Link href="/admin/gallery/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Image
          </Link>
        </Button>
      </AdminHeader>
      <Card>
        <CardHeader>
          <CardTitle>All Images</CardTitle>
          <CardDescription>A list of all your gallery images.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <SearchIcon className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.length > 0 ? (
              filteredImages.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <Image src={image.imageUrl || "/placeholder.svg"} alt={image.title} fill className="object-cover" />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 bg-white/80 hover:bg-white"
                        onClick={() => toggleFeatured(image.id)}
                        disabled={isLoading}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill={image.featured ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={image.featured ? "text-yellow-500" : "text-gray-500"}
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        <span className="sr-only">{image.featured ? "Unfeature" : "Feature"}</span>
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <div className="font-medium truncate">{image.title}</div>
                    {image.category && <div className="text-xs text-muted-foreground">{image.category}</div>}
                  </CardContent>
                  <CardFooter className="p-3 pt-0 flex justify-between">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/gallery/${image.id}`}>
                        <Edit2Icon className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full p-4 text-center text-muted-foreground">No images found.</div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Showing {filteredImages.length} of {images.length} images.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
