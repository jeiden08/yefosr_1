import type React from "react";
import { Analytics } from "@vercel/analytics/react"; // Vercel Analytics import
import { MainNav } from "@/components/main-nav";
import { SiteFooter } from "@/components/site-footer";
import { createClient } from "@/lib/supabase/server";
import { ScrollAnimationScript } from "@/components/scroll-animation-script";
import { ScrollToTop } from "@/components/scroll-to-top";

// Default settings with accurate contact information and social media links
const defaultSettings = {
  navigation: {
    links: [
      { title: "Home", href: "/" },
      { title: "About", href: "/about" },
      { title: "Programs", href: "/programs" },
      { title: "Resources", href: "/resources" },
      { title: "Gallery", href: "/gallery" },
      { title: "Blog", href: "/blog" },
      { title: "Events", href: "/events" },
      { title: "Contact", href: "/contact" },
    ],
  },
  contact_info: {
    address: "Belameling Vocational Training Centre, Palorinya Refugee Settlement, Obongi District, Uganda",
    email: "yefosr@gmail.com",
    phone: ["+256 772 253 415", "+256 765 167 682", "+211 925 059 964"],
    whatsapp: "+256 772 253 415",
  },
  social_links: {
    facebook: "https://facebook.com/profile.php?id=100064325486694",
    linkedin: "https://linkedin.com/groups/13160404",
    twitter: "",
  },
};

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings = { ...defaultSettings };

  try {
    const supabase = await createClient();

    // Fetch site settings
    const { data: siteSettings, error } = await supabase
      .from("site_settings")
      .select("*")
      .in("key", ["navigation", "contact_info", "social_links"])
      .order("key");

    if (error) {
      console.error("Error fetching site settings:", error);
    } else if (siteSettings && siteSettings.length > 0) {
      // Transform site settings into a more usable format
      const fetchedSettings = siteSettings.reduce(
        (acc, setting) => {
          acc[setting.key] = setting.value;
          return acc;
        },
        {} as Record<string, any>
      );

      // Merge with defaults to ensure all fields exist
      settings = {
        navigation: { ...settings.navigation, ...fetchedSettings.navigation },
        contact_info: { ...settings.contact_info, ...fetchedSettings.contact_info },
        social_links: { ...settings.social_links, ...fetchedSettings.social_links },
      };
    }
  } catch (error) {
    console.error("Error in PublicLayout:", error);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav settings={settings} />
      <main className="flex-1">
        {children}
        <Analytics /> {/* Vercel Analytics component */}
      </main>
      <SiteFooter settings={settings} />
      <ScrollAnimationScript />
      <ScrollToTop />
    </div>
  );
}
