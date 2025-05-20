import { createClient } from "@supabase/supabase-js"
import ProgramForm from "@/components/admin/program-form"
import { notFound } from "next/navigation"

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export const revalidate = 0

async function getProgram(id: string) {
  const { data, error } = await supabase.from("programs").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching program:", error)
    return null
  }

  return data
}

export default async function EditProgramPage({ params }: { params: { id: string } }) {
  const program = await getProgram(params.id)

  if (!program) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Program</h1>
      <ProgramForm program={program} />
    </div>
  )
}
