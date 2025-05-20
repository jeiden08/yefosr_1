"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ImageUploader from "./image-uploader"
import { Loader2 } from "lucide-react"

type Program = {
  id: string
  title: string
  slug: string
  description: string
  content: string
  image_url: string
  order_index: number
  published: boolean
  featured: boolean // Added featured field
}

type ProgramFormProps = {
  program?: Program
  isNew?: boolean
}

export default function ProgramForm({ program, isNew = false }: ProgramFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<Program>>(
    program || {
      title: "",
      slug: "",
      description: "",
      content: "",
      image_url: "",
      order_index: 0,
      published: true,
      featured: false, // Default to false for new programs
    },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleImageUploaded = (url: string) => {
    setFormData((prev) => ({ ...prev, image_url: url }))
  }

  const generateSlug = () => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")

      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const endpoint = isNew ? "/api/admin/programs" : `/api/admin/programs/${program?.id}`
      const method = isNew ? "POST" : "PUT"

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to save program")
      }

      router.push("/admin/programs")
      router.refresh()
    } catch (error) {
      console.error("Error saving program:", error)
      alert("Failed to save program. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isNew ? "Add New Program" : "Edit Program"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="slug">Slug</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={generateSlug} className="text-xs">
                    Generate from title
                  </Button>
                </div>
                <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order_index">Display Order</Label>
                <Input
                  id="order_index"
                  name="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={handleSwitchChange("published")}
                  />
                  <Label htmlFor="published">Published</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="featured" checked={formData.featured} onCheckedChange={handleSwitchChange("featured")} />
                  <Label htmlFor="featured">Featured on Homepage</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Program Image</Label>
                <ImageUploader
                  onImageUploaded={handleImageUploaded}
                  currentImageUrl={formData.image_url}
                  folder="programs"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Full Content</Label>
            <Textarea id="content" name="content" value={formData.content} onChange={handleChange} rows={10} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Program"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
