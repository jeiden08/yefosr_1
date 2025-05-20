import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const pathname = req.nextUrl.pathname

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Admin routes protection
  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && pathname !== "/admin/reset-password") {
    if (!session) {
      // Redirect to login if no session
      const redirectUrl = new URL("/admin/login", req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Check if the user is an admin
    if (session) {
      try {
        const { data: admin, error } = await supabase
          .from("admins")
          .select("*")
          .eq("email", session.user.email)
          .single()

        if (error || !admin) {
          // If not an admin, sign out and redirect to login
          await supabase.auth.signOut()
          const redirectUrl = new URL("/admin/login", req.url)
          return NextResponse.redirect(redirectUrl)
        }
      } catch (error) {
        console.error("Error checking admin status:", error)
        // On error, redirect to login to be safe
        const redirectUrl = new URL("/admin/login", req.url)
        return NextResponse.redirect(redirectUrl)
      }
    }
  }

  // If user is logged in and tries to access login page, redirect to admin dashboard
  // IMPORTANT: Commenting this out to prevent redirect loops
  /*
  if (pathname === "/admin/login" && session) {
    const redirectUrl = new URL("/admin", req.url)
    return NextResponse.redirect(redirectUrl)
  }
  */

  return res
}

// Specify which paths this middleware will run on
export const config = {
  matcher: ["/admin/:path*"],
}
