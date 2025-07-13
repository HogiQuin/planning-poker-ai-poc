"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Task, User } from "@/lib/types"
import { Users, Eye, EyeOff } from "lucide-react"

interface VotesDisplayProps {
  currentTask?: Task
  participants: User[]
}

export function VotesDisplay({ currentTask, participants }: VotesDisplayProps) {
  if (!currentTask) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Votes</CardTitle>
          <CardDescription>No active task</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Waiting for admin to set a task...</p>
        </CardContent>
      </Card>
    )
  }

  const voters = participants.filter((p) => p.role === "user")
  const votedUserIds = currentTask.votes.map((v) => v.userId)
  const pendingVoters = voters.filter((v) => !votedUserIds.includes(v.id))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Votes ({currentTask.votes.length}/{voters.length})
          {currentTask.revealed ? (
            <Eye className="w-4 h-4 text-green-600" />
          ) : (
            <EyeOff className="w-4 h-4 text-gray-400" />
          )}
        </CardTitle>
        <CardDescription>{currentTask.revealed ? "Votes revealed" : "Voting in progress"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentTask.revealed ? (
          <div className="space-y-3">
            <div className="grid gap-2">
              {currentTask.votes.map((vote) => (
                <div key={vote.userId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">{vote.userName}</span>
                  <Badge variant="secondary" className="text-lg font-bold">
                    {vote.value}
                  </Badge>
                </div>
              ))}
            </div>

            {currentTask.average !== undefined && (
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Average:</span>
                  <Badge variant="default" className="text-lg font-bold">
                    {currentTask.average}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-green-600">Voted ({currentTask.votes.length})</h4>
              {currentTask.votes.map((vote) => (
                <div key={vote.userId} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">{vote.userName}</span>
                </div>
              ))}
            </div>

            {pendingVoters.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-orange-600">Pending ({pendingVoters.length})</h4>
                {pendingVoters.map((voter) => (
                  <div key={voter.id} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">{voter.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
