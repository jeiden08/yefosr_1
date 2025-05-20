"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { handleSupabaseError } from "@/lib/supabase/error-handler"

type PaginationOptions = {
  pageSize?: number
  initialPage?: number
  orderBy?: { column: string; ascending?: boolean }
  filters?: Record<string, any>
}

export function usePagination<T>(tableName: string, options?: PaginationOptions) {
  const {
    pageSize = 10,
    initialPage = 1,
    orderBy = { column: "created_at", ascending: false },
    filters = {},
  } = options || {}

  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [count, setCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const supabase = createClient()

  const fetchData = async (page: number = currentPage) => {
    setLoading(true)
    setError(null)

    try {
      // Calculate pagination values
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      // Build query
      let query = supabase
        .from(tableName)
        .select("*", { count: "exact" })
        .is("deleted_at", null)
        .order(orderBy.column, { ascending: orderBy.ascending !== false })
        .range(from, to)

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

      const { data, error, count: totalCount } = await query

      if (error) {
        throw error
      }

      setData(data as T[])
      setCount(totalCount || 0)
      setCurrentPage(page)
    } catch (err: any) {
      handleSupabaseError(err, `Failed to fetch ${tableName}`)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const goToPage = (page: number) => {
    if (page < 1) page = 1
    const maxPage = Math.ceil(count / pageSize)
    if (page > maxPage) page = maxPage

    fetchData(page)
  }

  const nextPage = () => {
    const maxPage = Math.ceil(count / pageSize)
    if (currentPage < maxPage) {
      goToPage(currentPage + 1)
    }
  }

  const previousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }

  const totalPages = Math.ceil(count / pageSize)

  return {
    data,
    loading,
    error,
    count,
    currentPage,
    pageSize,
    totalPages,
    fetchData,
    goToPage,
    nextPage,
    previousPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  }
}
