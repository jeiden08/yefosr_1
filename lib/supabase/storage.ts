import { createClient } from "@/lib/supabase/client"
import { handleSupabaseError } from "./error-handler"

export type UploadOptions = {
  bucket: string
  folder?: string
  fileName?: string
  fileType?: string
  maxSizeMB?: number
}

export async function uploadFile(file: File, options: UploadOptions): Promise<{ url: string | null; error: any }> {
  const supabase = createClient()
  const { bucket, folder = "", fileName, fileType, maxSizeMB = 5 } = options

  try {
    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSizeMB) {
      return {
        url: null,
        error: `File size exceeds the ${maxSizeMB}MB limit`,
      }
    }

    // Generate a unique file name if not provided
    const fileExt = file.name.split(".").pop()
    const uniqueFileName = fileName || `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = folder ? `${folder}/${uniqueFileName}` : uniqueFileName

    // Upload file
    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file, {
      contentType: fileType || file.type,
      upsert: false,
    })

    if (uploadError) {
      throw uploadError
    }

    // Get public URL
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)

    return {
      url: data.publicUrl,
      error: null,
    }
  } catch (error) {
    handleSupabaseError(error, "Failed to upload file")
    return {
      url: null,
      error,
    }
  }
}

export async function deleteFile(path: string, bucket: string): Promise<{ success: boolean; error: any }> {
  const supabase = createClient()

  try {
    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      throw error
    }

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    handleSupabaseError(error, "Failed to delete file")
    return {
      success: false,
      error,
    }
  }
}
