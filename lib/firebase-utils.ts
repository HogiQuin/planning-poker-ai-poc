import { collection, doc, addDoc, updateDoc, getDoc, onSnapshot, arrayUnion, arrayRemove } from "firebase/firestore"
import { db } from "./firebase"
import type { Room, User, Task, Vote } from "./types"

export const createRoom = async (roomName: string, adminUser: User): Promise<string> => {
  const roomData: Omit<Room, "id"> = {
    name: roomName,
    adminId: adminUser.id,
    adminName: adminUser.name,
    participants: [adminUser],
    tasks: [],
    createdAt: Date.now(),
  }

  const docRef = await addDoc(collection(db, "rooms"), roomData)
  return docRef.id
}

export const joinRoom = async (roomId: string, user: User): Promise<void> => {
  const roomRef = doc(db, "rooms", roomId)
  await updateDoc(roomRef, {
    participants: arrayUnion(user),
  })
}

export const leaveRoom = async (roomId: string, user: User): Promise<void> => {
  const roomRef = doc(db, "rooms", roomId)
  await updateDoc(roomRef, {
    participants: arrayRemove(user),
  })
}

export const setTaskTitleDB = async (roomId: string, title: string): Promise<void> => {
  const roomRef = doc(db, "rooms", roomId)
  const taskId = Date.now().toString()

  const newTask: Task = {
    id: taskId,
    title,
    votes: [],
    revealed: false,
    createdAt: Date.now(),
  }

  await updateDoc(roomRef, {
    currentTask: newTask,
  })
}

export const submitVote = async (roomId: string, vote: Vote): Promise<void> => {
  const roomRef = doc(db, "rooms", roomId)
  const roomDoc = await getDoc(roomRef)

  if (roomDoc.exists()) {
    const roomData = roomDoc.data() as Room
    const currentTask = roomData.currentTask

    if (currentTask) {
      const existingVoteIndex = currentTask.votes.findIndex((v) => v.userId === vote.userId)
      const updatedVotes = [...currentTask.votes]

      if (existingVoteIndex >= 0) {
        updatedVotes[existingVoteIndex] = vote
      } else {
        updatedVotes.push(vote)
      }

      const updatedTask = {
        ...currentTask,
        votes: updatedVotes,
      }

      await updateDoc(roomRef, {
        currentTask: updatedTask,
      })
    }
  }
}

export const revealVotes = async (roomId: string): Promise<void> => {
  const roomRef = doc(db, "rooms", roomId)
  const roomDoc = await getDoc(roomRef)

  if (roomDoc.exists()) {
    const roomData = roomDoc.data() as Room
    const currentTask = roomData.currentTask

    if (currentTask) {
      const numericVotes = currentTask.votes
        .map((v) => v.value)
        .filter((v) => v !== "?" && !isNaN(Number(v)))
        .map(Number)

      const average = numericVotes.length > 0 ? numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length : 0

      const updatedTask = {
        ...currentTask,
        revealed: true,
        average: Math.round(average * 10) / 10,
      }

      await updateDoc(roomRef, {
        currentTask: updatedTask,
      })
    }
  }
}

export const saveTask = async (roomId: string): Promise<void> => {
  const roomRef = doc(db, "rooms", roomId)
  const roomDoc = await getDoc(roomRef)

  if (roomDoc.exists()) {
    const roomData = roomDoc.data() as Room
    const currentTask = roomData.currentTask

    if (currentTask) {
      const updatedTasks = [...roomData.tasks, currentTask]

      await updateDoc(roomRef, {
        tasks: updatedTasks,
        currentTask: null,
      })
    }
  }
}

export const subscribeToRoom = (roomId: string, callback: (room: Room | null) => void) => {
  const roomRef = doc(db, "rooms", roomId)

  return onSnapshot(roomRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() } as Room)
    } else {
      callback(null)
    }
  })
}
