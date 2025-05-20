import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const data = await request.json()

    const { error } = await supabase.from("impact_stats").insert([
      {
        label: data.label,
        value: data.value,
        description: data.description,
        order_index: data.order_index,
        active: data.active,
      },
    ])

    if (error) {
      console.error("Error creating impact stat:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error("Error in impact stats POST route:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("impact_stats").select("*").order("order_index")

    if (error) {
      console.error("Error fetching impact stats:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error in impact stats GET route:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
