"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { handleSupabaseError } from "@/lib/supabase/error-handler"
import { Loader2 } from "lucide-react"

type Policy = {
  id: string
  name: string
  description: string
  enabled: boolean
  table: string
  definition: string
  command: "SELECT" | "INSERT" | "UPDATE" | "DELETE"
}

type RLSPolicyManagerProps = {
  tableName: string
  policies: Policy[]
}

export function RLSPolicyManager({ tableName, policies: initialPolicies }: RLSPolicyManagerProps) {
  const [policies, setPolicies] = useState<Policy[]>(initialPolicies)
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})
  const [isRLSEnabled, setIsRLSEnabled] = useState(true)
  const [isTogglingRLS, setIsTogglingRLS] = useState(false)
  const supabase = createClient()

  const togglePolicy = async (policyId: string, enabled: boolean) => {
    setIsLoading((prev) => ({ ...prev, [policyId]: true }))

    try {
      // In a real implementation, you would call a server action or API endpoint
      // that executes the appropriate SQL to enable/disable the policy
      // For now, we'll just simulate it

      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update the UI optimistically
      setPolicies((prev) => prev.map((policy) => (policy.id === policyId ? { ...policy, enabled } : policy)))

      toast({
        title: `Policy ${enabled ? "enabled" : "disabled"}`,
        description: `The policy has been ${enabled ? "enabled" : "disabled"} successfully.`,
      })
    } catch (error) {
      handleSupabaseError(error, "Failed to update policy")
      // Revert the optimistic update
      setPolicies(initialPolicies)
    } finally {
      setIsLoading((prev) => ({ ...prev, [policyId]: false }))
    }
  }

  const toggleRLS = async (enabled: boolean) => {
    setIsTogglingRLS(true)

    try {
      // In a real implementation, you would call a server action or API endpoint
      // that executes the appropriate SQL to enable/disable RLS
      // For now, we'll just simulate it

      await new Promise((resolve) => setTimeout(resolve, 500))

      setIsRLSEnabled(enabled)

      toast({
        title: `Row Level Security ${enabled ? "enabled" : "disabled"}`,
        description: `RLS has been ${enabled ? "enabled" : "disabled"} for the ${tableName} table.`,
      })
    } catch (error) {
      handleSupabaseError(error, "Failed to update RLS settings")
    } finally {
      setIsTogglingRLS(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Row Level Security for {tableName}</CardTitle>
        <CardDescription>Manage access control policies for the {tableName} table</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2">
          <div>
            <Label htmlFor="rls-toggle" className="font-medium">
              Enable Row Level Security
            </Label>
            <p className="text-sm text-muted-foreground">
              When enabled, access to this table will be restricted based on the policies below
            </p>
          </div>
          <Switch id="rls-toggle" checked={isRLSEnabled} onCheckedChange={toggleRLS} disabled={isTogglingRLS} />
        </div>

        {isRLSEnabled && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Policies</h3>
            <div className="space-y-2">
              {policies.map((policy) => (
                <div key={policy.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <span className="font-medium">{policy.name}</span>
                      <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">{policy.command}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{policy.description}</p>
                  </div>
                  <Switch
                    checked={policy.enabled}
                    onCheckedChange={(checked) => togglePolicy(policy.id, checked)}
                    disabled={isLoading[policy.id]}
                  />
                  {isLoading[policy.id] && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">Changes to RLS policies take effect immediately for all users</p>
      </CardFooter>
    </Card>
  )
}
