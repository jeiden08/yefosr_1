import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  // Skip middleware for non-admin routes
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  // Skip middleware for admin login page and reset password
  if (request.nextUrl.pathname === "/admin/login" || request.nextUrl.pathname === "/admin/reset-password") {
    return NextResponse.next()
  }

  // For admin routes, check authentication
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // Don't set cookies in the middleware
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          // Don't remove cookies in the middleware
          response.cookies.set({ name, value: "", ...options })
        },
      },
    },
  )

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If no session and trying to access admin pages, redirect to login
    if (!session) {
      const redirectUrl = new URL("/admin/login", request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Check if user is an admin
    const { data: admin, error: adminError } = await supabase
      .from("admins")
      .select("id")
      .eq("email", session.user.email)
      .single()

    if (adminError || !admin) {
      // If not an admin, sign out and redirect to login
      await supabase.auth.signOut()
      const redirectUrl = new URL("/admin/login", request.url)
      return NextResponse.redirect(redirectUrl)
    }

    return response
  } catch (error) {
    console.error("Middleware auth error:", error)
    // If there's an error checking the session, redirect to login
    const redirectUrl = new URL("/admin/login", request.url)
    return NextResponse.redirect(redirectUrl)
  }
}

export const config = {
  matcher: ["/admin/:path*"],
}
