import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("roles").select("*").order("name")

    if (error) {
      console.error("Error fetching roles:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error in roles GET route:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const data = await request.json()

    const { error } = await supabase.from("roles").insert({
      name: data.name,
      description: data.description,
    })

    if (error) {
      console.error("Error creating role:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error("Error in roles POST route:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
