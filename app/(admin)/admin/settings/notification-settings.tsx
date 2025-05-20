"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"

export function NotificationSettings({ initialSettings }: { initialSettings?: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [settings, setSettings] = useState({
    adminEmail: initialSettings?.adminEmail || "yefosr@gmail.com",
    enableNotifications: initialSettings?.enableNotifications !== false, // Default to true
    notifyOnNewMessages: initialSettings?.notifyOnNewMessages !== false, // Default to true
  })
  const supabase = createClient()

  const handleChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Save settings to Supabase
      const { error } = await supabase.from("site_settings").upsert({
        key: "notification_settings",
        value: settings,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      toast({
        title: "Settings saved",
        description: "Your notification settings have been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Something went wrong",
        description: "Your settings could not be saved. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTestEmail = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/test-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: settings.adminEmail }),
      })

      if (!response.ok) {
        throw new Error("Failed to send test email")
      }

      toast({
        title: "Test email sent",
        description: `A test email has been sent to ${settings.adminEmail}`,
      })
    } catch (error) {
      console.error("Error sending test email:", error)
      toast({
        title: "Email delivery failed",
        description: "The test email could not be sent. Please check your configuration.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Configure how and when you receive email notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="adminEmail">Email Address</Label>
            <Input
              id="adminEmail"
              value={settings.adminEmail}
              onChange={(e) => handleChange("adminEmail", e.target.value)}
              placeholder="admin@example.com"
            />
            <p className="text-sm text-muted-foreground">Notifications will be sent to this email address</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableNotifications">Enable Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Turn on/off all email notifications from the website</p>
              </div>
              <Switch
                id="enableNotifications"
                checked={settings.enableNotifications}
                onCheckedChange={(checked) => handleChange("enableNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifyOnNewMessages">New Contact Form Messages</Label>
                <p className="text-sm text-muted-foreground">Receive an email when someone submits the contact form</p>
              </div>
              <Switch
                id="notifyOnNewMessages"
                checked={settings.notifyOnNewMessages}
                onCheckedChange={(checked) => handleChange("notifyOnNewMessages", checked)}
                disabled={!settings.enableNotifications}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleTestEmail}
            disabled={isSubmitting || !settings.enableNotifications}
          >
            Send Test Email
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Settings"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
