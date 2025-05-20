import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Safely executes a Supabase query with error handling and fallback
 * @param supabase Supabase client
 * @param queryFn Function that executes the query
 * @param fallback Fallback data to return if the query fails
 * @returns Query result or fallback data
 */
export async function safeQuery<T, F>(
  supabase: SupabaseClient,
  queryFn: (client: SupabaseClient) => Promise<{ data: T | null; error: any }>,
  fallback: F,
): Promise<T | F> {
  try {
    const { data, error } = await queryFn(supabase)

    if (error) {
      console.error("Supabase query error:", error)
      return fallback
    }

    if (data === null) {
      console.warn("Supabase query returned null data, using fallback")
      return fallback
    }

    return data
  } catch (err) {
    console.error("Error executing Supabase query:", err)
    return fallback
  }
}
