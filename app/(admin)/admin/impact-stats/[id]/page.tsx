import { createClient } from "@/lib/supabase/server"
import { safeQuery } from "@/lib/supabase/safe-query"
import { ImpactStatForm } from "@/components/admin/impact-stat-form"
import { notFound } from "next/navigation"

export const metadata = {
  title: "Edit Impact Statistic | Admin",
}

export default async function EditImpactStatPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const impactStat = await safeQuery(
    supabase,
    (client) => client.from("impact_stats").select("*").eq("id", params.id).single(),
    null,
  )

  if (!impactStat) {
    notFound()
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Edit Impact Statistic</h1>
      <div className="max-w-2xl mx-auto">
        <ImpactStatForm initialData={impactStat} isEditing />
      </div>
    </div>
  )
}
