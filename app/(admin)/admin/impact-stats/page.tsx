import { createClient } from "@/lib/supabase/server"
import { safeQuery } from "@/lib/supabase/safe-query"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { ImpactStatsChart } from "@/components/impact-stats-chart"

export default async function ImpactStatsPage() {
  const supabase = await createClient()

  const impactStats = await safeQuery(
    supabase,
    (client) => client.from("impact_stats").select("*").order("order_index"),
    [],
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Impact Statistics</h1>
        <Link href="/admin/impact-stats/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Stat
          </Button>
        </Link>
      </div>

      {/* Add the chart component */}
      <ImpactStatsChart stats={impactStats} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {impactStats.map((stat) => (
          <div key={stat.id} className="bg-card rounded-lg border shadow-sm p-4">
            <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
            <div className="font-medium">{stat.label}</div>
            {stat.description && <p className="text-sm text-muted-foreground mt-1">{stat.description}</p>}
            <div className="mt-4 flex justify-end">
              <Link href={`/admin/impact-stats/${stat.id}`}>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
