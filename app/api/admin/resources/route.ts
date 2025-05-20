import { withAudit } from "@/lib/with-audit"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

async function createResourceHandler(request: Request) {
  const supabase = await createClient()
  const data = await request.json()

  const { data: resource, error } = await supabase.from("resources").insert(data).select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(resource)
}

export const POST = withAudit(createResourceHandler, {
  action: "create",
  resourceType: "resource",
  getResourceId: (_, result) => result[0]?.id,
  getNewData: (_, result) => result[0],
})
