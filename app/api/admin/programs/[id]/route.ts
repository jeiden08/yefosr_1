import { withAudit } from "@/lib/with-audit"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

async function updateProgramHandler(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const data = await request.json()

  const { data: program, error } = await supabase.from("programs").update(data).eq("id", params.id).select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(program)
}

async function deleteProgramHandler(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { error } = await supabase.from("programs").delete().eq("id", params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

async function getPreviousData(params: { id: string }) {
  const supabase = await createClient()
  const { data } = await supabase.from("programs").select("*").eq("id", params.id).single()

  return data
}

export const PUT = withAudit(updateProgramHandler, {
  action: "update",
  resourceType: "program",
  getResourceId: (params) => params.params.id,
  getPreviousData,
})

export const DELETE = withAudit(deleteProgramHandler, {
  action: "delete",
  resourceType: "program",
  getResourceId: (params) => params.params.id,
  getPreviousData,
})
