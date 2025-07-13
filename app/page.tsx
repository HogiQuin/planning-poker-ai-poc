"use client"

import { useState, useEffect } from "react"
import { AuthForm } from "@/components/auth-form"
import { RoomSelector } from "@/components/room-selector"
import { RoomHeader } from "@/components/room-header"
import { TaskManagement } from "@/components/task-management"
import { VotingInterface } from "@/components/voting-interface"
import { VotesDisplay } from "@/components/votes-display"
import { ParticipantsList } from "@/components/participants-list"
import { Reports } from "@/components/reports"
import { Footer } from "@/components/footer"
import type { User, Room } from "@/lib/types"
import { subscribeToRoom, leaveRoom } from "@/lib/firebase-utils"

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [roomId, setRoomId] = useState<string | null>(null)
  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("planningPokerUser")
    const savedRoomId = localStorage.getItem("planningPokerRoomId")

    if (savedUser && savedRoomId) {
      setUser(JSON.parse(savedUser))
      setRoomId(savedRoomId)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    if (roomId) {
      const unsubscribe = subscribeToRoom(roomId, (roomData) => {
        if (roomData) {
          setRoom(roomData)
        } else {
          // Room doesn't exist, reset state
          setRoomId(null)
          setRoom(null)
          localStorage.removeItem("planningPokerRoomId")
        }
      })

      return unsubscribe
    }
  }, [roomId])

  const handleAuth = (userData: User) => {
    setUser(userData)
    localStorage.setItem("planningPokerUser", JSON.stringify(userData))
  }

  const handleRoomJoined = (newRoomId: string) => {
    setRoomId(newRoomId)
    localStorage.setItem("planningPokerRoomId", newRoomId)
  }

  const handleLeaveRoom = async () => {
    if (user && roomId) {
      try {
        await leaveRoom(roomId, user)
      } catch (error) {
        console.error("Failed to leave room:", error)
      }
    }

    setRoomId(null)
    setRoom(null)
    localStorage.removeItem("planningPokerRoomId")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center bg-brand-light">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto"></div>
            <p className="mt-2 text-brand-medium">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return <AuthForm onAuth={handleAuth} />
  }

  if (!roomId || !room) {
    return <RoomSelector user={user} onRoomJoined={handleRoomJoined} />
  }

  const currentUserVote = room.currentTask?.votes.find((v) => v.userId === user.id)

  return (
    <div className="min-h-screen bg-brand-light p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <RoomHeader room={room} user={user} onLeave={handleLeaveRoom} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TaskManagement roomId={roomId} user={user} currentTask={room.currentTask} />

            <VotingInterface
              roomId={roomId}
              user={user}
              currentVote={currentUserVote?.value}
              disabled={!room.currentTask || room.currentTask.revealed}
            />
          </div>

          <div className="space-y-6">
            <VotesDisplay currentTask={room.currentTask} participants={room.participants} />
            <ParticipantsList participants={room.participants} adminId={room.adminId} />
            <Reports room={room} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
