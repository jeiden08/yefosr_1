import ProgramForm from "@/components/admin/program-form"

export default function NewProgramPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Add New Program</h1>
      <ProgramForm isNew />
    </div>
  )
}
