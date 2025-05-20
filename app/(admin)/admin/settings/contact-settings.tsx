"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { PlusCircle, Trash2 } from "lucide-react"

export function ContactSettings({ initialSettings }: { initialSettings?: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [settings, setSettings] = useState({
    address:
      initialSettings?.address ||
      "Belameling Vocational Training Centre, Palorinya Refugee Settlement, Obongi District, Uganda",
    email: initialSettings?.email || "yefosr@gmail.com",
    phone: initialSettings?.phone || ["+256 772 253 415", "+256 765 167 682", "+211 925 059 964"],
    whatsapp: initialSettings?.whatsapp || "+256 772 253 415",
    social: {
      facebook: initialSettings?.social?.facebook || "https://facebook.com/profile.php?id=100064325486694",
      linkedin: initialSettings?.social?.linkedin || "https://linkedin.com/groups/13160404",
      twitter: initialSettings?.social?.twitter || "",
    },
  })
  const supabase = createClient()

  const handleChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSocialChange = (platform: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        [platform]: value,
      },
    }))
  }

  const handlePhoneChange = (index: number, value: string) => {
    const newPhones = [...settings.phone]
    newPhones[index] = value
    handleChange("phone", newPhones)
  }

  const addPhone = () => {
    handleChange("phone", [...settings.phone, ""])
  }

  const removePhone = (index: number) => {
    const newPhones = [...settings.phone]
    newPhones.splice(index, 1)
    handleChange("phone", newPhones)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Save settings to Supabase
      const { error } = await supabase.from("site_settings").upsert({
        key: "contact_info",
        value: settings,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      toast({
        title: "Settings saved",
        description: "Your contact information has been updated successfully.",
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

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Update your organization's contact details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={settings.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Your organization's address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="contact@example.com"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Phone Numbers</Label>
              <Button type="button" variant="outline" size="sm" onClick={addPhone} className="h-8">
                <PlusCircle className="h-3.5 w-3.5 mr-1" />
                Add Phone
              </Button>
            </div>
            <div className="space-y-2">
              {settings.phone.map((phone, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={phone}
                    onChange={(e) => handlePhoneChange(index, e.target.value)}
                    placeholder="Phone number"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePhone(index)}
                    className="h-10 w-10 text-destructive"
                    disabled={settings.phone.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <Input
              id="whatsapp"
              value={settings.whatsapp}
              onChange={(e) => handleChange("whatsapp", e.target.value)}
              placeholder="WhatsApp number"
            />
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium mb-4">Social Media</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={settings.social.facebook}
                  onChange={(e) => handleSocialChange("facebook", e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={settings.social.linkedin}
                  onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">X (Twitter)</Label>
                <Input
                  id="twitter"
                  value={settings.social.twitter}
                  onChange={(e) => handleSocialChange("twitter", e.target.value)}
                  placeholder="https://x.com/yourusername"
                />
                <p className="text-sm text-muted-foreground">Leave blank if you don't have an X account yet</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Settings"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
