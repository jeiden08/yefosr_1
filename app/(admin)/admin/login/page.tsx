"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { handleSupabaseError } from "@/lib/supabase/error-handler"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFirstAdmin, setIsFirstAdmin] = useState(false)
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  // Check if there are any existing admins
  useEffect(() => {
    const checkForAdmins = async () => {
      setIsCheckingAdmin(true)
      try {
        const { count, error } = await supabase.from("admins").select("*", { count: "exact", head: true })

        if (error) throw error

        setIsFirstAdmin(count === 0)
      } catch (error) {
        console.error("Error checking for admins:", error)
        // Default to regular login if we can't check
        setIsFirstAdmin(false)
      } finally {
        setIsCheckingAdmin(false)
      }
    }

    checkForAdmins()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Check if user is an admin
      const { data: admin, error: adminError } = await supabase.from("admins").select("*").eq("email", email).single()

      if (adminError) throw adminError

      if (!admin) {
        await supabase.auth.signOut()
        throw new Error("You are not authorized to access the admin area.")
      }

      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard.",
      })

      router.push("/admin")
      router.refresh()
    } catch (error) {
      handleSupabaseError(error, "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetupFirstAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Double-check that no admins exist
      const { count, error: countError } = await supabase.from("admins").select("*", { count: "exact", head: true })

      if (countError) throw countError

      if (count > 0) {
        setIsFirstAdmin(false)
        throw new Error("An admin already exists. Please log in instead.")
      }

      // 1. Create auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) throw signUpError

      // 2. Add to admins table
      const { error: adminError } = await supabase.from("admins").insert({
        id: authData.user?.id,
        name,
        email,
        password_hash: "managed_by_supabase_auth",
      })

      if (adminError) throw adminError

      // 3. Sign in with the new credentials
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      toast({
        title: "Admin setup complete",
        description: "You've been registered as the first admin user.",
      })

      router.push("/admin")
      router.refresh()
    } catch (error) {
      handleSupabaseError(error, "Admin setup failed")
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/40">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Checking system status...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>
            {isFirstAdmin ? "Set up the first admin user for your website." : "Sign in to access the admin dashboard."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isFirstAdmin ? (
            <form onSubmit={handleSetupFirstAdmin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
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
                    Setting up...
                  </>
                ) : (
                  "Set up admin account"
                )}
              </Button>
            </form>
          ) : (
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
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {!isFirstAdmin && (
            <Button variant="link" onClick={() => router.push("/admin/reset-password")}>
              Forgot password?
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
