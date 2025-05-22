import { createClient } from "@/lib/supabase/server"
import { handleSupabaseError } from "./error-handler"
import { cache } from "react"

// Generic type for fetching a single item
export const fetchItem = cache(async <T>(
  tableName: string,
  id: string,
  columns: string = "*",
  options?: {
    relationTable?: string;
    relationColumns?: string;
  }
): Promise<T | null> => {
  const supabase = await createClient() // <-- await!

  try {
    let query = supabase.from(tableName).select(columns).eq("id", id).is("deleted_at", null).single()

    if (options?.relationTable && options?.relationColumns) {
      query = supabase
        .from(tableName)
        .select(`${columns}, ${options.relationTable}(${options.relationColumns})`)
        .eq("id", id)
        .is("deleted_at", null)
        .single()
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return data as T
  } catch (error) {
    handleSupabaseError(error, `Failed to fetch ${tableName}`)
    return null
  }
})

// Generic type for fetching a list of items
export const fetchItems = cache(async <T>(
  tableName: string,
  options?: {
    columns?: string;
    filters?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
    relationTable?: string;
    relationColumns?: string;
  }
): Promise<T[]> => {
  const supabase = await createClient() // <-- await!
  const { columns = "*", filters = {}, orderBy, limit, relationTable, relationColumns } = options || {}

  try {
    let selectQuery = columns

    if (relationTable && relationColumns) {
      selectQuery = `${columns}, ${relationTable}(${relationColumns})`
    }

    let query = supabase.from(tableName).select(selectQuery).is("deleted_at", null)

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

    // Apply ordering
    if (orderBy) {
      query = query.order(orderBy.column, {
        ascending: orderBy.ascending !== false,
      })
    }

    // Apply limit
    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return data as T[]
  } catch (error) {
    handleSupabaseError(error, `Failed to fetch ${tableName} items`)
    return []
  }
})