import { createClient } from "@/lib/supabase/server"
import { safeQuery } from "@/lib/supabase/safe-query"
import { cache } from "react"

// Cache time in milliseconds (default: 5 minutes)
const DEFAULT_CACHE_TIME = 5 * 60 * 1000

// In-memory cache store
const cacheStore: Record<string, { data: any; timestamp: number }> = {}

/**
 * Executes a Supabase query with caching
 * @param queryKey Unique key for the query
 * @param queryFn Function that executes the Supabase query
 * @param fallbackData Fallback data if the query fails
 * @param cacheTime Cache time in milliseconds
 */
export const cachedQuery = cache(async <T>(\
  queryKey: string,
  queryFn: (client: any) => Promise<T>,
  fallbackData: T,
  cacheTime: number = DEFAULT_CACHE_TIME
): Promise<T> => {
// Check if we have a valid cached result
const cachedResult = cacheStore[queryKey]
const now = Date.now()

if (cachedResult && now - cachedResult.timestamp < cacheTime) {
  console.log(`[Cache] Using cached data for ${queryKey}`)
  return cachedResult.data as T
}

// If no valid cache, execute the query
console.log(`[Cache] Fetching fresh data for ${queryKey}`)
const supabase = await createClient()
const result = await safeQuery(supabase, queryFn, fallbackData)

// Store the result in cache
cacheStore[queryKey] = {
  data: result,
  timestamp: now,
}

return result as T
})

/**
 * Invalidates a specific cache entry
 * @param queryKey The key of the cache entry to invalidate
 */
export const invalidateCache = (queryKey: string): void => {
  delete cacheStore[queryKey]
  console.log(`[Cache] Invalidated cache for ${queryKey}`)
}

/**
 * Invalidates all cache entries
 */
export const invalidateAllCache = (): void => {
  Object.keys(cacheStore).forEach((key) => {
    delete cacheStore[key]
  })
  console.log(`[Cache] Invalidated all cache entries`)
}
