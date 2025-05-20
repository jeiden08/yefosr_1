"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { handleSupabaseError } from "@/lib/supabase/error-handler"
import { useDebounce } from "@/hooks/use-debounce"

type SearchOptions = {
  columns: string[]
  initialQuery?: string
  debounceMs?: number
  limit?: number
  orderBy?: { column: string; ascending?: boolean }
  filters?: Record<string, any>
}

export function useSearch<T>(tableName: string, options: SearchOptions) {
  const {
    columns,
    initialQuery = "",
    debounceMs = 300,
    limit = 20,
    orderBy = { column: "created_at", ascending: false },
    filters = {},
  } = options

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const debouncedQuery = useDebounce(query, debounceMs)
  const supabase = createClient()

  const search = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      setError(null)

      try {
        let query = supabase
          .from(tableName)
          .select("*")
          .is("deleted_at", null)
          .order(orderBy.column, { ascending: orderBy.ascending !== false })
          .limit(limit)

        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              query = query.in(key, value)
            } else {
              query = query.eq(key, value)
            }
          }
        })

        // Apply search to each column with OR condition
        const searchTerm = `%${searchQuery}%`
        let searchFilter = ""

        columns.forEach((column, index) => {
          if (index === 0) {
            searchFilter = `${column}.ilike.${searchTerm}`
          } else {
            searchFilter += `,or(${column}.ilike.${searchTerm})`
          }
        })

        query = query.or(searchFilter)

        const { data, error } = await query

        if (error) {
          throw error
        }

        setResults(data as T[])
      } catch (err: any) {
        handleSupabaseError(err, "Search failed")
        setError(err)
      } finally {
        setLoading(false)
      }
    },
    [tableName, columns, limit, orderBy, filters, supabase],
  )

  useEffect(() => {
    search(debouncedQuery)
  }, [debouncedQuery, search])

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    search,
  }
}
