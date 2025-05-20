import { withAudit } from "@/lib/with-audit"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Original handler function
async function createExampleHandler(request: Request) {
  const supabase = await createClient()
  const body = await request.json()

  const { data, error } = await supabase.from("examples").insert(body).select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// Wrap with audit logging
export const POST = withAudit(createExampleHandler, {
  action: "create",
  resourceType: "example",
  getResourceId: (_, result) => result[0]?.id,
})

// For update operations
async function updateExampleHandler(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const body = await request.json()

  const { data, error } = await supabase.from("examples").update(body).eq("id", params.id).select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// Get previous data function
async function getPreviousExampleData({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data } = await supabase.from("examples").select("*").eq("id", params.id).single()

  return data
}

// Wrap update handler with audit logging
export const PUT = withAudit(updateExampleHandler, {
  action: "update",
  resourceType: "example",
  getResourceId: ({ params }) => params.id,
  getPreviousData: getPreviousExampleData,
})
