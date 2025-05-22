import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = "https://www.yefosr.org";

// Static routes from your navigation
const staticRoutes = [
  "",
  "about",
  "programs",
  "resources",
  "gallery",
  "blog",
  "events",
  "contact",
];

// Helper to wrap a route in a <url> entry
function urlEntry(path: string) {
  const loc =
    path === "" ? BASE_URL : `${BASE_URL}/${path.replace(/^\/+/, "")}`;
  return `<url><loc>${loc}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
}

async function getDynamicRoutes() {
  const supabase = await createClient();

  // Blog posts: only published, not deleted
  const { data: blogPosts } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("published", true)
    .is("deleted_at", null);

  // Events: only published, not deleted
  const { data: events } = await supabase
    .from("events")
    .select("slug")
    .eq("published", true)
    .is("deleted_at", null);

  // Gallery images: only published, not deleted 
   const { data: galleryImages } = await supabase
     .from("gallery_images")
     .select("id")
     .eq("published", true)
     .is("deleted_at", null);

  const blogUrls =
    blogPosts?.map((post) => urlEntry(`blog/${post.slug}`)) ?? [];
  const eventUrls =
    events?.map((event) => urlEntry(`events/${event.slug}`)) ?? [];
   const galleryUrls =
     galleryImages?.map((img) => urlEntry(`gallery/${img.id}`)) ?? [];

  return [...blogUrls, ...eventUrls /*, ...galleryUrls */];
}

export async function GET() {
  const urls = staticRoutes.map(urlEntry);

  let dynamicUrls: string[] = [];
  try {
    dynamicUrls = await getDynamicRoutes();
  } catch (e) {
    console.error("Error fetching dynamic routes for sitemap:", e);
  }

  const allUrls = [...urls, ...dynamicUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls.join("\n  ")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: { "Content-Type": "application/xml" },
  });
}
