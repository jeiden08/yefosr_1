import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("impact_stats").select("*").eq("id", params.id).single()

    if (error) {
      console.error("Error fetching impact stat:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Impact stat not found" }, { status: 404 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error in impact stat GET route:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const data = await request.json()

    const { error } = await supabase
      .from("impact_stats")
      .update({
        label: data.label,
        value: data.value,
        description: data.description,
        order_index: data.order_index,
        active: data.active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)

    if (error) {
      console.error("Error updating impact stat:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error in impact stat PATCH route:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from("impact_stats").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting impact stat:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error in impact stat DELETE route:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
