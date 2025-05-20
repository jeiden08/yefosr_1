"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Save, Archive } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AuditSettingsPage() {
  const [retentionDays, setRetentionDays] = useState<number>(90)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isArchiving, setIsArchiving] = useState<boolean>(false)
  const [archiveResult, setArchiveResult] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/admin/settings/audit-retention")
        if (!response.ok) {
          throw new Error("Failed to fetch audit retention settings")
        }
        const data = await response.json()
        setRetentionDays(data.days)
      } catch (error) {
        console.error("Error fetching audit retention settings:", error)
        toast({
          title: "Error",
          description: "Failed to load audit retention settings",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [toast])

  const handleSaveRetention = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/settings/audit-retention", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ days: retentionDays }),
      })

      if (!response.ok) {
        throw new Error("Failed to save audit retention settings")
      }

      toast({
        title: "Success",
        description: "Audit retention settings saved successfully",
      })
    } catch (error) {
      console.error("Error saving audit retention settings:", error)
      toast({
        title: "Error",
        description: "Failed to save audit retention settings",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleManualArchive = async () => {
    setIsArchiving(true)
    setArchiveResult(null)
    try {
      // Use a server action or API route that handles the token securely
      const response = await fetch("/api/admin/trigger-archive", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to archive audit logs")
      }

      const data = await response.json()
      setArchiveResult(`Successfully archived ${data.archivedCount} audit logs`)

      toast({
        title: "Success",
        description: `Successfully archived ${data.archivedCount} audit logs`,
      })
    } catch (error) {
      console.error("Error archiving audit logs:", error)
      setArchiveResult("Failed to archive audit logs")
      toast({
        title: "Error",
        description: "Failed to archive audit logs",
        variant: "destructive",
      })
    } finally {
      setIsArchiving(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Audit Log Settings</h1>

      <Tabs defaultValue="retention">
        <TabsList className="mb-6">
          <TabsTrigger value="retention">Retention Policy</TabsTrigger>
          <TabsTrigger value="archive">Manual Archive</TabsTrigger>
        </TabsList>

        <TabsContent value="retention">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log Retention</CardTitle>
              <CardDescription>
                Configure how long audit logs are kept in the main database before being archived.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="retentionDays">Retention Period (days)</Label>
                      <Input
                        id="retentionDays"
                        type="number"
                        min="1"
                        value={retentionDays}
                        onChange={(e) => setRetentionDays(Number.parseInt(e.target.value) || 90)}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      Audit logs older than the retention period will be moved to the archive table and removed from the
                      main audit logs table.
                    </p>
                    <p className="mt-2">
                      This helps maintain database performance while still preserving historical audit data.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveRetention} disabled={isLoading || isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="archive">
          <Card>
            <CardHeader>
              <CardTitle>Manual Archive</CardTitle>
              <CardDescription>
                Manually trigger the archiving process for audit logs older than the retention period.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p>
                    This will move audit logs older than {retentionDays} days to the archive table and remove them from
                    the main audit logs table.
                  </p>
                  <p className="mt-2">
                    Normally this process runs automatically via a scheduled job, but you can trigger it manually here.
                  </p>
                </div>

                {archiveResult && (
                  <div
                    className={`p-4 rounded-md ${
                      archiveResult.includes("Failed") ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"
                    }`}
                  >
                    {archiveResult}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleManualArchive} disabled={isArchiving} variant="secondary">
                {isArchiving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Archiving...
                  </>
                ) : (
                  <>
                    <Archive className="mr-2 h-4 w-4" />
                    Run Archive Process
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
