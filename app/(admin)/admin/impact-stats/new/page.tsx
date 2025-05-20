import { ImpactStatForm } from "@/components/admin/impact-stat-form"

export const metadata = {
  title: "Add Impact Statistic | Admin",
}

export default function NewImpactStatPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Add Impact Statistic</h1>
      <div className="max-w-2xl mx-auto">
        <ImpactStatForm />
      </div>
    </div>
  )
}
