import { withAudit } from "@/lib/with-audit"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

async function updateResourceHandler(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const data = await request.json()

  const { data: resource, error } = await supabase.from("resources").update(data).eq("id", params.id).select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(resource)
}

async function deleteResourceHandler(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { error } = await supabase.from("resources").delete().eq("id", params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

async function getPreviousData(params: { id: string }) {
  const supabase = await createClient()
  const { data } = await supabase.from("resources").select("*").eq("id", params.id).single()

  return data
}

export const PUT = withAudit(updateResourceHandler, {
  action: "update",
  resourceType: "resource",
  getResourceId: (params) => params.params.id,
  getPreviousData,
})

export const DELETE = withAudit(deleteResourceHandler, {
  action: "delete",
  resourceType: "resource",
  getResourceId: (params) => params.params.id,
  getPreviousData,
})
