import Link from "next/link"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Edit, Eye, EyeOff } from "lucide-react"

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export const revalidate = 0

async function getPrograms() {
  const { data, error } = await supabase.from("programs").select("*").order("order_index", { ascending: true })

  if (error) {
    console.error("Error fetching programs:", error)
    return []
  }

  return data
}

export default async function ProgramsPage() {
  const programs = await getPrograms()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Programs</h1>
        <Link href="/admin/programs/new">
          <Button>
            <PlusCircle size={16} className="mr-2" />
            Add Program
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Programs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Title</th>
                  <th className="text-left py-3 px-4">Order</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Image</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((program) => (
                  <tr key={program.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{program.title}</td>
                    <td className="py-3 px-4">{program.order_index}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {program.published ? (
                          <>
                            <Eye size={16} className="text-green-500 mr-2" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff size={16} className="text-gray-500 mr-2" />
                            <span>Draft</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {program.image_url ? (
                        <div className="w-12 h-12 rounded overflow-hidden">
                          <img
                            src={program.image_url || "/placeholder.svg"}
                            alt={program.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400">No image</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link href={`/admin/programs/${program.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit size={16} className="mr-2" />
                          Edit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}

                {programs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-500">
                      No programs found. Create your first program to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
