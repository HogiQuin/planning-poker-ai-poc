"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/lib/types"
import { Users, Crown, UserIcon, Eye } from "lucide-react"

interface ParticipantsListProps {
  participants: User[]
  adminId: string
}

export function ParticipantsList({ participants, adminId }: ParticipantsListProps) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="w-4 h-4" />
      case "observer":
        return <Eye className="w-4 h-4" />
      default:
        return <UserIcon className="w-4 h-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-yellow-100 text-yellow-800"
      case "observer":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Participants ({participants.length})
        </CardTitle>
        <CardDescription>Room members and their roles</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {participants.map((participant) => (
            <div key={participant.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                {getRoleIcon(participant.role)}
                <span className="font-medium">{participant.name}</span>
                {participant.id === adminId && (
                  <Badge variant="secondary" className="text-xs">
                    Room Owner
                  </Badge>
                )}
              </div>
              <Badge className={`text-xs ${getRoleColor(participant.role)}`}>{participant.role}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
