import { withAudit } from "@/lib/with-audit"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

async function createProgramHandler(request: Request) {
  const supabase = await createClient()
  const data = await request.json()

  const { data: program, error } = await supabase.from("programs").insert(data).select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(program)
}

export const POST = withAudit(createProgramHandler, {
  action: "create",
  resourceType: "program",
  getResourceId: (_, result) => result[0]?.id,
  getNewData: (_, result) => result[0],
})
