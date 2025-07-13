"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { User } from "@/lib/types"
import { createRoom, joinRoom } from "@/lib/firebase-utils"
import { Users, Plus } from "lucide-react"
import { Footer } from "@/components/footer"

interface RoomSelectorProps {
  user: User
  onRoomJoined: (roomId: string) => void
}

export function RoomSelector({ user, onRoomJoined }: RoomSelectorProps) {
  const [roomName, setRoomName] = useState("")
  const [roomId, setRoomId] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!roomName.trim()) return

    setLoading(true)
    try {
      const newRoomId = await createRoom(roomName.trim(), user)
      onRoomJoined(newRoomId)
    } catch (error) {
      console.error("Failed to create room:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!roomId.trim()) return

    setLoading(true)
    try {
      await joinRoom(roomId.trim(), user)
      onRoomJoined(roomId.trim())
    } catch (error) {
      console.error("Failed to join room:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-brand-light p-4">
        <Card className="w-full max-w-md shadow-lg border-brand-border">
          <CardHeader className="text-center bg-white">
            <CardTitle className="text-2xl font-bold text-brand-dark">Welcome, {user.name}!</CardTitle>
            <CardDescription className="text-brand-medium">Create a new room or join an existing one</CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <Tabs defaultValue={user.role === "admin" ? "create" : "join"} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-brand-input">
                <TabsTrigger
                  value="create"
                  disabled={user.role !== "admin"}
                  className="data-[state=active]:bg-brand-primary data-[state=active]:text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create
                </TabsTrigger>
                <TabsTrigger
                  value="join"
                  className="data-[state=active]:bg-brand-primary data-[state=active]:text-white"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Join
                </TabsTrigger>
              </TabsList>

              <TabsContent value="create" className="space-y-4">
                <form onSubmit={handleCreateRoom} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomName" className="text-brand-dark font-medium">
                      Room Name
                    </Label>
                    <Input
                      id="roomName"
                      type="text"
                      placeholder="Enter room name"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      required
                      className="bg-brand-input border-brand-border focus:border-brand-primary focus:ring-brand-primary"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-medium"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Room"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="join" className="space-y-4">
                <form onSubmit={handleJoinRoom} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomId" className="text-brand-dark font-medium">
                      Room ID
                    </Label>
                    <Input
                      id="roomId"
                      type="text"
                      placeholder="Enter room ID"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      required
                      className="bg-brand-input border-brand-border focus:border-brand-primary focus:ring-brand-primary"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-medium"
                    disabled={loading}
                  >
                    {loading ? "Joining..." : "Join Room"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
