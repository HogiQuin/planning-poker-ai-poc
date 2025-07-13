"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Room, User } from "@/lib/types"
import { Copy, LogOut, Share2 } from "lucide-react"
import { useState } from "react"

interface RoomHeaderProps {
  room: Room
  user: User
  onLeave: () => void
}

export function RoomHeader({ room, user, onLeave }: RoomHeaderProps) {
  const [copied, setCopied] = useState(false)

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(room.id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy room ID:", error)
    }
  }

  return (
    <Card className="border-brand-border shadow-sm">
      <CardContent className="pt-6 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-primary">{room.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-brand-medium font-medium">Room ID:</span>
              <code className="text-sm bg-brand-input px-2 py-1 rounded border border-brand-border text-brand-dark">
                {room.id}
              </code>
              <Button size="sm" variant="ghost" onClick={copyRoomId} className="h-6 w-6 p-0 hover:bg-brand-input">
                {copied ? (
                  <span className="text-xs text-brand-success">✓</span>
                ) : (
                  <Copy className="w-3 h-3 text-brand-medium" />
                )}
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="border-brand-primary text-brand-primary bg-blue-50">
                {user.role === "admin" ? "Admin" : user.role === "observer" ? "Observer" : "Voter"}
              </Badge>
              <span className="text-sm text-brand-medium">as {user.name}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={copyRoomId}
              className="border-brand-border text-brand-primary hover:bg-blue-50 bg-transparent"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Room
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onLeave}
              className="border-brand-border text-brand-medium hover:bg-brand-input bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Leave Room
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
