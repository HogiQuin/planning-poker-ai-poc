"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type { User, Task } from "@/lib/types"
import { revealVotes, saveTask, setTaskTitleDB } from "@/lib/firebase-utils"
import { Eye, Save, Plus } from "lucide-react"

interface TaskManagementProps {
  roomId: string
  user: User
  currentTask?: Task
}

export function TaskManagement({ roomId, user, currentTask }: TaskManagementProps) {
  const [taskTitle, setTaskTitle] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSetTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskTitle.trim()) return

    setLoading(true)
    try {
      await setTaskTitleDB(roomId, taskTitle.trim())
      setTaskTitle("")
    } catch (error) {
      console.error("Failed to set task:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRevealVotes = async () => {
    setLoading(true)
    try {
      await revealVotes(roomId)
    } catch (error) {
      console.error("Failed to reveal votes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTask = async () => {
    setLoading(true)
    try {
      await saveTask(roomId)
    } catch (error) {
      console.error("Failed to save task:", error)
    } finally {
      setLoading(false)
    }
  }

  if (user.role !== "admin") {
    return (
      <Card className="border-brand-border shadow-sm">
        <CardHeader className="bg-white">
          <CardTitle className="text-brand-dark">Current Task</CardTitle>
        </CardHeader>
        <CardContent className="bg-white">
          {currentTask ? (
            <div className="space-y-2">
              <p className="text-lg font-medium text-brand-dark">{currentTask.title}</p>
              {currentTask.revealed && currentTask.average !== undefined && (
                <p className="text-sm text-brand-success font-medium">Average: {currentTask.average}</p>
              )}
            </div>
          ) : (
            <p className="text-brand-medium">No active task</p>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-brand-border shadow-sm">
      <CardHeader className="bg-white">
        <CardTitle className="text-brand-dark">Task Management</CardTitle>
        <CardDescription className="text-brand-medium">Set task title and manage voting</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 bg-white">
        <form onSubmit={handleSetTask} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="taskTitle" className="text-brand-dark font-medium">
              Task Title (e.g., FDAXX-1234-Task title)
            </Label>
            <Input
              id="taskTitle"
              type="text"
              placeholder="Enter task title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="bg-brand-input border-brand-border focus:border-brand-primary focus:ring-brand-primary"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary hover:bg-brand-secondary text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Set New Task
          </Button>
        </form>

        {currentTask && (
          <div className="space-y-4 pt-4 border-t border-brand-border">
            <div>
              <h4 className="font-medium text-brand-dark">Current Task:</h4>
              <p className="text-sm text-brand-medium">{currentTask.title}</p>
              <p className="text-xs text-brand-medium">Votes: {currentTask.votes.length}</p>
              {currentTask.revealed && currentTask.average !== undefined && (
                <p className="text-sm font-medium text-brand-success">Average: {currentTask.average}</p>
              )}
            </div>

            <div className="flex gap-2">
              {!currentTask.revealed && (
                <Button
                  onClick={handleRevealVotes}
                  disabled={loading || currentTask.votes.length === 0}
                  variant="outline"
                  className="border-brand-border text-brand-primary hover:bg-blue-50 bg-transparent"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Reveal Votes
                </Button>
              )}

              {currentTask.revealed && (
                <Button
                  onClick={handleSaveTask}
                  disabled={loading}
                  className="bg-brand-success hover:bg-green-600 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Task
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
