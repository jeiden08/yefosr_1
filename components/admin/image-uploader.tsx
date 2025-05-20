"use client"

import type React from "react"

import { useState } from "react"
import { Upload, ImageIcon, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client for handling uploads
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

type ImageUploaderProps = {
  onImageUploaded: (url: string) => void
  currentImageUrl?: string
  folder?: string
  className?: string
}

export default function ImageUploader({
  onImageUploaded,
  currentImageUrl,
  folder = "general",
  className = "",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null)
      setUploading(true)
      setUploadSuccess(false)

      if (!e.target.files || e.target.files.length === 0) {
        throw new Error("Please select an image to upload")
      }

      const file = e.target.files[0]

      // Check file type
      if (!file.type.startsWith("image/")) {
        throw new Error("Please select an image file")
      }

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image must be less than 5MB")
      }

      // Create a preview
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)

      // Generate a unique filename
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage.from("images").upload(filePath, file)

      if (uploadError) throw uploadError

      // Get the public URL
      const { data } = supabase.storage.from("images").getPublicUrl(filePath)

      // Pass the URL to the parent component
      onImageUploaded(data.publicUrl)
      setUploadSuccess(true)
    } catch (error: any) {
      setError(error.message)
      console.error("Error uploading image:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
        {preview ? (
          <div className="relative w-full">
            <img
              src={preview || "/placeholder.svg"}
              alt="Preview"
              className="mx-auto max-h-48 object-contain rounded-md"
            />
            {uploadSuccess && (
              <div className="absolute top-2 right-2 bg-green-100 text-green-600 p-1 rounded-full">
                <CheckCircle size={16} />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-gray-500">
            <ImageIcon size={48} className="mb-2" />
            <p className="text-sm">No image selected</p>
          </div>
        )}

        <div className="mt-4 w-full">
          <label className="w-full">
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={16} />
                  <span>{preview ? "Change Image" : "Upload Image"}</span>
                </>
              )}
            </Button>
            <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
          </label>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Recommended: JPG, PNG or WebP, max 5MB. Images will be optimized automatically.
      </p>
    </div>
  )
}
