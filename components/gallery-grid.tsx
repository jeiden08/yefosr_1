"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { AnimatedSection } from "@/components/animated-section"

interface GalleryImage {
  id: string
  title: string
  description?: string
  imageUrl: string
  category?: string
}

interface GalleryGridProps {
  images: GalleryImage[]
  categories?: string[]
}

export function GalleryGrid({ images, categories = [] }: GalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredImages = activeCategory ? images.filter((img) => img.category === activeCategory) : images

  return (
    <div className="space-y-8">
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              activeCategory === null ? "bg-primary text-white" : "bg-muted hover:bg-muted/80",
            )}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                activeCategory === category ? "bg-primary text-white" : "bg-muted hover:bg-muted/80",
              )}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((image, index) => (
          <AnimatedSection
            key={image.id}
            delay={index * 100}
            className="overflow-hidden rounded-lg hover-scale cursor-pointer"
          >
            <div className="aspect-square relative" onClick={() => setSelectedImage(image)}>
              <Image
                src={image.imageUrl || "/placeholder.svg"}
                alt={image.title}
                fill
                className="object-cover transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors duration-300 flex items-end">
                <div className="p-4 text-white transform translate-y-full opacity-0 hover:translate-y-0 hover:opacity-100 transition-all duration-300 w-full">
                  <h3 className="font-bold text-lg">{image.title}</h3>
                  {image.description && <p className="text-sm text-white/80 line-clamp-2">{image.description}</p>}
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none">
          {selectedImage && (
            <div className="relative">
              <div className="relative aspect-[4/3] md:aspect-[16/9] w-full">
                <Image
                  src={selectedImage.imageUrl || "/placeholder.svg"}
                  alt={selectedImage.title}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-white">
                <h3 className="font-bold text-lg">{selectedImage.title}</h3>
                {selectedImage.description && <p className="text-sm text-white/80">{selectedImage.description}</p>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
