import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("roles")
      .select(`
        *,
        role_permissions(
          permission_id,
          permissions(*)
        )
      `)
      .eq("id", params.id)
      .single()

    if (error) {
      console.error("Error fetching role:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error in role GET route:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const data = await request.json()

    const { error } = await supabase
      .from("roles")
      .update({
        name: data.name,
        description: data.description,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)

    if (error) {
      console.error("Error updating role:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Update permissions if provided
    if (data.permissions && Array.isArray(data.permissions)) {
      // First, delete existing permissions
      const { error: deleteError } = await supabase.from("role_permissions").delete().eq("role_id", params.id)

      if (deleteError) {
        console.error("Error deleting role permissions:", deleteError)
        return NextResponse.json({ error: deleteError.message }, { status: 500 })
      }

      // Then, insert new permissions
      if (data.permissions.length > 0) {
        const permissionsToInsert = data.permissions.map((permissionId: string) => ({
          role_id: params.id,
          permission_id: permissionId,
        }))

        const { error: insertError } = await supabase.from("role_permissions").insert(permissionsToInsert)

        if (insertError) {
          console.error("Error inserting role permissions:", insertError)
          return NextResponse.json({ error: insertError.message }, { status: 500 })
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error in role PATCH route:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    // Check if this is the super_admin role
    const { data: role } = await supabase.from("roles").select("name").eq("id", params.id).single()

    if (role?.name === "super_admin") {
      return NextResponse.json({ error: "Cannot delete the super_admin role" }, { status: 400 })
    }

    const { error } = await supabase.from("roles").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting role:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error in role DELETE route:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
