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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ImageUploader from "./image-uploader"
import FileUploader from "./file-uploader"
import { Loader2 } from "lucide-react"

type Resource = {
  id: string
  title: string
  slug: string
  description: string
  content: string
  file_url: string
  image_url: string | null
  resource_type: string
  order_index: number
  published: boolean
}

type ResourceFormProps = {
  resource?: Resource
  isNew?: boolean
}

export default function ResourceForm({ resource, isNew = false }: ResourceFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<Resource>>(
    resource || {
      title: "",
      slug: "",
      description: "",
      content: "",
      file_url: "",
      image_url: "",
      resource_type: "document",
      order_index: 0,
      published: true,
    },
  )
  const [originalFileName, setOriginalFileName] = useState<string>("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, published: checked }))
  }

  const handleImageUploaded = (url: string) => {
    setFormData((prev) => ({ ...prev, image_url: url }))
  }

  const handleFileUploaded = (url: string, filename: string) => {
    setFormData((prev) => ({ ...prev, file_url: url }))
    setOriginalFileName(filename)
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
      const endpoint = isNew ? "/api/admin/resources" : `/api/admin/resources/${resource?.id}`
      const method = isNew ? "POST" : "PUT"

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          originalFileName,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save resource")
      }

      router.push("/admin/resources")
      router.refresh()
    } catch (error) {
      console.error("Error saving resource:", error)
      alert("Failed to save resource. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isNew ? "Add New Resource" : "Edit Resource"}</CardTitle>
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
                <Label htmlFor="resource_type">Resource Type</Label>
                <Select
                  value={formData.resource_type}
                  onValueChange={(value) => handleSelectChange("resource_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select resource type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="report">Report</SelectItem>
                    <SelectItem value="guide">Guide</SelectItem>
                    <SelectItem value="toolkit">Toolkit</SelectItem>
                    <SelectItem value="presentation">Presentation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
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

              <div className="flex items-center space-x-2">
                <Switch id="published" checked={formData.published} onCheckedChange={handleSwitchChange} />
                <Label htmlFor="published">Published</Label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Resource File (Required)</Label>
                <FileUploader
                  onFileUploaded={handleFileUploaded}
                  currentFileUrl={formData.file_url}
                  folder="resources"
                />
              </div>

              <div className="space-y-2">
                <Label>Cover Image (Optional)</Label>
                <ImageUploader
                  onImageUploaded={handleImageUploaded}
                  currentImageUrl={formData.image_url || undefined}
                  folder="resource-covers"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Full Description</Label>
            <Textarea id="content" name="content" value={formData.content} onChange={handleChange} rows={10} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !formData.file_url}>
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Resource"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
