"use client"

import type React from "react"

import { useState } from "react"
import { signInAnonymously } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User } from "@/lib/types"
import { Footer } from "@/components/footer"

interface AuthFormProps {
  onAuth: (user: User) => void
}

export function AuthForm({ onAuth }: AuthFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"admin" | "user" | "observer">("user")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    setLoading(true)
    try {
      const userCredential = await signInAnonymously(auth)
      const user: User = {
        id: userCredential.user.uid,
        name: name.trim(),
        email: email.trim(),
        role,
      }
      onAuth(user)
    } catch (error) {
      console.error("Authentication failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-brand-light p-4">
        <Card className="w-full max-w-md shadow-lg border-brand-border">
          <CardHeader className="text-center bg-white">
            <CardTitle className="text-3xl font-bold text-brand-primary">Planning Poker</CardTitle>
            <CardDescription className="text-brand-medium">Enter your details to join or create a room</CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-brand-dark font-medium">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-brand-input border-brand-border focus:border-brand-primary focus:ring-brand-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-brand-dark font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-brand-input border-brand-border focus:border-brand-primary focus:ring-brand-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-brand-dark font-medium">
                  Role
                </Label>
                <Select value={role} onValueChange={(value: "admin" | "user" | "observer") => setRole(value)}>
                  <SelectTrigger className="bg-brand-input border-brand-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin (Create Room)</SelectItem>
                    <SelectItem value="user">User (Vote)</SelectItem>
                    <SelectItem value="observer">Observer (View Only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-medium"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Continue"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
