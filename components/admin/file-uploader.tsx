"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileIcon, Loader2, CheckCircle, AlertCircle, FileText, FileArchive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client for handling uploads
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

type FileUploaderProps = {
  onFileUploaded: (url: string, filename: string) => void
  currentFileUrl?: string
  folder?: string
  className?: string
  acceptedFileTypes?: string
}

export default function FileUploader({
  onFileUploaded,
  currentFileUrl,
  folder = "resources",
  className = "",
  acceptedFileTypes = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar",
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(currentFileUrl ? currentFileUrl.split("/").pop() : null)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const getFileIcon = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase()

    if (ext === "pdf") return <FileText size={24} className="text-red-500" />
    if (["doc", "docx"].includes(ext || "")) return <FileText size={24} className="text-blue-500" />
    if (["xls", "xlsx"].includes(ext || "")) return <FileText size={24} className="text-green-500" />
    if (["ppt", "pptx"].includes(ext || "")) return <FileText size={24} className="text-orange-500" />
    if (["zip", "rar"].includes(ext || "")) return <FileArchive size={24} className="text-purple-500" />

    return <FileIcon size={24} className="text-gray-500" />
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null)
      setUploading(true)
      setUploadSuccess(false)

      if (!e.target.files || e.target.files.length === 0) {
        throw new Error("Please select a file to upload")
      }

      const file = e.target.files[0]
      setFileName(file.name)

      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File must be less than 10MB")
      }

      // Generate a unique filename
      const fileExt = file.name.split(".").pop()
      const originalFileName = file.name.split(".").slice(0, -1).join(".")
      const sanitizedFileName = originalFileName.replace(/[^a-zA-Z0-9]/g, "-")
      const fileName = `${sanitizedFileName}-${Date.now()}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage.from("files").upload(filePath, file)

      if (uploadError) throw uploadError

      // Get the public URL
      const { data } = supabase.storage.from("files").getPublicUrl(filePath)

      // Pass the URL to the parent component
      onFileUploaded(data.publicUrl, file.name)
      setUploadSuccess(true)
    } catch (error: any) {
      setError(error.message)
      console.error("Error uploading file:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
        {fileName ? (
          <div className="flex items-center gap-3 w-full">
            {getFileIcon(fileName)}
            <div className="flex-1 truncate">
              <p className="font-medium truncate">{fileName}</p>
              {currentFileUrl && (
                <a
                  href={currentFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View current file
                </a>
              )}
            </div>
            {uploadSuccess && (
              <div className="bg-green-100 text-green-600 p-1 rounded-full">
                <CheckCircle size={16} />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-gray-500">
            <FileIcon size={48} className="mb-2" />
            <p className="text-sm">No file selected</p>
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
                  <span>{fileName ? "Change File" : "Upload File"}</span>
                </>
              )}
            </Button>
            <input
              type="file"
              accept={acceptedFileTypes}
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <p className="text-xs text-gray-500">Accepted formats: PDF, Word, Excel, PowerPoint, Text, ZIP. Max 10MB.</p>
    </div>
  )
}
