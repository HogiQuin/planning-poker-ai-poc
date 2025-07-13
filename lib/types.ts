export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user" | "observer"
}

export interface Vote {
  userId: string
  userName: string
  value: string
  timestamp: number
}

export interface Task {
  id: string
  title: string
  votes: Vote[]
  revealed: boolean
  average?: number
  createdAt: number
}

export interface Room {
  id: string
  name: string
  adminId: string
  adminName: string
  participants: User[]
  currentTask?: Task
  tasks: Task[]
  createdAt: number
}

export const VOTE_OPTIONS = ["0", "1", "2", "3", "5", "8", "13", "21", "34", "55", "89", "?"]
