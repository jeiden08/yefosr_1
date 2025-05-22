"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [debugInfo, setDebugInfo] = useState("")
  const router = useRouter()
  const supabase = createClient()

  // Check for URL error parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const errorParam = urlParams.get("error")

    if (errorParam === "unauthorized") {
      setError("Your account does not have admin access.")
    } else if (errorParam === "server_error") {
      setError("A server error occurred. Please try again later.")
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setDebugInfo("Starting login process...")

    try {
      // Authenticate with Supabase
      setDebugInfo((prev) => prev + "\nAttempting to sign in with email and password...")

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setDebugInfo((prev) => prev + `\nAuth error: ${authError.message}`)
        throw authError
      }

      setDebugInfo((prev) => prev + `\nAuthentication successful. User ID: ${authData.user.id}`)

      // Check if user is an admin
      setDebugInfo((prev) => prev + "\nChecking if user is in admins table...")

      const { data: admin, error: adminError } = await supabase.from("admins").select("*").eq("email", email).single()

      setDebugInfo((prev) => prev + `\nAdmin query result: ${JSON.stringify({ admin, adminError })}`)

      if (adminError && adminError.code !== "PGRST116") {
        setDebugInfo((prev) => prev + `\nAdmin check error: ${adminError.message}`)
        throw adminError
      }

      if (!admin) {
        setDebugInfo((prev) => prev + "\nUser not found in admins table")
        await supabase.auth.signOut()
        throw new Error("You are not authorized to access the admin area.")
      }

      setDebugInfo((prev) => prev + `\nAdmin check successful. Admin ID: ${admin.id}`)

      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard.",
      })

      // Manually navigate to admin dashboard
      setDebugInfo((prev) => prev + "\nRedirecting to admin dashboard...")
      router.push("/admin")
    } catch (error) {
      console.error("Login error:", error)
      setDebugInfo((prev) => prev + `\nError: ${error.message || "Unknown error"}`)

      // Set a user-friendly error message
      if (error.message.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please try again.")
      } else if (error.message.includes("not authorized")) {
        setError("Your account doesn't have admin access.")
      } else {
        setError(error.message || "An error occurred during login.")
      }

      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Sign in to access the admin dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Debug information - remove in production */}
          {debugInfo && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-xs font-mono whitespace-pre-wrap">
              <p className="font-semibold mb-1">Debug Info:</p>
              {debugInfo}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => router.push("/admin/reset-password")}>
            Forgot password?
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
