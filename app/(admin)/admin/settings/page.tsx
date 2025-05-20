import { createClient } from "@/lib/supabase/server"
import { NotificationSettings } from "./notification-settings"
import { ContactSettings } from "./contact-settings"

export const metadata = {
  title: "Site Settings | Admin Dashboard",
}

export default async function SettingsPage() {
  const supabase = createClient()

  // Fetch settings
  const { data: settings } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["notification_settings", "contact_info"])

  // Transform settings into a more usable format
  const settingsMap =
    settings?.reduce(
      (acc, setting) => {
        acc[setting.key] = setting.value
        return acc
      },
      {} as Record<string, any>,
    ) || {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your website settings and configurations.</p>
      </div>

      <div className="space-y-8">
        <ContactSettings initialSettings={settingsMap.contact_info} />

        <NotificationSettings initialSettings={settingsMap.notification_settings} />

        {/* Other settings sections would go here */}
      </div>
    </div>
  )
}
