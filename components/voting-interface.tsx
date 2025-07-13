"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type User, type Vote, VOTE_OPTIONS } from "@/lib/types"
import { submitVote } from "@/lib/firebase-utils"
import { Check } from "lucide-react"

interface VotingInterfaceProps {
  roomId: string
  user: User
  currentVote?: string
  disabled?: boolean
}

export function VotingInterface({ roomId, user, currentVote, disabled }: VotingInterfaceProps) {
  const [selectedVote, setSelectedVote] = useState<string>(currentVote || "")
  const [loading, setLoading] = useState(false)

  const handleVoteSubmit = async (value: string) => {
    if (user.role === "observer" || user.role === "admin") return

    setLoading(true)
    try {
      const vote: Vote = {
        userId: user.id,
        userName: user.name,
        value,
        timestamp: Date.now(),
      }

      await submitVote(roomId, vote)
      setSelectedVote(value)
    } catch (error) {
      console.error("Failed to submit vote:", error)
    } finally {
      setLoading(false)
    }
  }

  if (user.role === "observer" || user.role === "admin") {
    return (
      <Card className="border-brand-border shadow-sm">
        <CardHeader className="bg-white">
          <CardTitle className="text-brand-dark">Voting</CardTitle>
          <CardDescription className="text-brand-medium">
            {user.role === "admin" ? "You are the admin - you cannot vote" : "You are an observer - you cannot vote"}
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-white">
          <div className="grid grid-cols-6 gap-2">
            {VOTE_OPTIONS.map((option) => (
              <Button
                key={option}
                variant="outline"
                className="h-12 text-lg font-semibold bg-brand-input border-brand-border text-brand-medium cursor-not-allowed"
                disabled
              >
                {option}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-brand-border shadow-sm">
      <CardHeader className="bg-white">
        <CardTitle className="text-brand-dark">Cast Your Vote</CardTitle>
        <CardDescription className="text-brand-medium">Select your estimate for the current task</CardDescription>
      </CardHeader>
      <CardContent className="bg-white">
        <div className="grid grid-cols-6 gap-2">
          {VOTE_OPTIONS.map((option) => (
            <Button
              key={option}
              variant={selectedVote === option ? "default" : "outline"}
              className={`h-12 text-lg font-semibold relative transition-all duration-200 ${
                selectedVote === option
                  ? "bg-brand-primary hover:bg-brand-secondary text-white shadow-md"
                  : "bg-white border-brand-border text-brand-dark hover:bg-blue-50 hover:border-brand-primary"
              }`}
              onClick={() => handleVoteSubmit(option)}
              disabled={loading || disabled}
            >
              {option}
              {selectedVote === option && <Check className="w-4 h-4 absolute top-1 right-1" />}
            </Button>
          ))}
        </div>

        {selectedVote && (
          <div className="mt-4 text-center">
            <Badge variant="secondary" className="text-sm bg-blue-50 text-brand-primary border border-brand-primary">
              Your vote: {selectedVote}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
