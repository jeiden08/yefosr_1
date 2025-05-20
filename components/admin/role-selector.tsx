"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"

interface RoleSelectorProps {
  userId: string
  initialRoleId?: string
  onRoleChange?: (roleId: string) => void
}

export function RoleSelector({ userId, initialRoleId, onRoleChange }: RoleSelectorProps) {
  const [open, setOpen] = useState(false)
  const [roles, setRoles] = useState<{ id: string; name: string; description: string | null }[]>([])
  const [selectedRoleId, setSelectedRoleId] = useState<string | undefined>(initialRoleId)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRoles() {
      setIsLoading(true)
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("roles").select("*").order("name")

        if (error) throw error
        setRoles(data || [])

        // If no initial role is provided, fetch the user's current role
        if (!initialRoleId) {
          const { data: userRoles, error: userRolesError } = await supabase
            .from("admin_roles")
            .select("role_id")
            .eq("admin_id", userId)
            .single()

          if (!userRolesError && userRoles) {
            setSelectedRoleId(userRoles.role_id)
          }
        }
      } catch (error) {
        console.error("Error fetching roles:", error)
        toast({
          title: "Error",
          description: "Failed to load roles. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRoles()
  }, [userId, initialRoleId])

  const selectedRole = roles.find((role) => role.id === selectedRoleId)

  const handleRoleSelect = async (roleId: string) => {
    setSelectedRoleId(roleId)
    setOpen(false)

    if (onRoleChange) {
      onRoleChange(roleId)
      return
    }

    // If no callback is provided, update the role in the database
    try {
      const supabase = createClient()

      // First, delete any existing roles for this user
      const { error: deleteError } = await supabase.from("admin_roles").delete().eq("admin_id", userId)

      if (deleteError) throw deleteError

      // Then, insert the new role
      const { error: insertError } = await supabase.from("admin_roles").insert({ admin_id: userId, role_id: roleId })

      if (insertError) throw insertError

      toast({
        title: "Role updated",
        description: "The user's role has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating role:", error)
      toast({
        title: "Error",
        description: "Failed to update role. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isLoading}
        >
          {isLoading ? "Loading roles..." : selectedRole ? selectedRole.name : "Select role..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search roles..." />
          <CommandList>
            <CommandEmpty>No roles found.</CommandEmpty>
            <CommandGroup>
              {roles.map((role) => (
                <CommandItem key={role.id} value={role.name} onSelect={() => handleRoleSelect(role.id)}>
                  <Check className={cn("mr-2 h-4 w-4", selectedRoleId === role.id ? "opacity-100" : "opacity-0")} />
                  {role.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
