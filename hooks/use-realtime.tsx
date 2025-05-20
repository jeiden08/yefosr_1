"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import type { RealtimeChannel } from "@supabase/supabase-js"

type RealtimeOptions = {
  event?: "INSERT" | "UPDATE" | "DELETE" | "*"
  filter?: string
  schema?: string
}

export function useRealtimeSubscription<T>(
  tableName: string,
  options?: RealtimeOptions,
  callback?: (payload: { new: T; old: T | null; eventType: string }) => void,
) {
  const [data, setData] = useState<T[]>([])
  const [error, setError] = useState<Error | null>(null)
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const { event = "*", filter, schema = "public" } = options || {}

    // Create a channel for realtime subscriptions
    const channel = supabase
      .channel(`table-changes-${tableName}`)
      .on(
        "postgres_changes",
        {
          event,
          schema,
          table: tableName,
          filter,
        },
        (payload) => {
          // Handle the realtime update
          if (callback) {
            callback({
              new: payload.new as T,
              old: payload.old as T | null,
              eventType: payload.eventType,
            })
          }

          // Update local state based on the event type
          if (payload.eventType === "INSERT") {
            setData((currentData) => [...currentData, payload.new as T])
          } else if (payload.eventType === "UPDATE") {
            setData((currentData) =>
              currentData.map((item: any) => (item.id === (payload.new as any).id ? (payload.new as T) : item)),
            )
          } else if (payload.eventType === "DELETE") {
            setData((currentData) => currentData.filter((item: any) => item.id !== (payload.old as any).id))
          }
        },
      )
      .subscribe((status, err) => {
        if (status !== "SUBSCRIBED" || err) {
          setError(err || new Error(`Failed to subscribe to ${tableName}`))
        }
      })

    setChannel(channel)

    // Cleanup function
    return () => {
      supabase.removeChannel(channel)
    }
  }, [tableName, options, callback, supabase])

  // Function to fetch initial data
  const fetchInitialData = async () => {
    try {
      const { data, error } = await supabase.from(tableName).select("*").is("deleted_at", null)

      if (error) {
        throw error
      }

      setData(data as T[])
    } catch (err: any) {
      setError(err)
    }
  }

  return {
    data,
    error,
    channel,
    fetchInitialData,
  }
}
