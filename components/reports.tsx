"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Room } from "@/lib/types"
import { FileText, Download } from "lucide-react"
import jsPDF from "jspdf"

interface ReportsProps {
  room: Room
}

export function Reports({ room }: ReportsProps) {
  const [loading, setLoading] = useState(false)

  const generateHTMLReport = () => {
    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Planning Poker Report - ${room.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
          .container { background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { border-bottom: 3px solid #e31e24; padding-bottom: 15px; margin-bottom: 25px; }
          .header h1 { color: #e31e24; margin: 0; font-size: 28px; }
          .task { margin-bottom: 20px; padding: 15px; border: 1px solid #cccccc; border-radius: 5px; background-color: #ffffff; }
          .votes { display: flex; gap: 10px; flex-wrap: wrap; margin: 10px 0; }
          .vote { padding: 5px 10px; background: #e6e6e6; border-radius: 3px; color: #333333; }
          .average { font-weight: bold; color: #e31e24; }
          .footer { margin-top: 40px; text-align: center; color: #666666; border-top: 1px solid #cccccc; padding-top: 20px; }
          .text-primary { color: #333333; }
          .text-secondary { color: #666666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Planning Poker Report</h1>
            <p class="text-primary"><strong>Room:</strong> ${room.name}</p>
            <p class="text-secondary"><strong>Admin:</strong> ${room.adminName}</p>
            <p class="text-secondary"><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <h2 class="text-primary">Completed Tasks (${room.tasks.length})</h2>
          ${room.tasks
            .map(
              (task) => `
            <div class="task">
              <h3 class="text-primary">${task.title}</h3>
              <p class="text-primary"><strong>Votes:</strong></p>
              <div class="votes">
                ${task.votes
                  .map(
                    (vote) => `
                  <div class="vote">${vote.userName}: ${vote.value}</div>
                `,
                  )
                  .join("")}
              </div>
              ${task.average !== undefined ? `<p class="average">Average: ${task.average}</p>` : ""}
              <p class="text-secondary"><small>Completed: ${new Date(task.createdAt).toLocaleString()}</small></p>
            </div>
          `,
            )
            .join("")}
          
          ${
            room.currentTask
              ? `
            <h2 class="text-primary">Current Task</h2>
            <div class="task">
              <h3 class="text-primary">${room.currentTask.title}</h3>
              <p class="text-primary"><strong>Status:</strong> ${room.currentTask.revealed ? "Revealed" : "In Progress"}</p>
              ${
                room.currentTask.revealed
                  ? `
                <div class="votes">
                  ${room.currentTask.votes
                    .map(
                      (vote) => `
                    <div class="vote">${vote.userName}: ${vote.value}</div>
                  `,
                    )
                    .join("")}
                </div>
                ${room.currentTask.average !== undefined ? `<p class="average">Average: ${room.currentTask.average}</p>` : ""}
              `
                  : `<p class="text-secondary">Votes: ${room.currentTask.votes.length}</p>`
              }
            </div>
          `
              : ""
          }
          
          <div class="footer">
            <p>Made with ❤️ by <strong>Alebrijes</strong></p>
          </div>
        </div>
      </body>
    </html>
  `

    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `planning-poker-report-${room.name}-${Date.now()}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateMarkdownReport = () => {
    const markdownContent = `# Planning Poker Report

## Session Information
- **Room:** ${room.name}
- **Admin:** ${room.adminName}
- **Generated:** ${new Date().toLocaleString()}
- **Participants:** ${room.participants.length}

## Participants
${room.participants.map((p) => `- **${p.name}** (${p.role})`).join("\n")}

## Completed Tasks (${room.tasks.length})

${room.tasks
  .map(
    (task, index) => `### ${index + 1}. ${task.title}

**Votes:**
${task.votes.map((vote) => `- ${vote.userName}: **${vote.value}**`).join("\n")}

${task.average !== undefined ? `**Average:** ${task.average}` : ""}

*Completed: ${new Date(task.createdAt).toLocaleString()}*

---
`,
  )
  .join("\n")}

${
  room.currentTask
    ? `## Current Task

### ${room.currentTask.title}

**Status:** ${room.currentTask.revealed ? "Revealed" : "In Progress"}

${
  room.currentTask.revealed
    ? `**Votes:**
${room.currentTask.votes.map((vote) => `- ${vote.userName}: **${vote.value}**`).join("\n")}

${room.currentTask.average !== undefined ? `**Average:** ${room.currentTask.average}` : ""}`
    : `**Votes:** ${room.currentTask.votes.length}`
}`
    : ""
}

---

*Made with ❤️ by **Alebrijes***
`

    const blob = new Blob([markdownContent], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `planning-poker-report-${room.name}-${Date.now()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generatePDFReport = async () => {
    setLoading(true)
    try {
      const pdf = new jsPDF()
      const pageWidth = pdf.internal.pageSize.getWidth()
      const margin = 20
      let yPosition = margin

      // Helper function to add text with word wrapping
      const addText = (text: string, fontSize = 12, isBold = false) => {
        pdf.setFontSize(fontSize)
        if (isBold) {
          pdf.setFont(undefined, "bold")
        } else {
          pdf.setFont(undefined, "normal")
        }

        const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin)
        pdf.text(lines, margin, yPosition)
        yPosition += lines.length * (fontSize * 0.4) + 5

        // Check if we need a new page
        if (yPosition > pdf.internal.pageSize.getHeight() - margin) {
          pdf.addPage()
          yPosition = margin
        }
      }

      // Header
      addText("PLANNING POKER REPORT", 20, true)
      yPosition += 10

      addText(`Room: ${room.name}`, 14, true)
      addText(`Admin: ${room.adminName}`, 12)
      addText(`Generated: ${new Date().toLocaleString()}`, 12)
      addText(`Participants: ${room.participants.length}`, 12)
      yPosition += 10

      // Completed Tasks
      addText(`COMPLETED TASKS (${room.tasks.length})`, 16, true)
      yPosition += 5

      room.tasks.forEach((task, index) => {
        addText(`${index + 1}. ${task.title}`, 14, true)

        const votes = task.votes.map((v) => `${v.userName}: ${v.value}`).join(", ")
        addText(`Votes: ${votes}`, 11)

        if (task.average !== undefined) {
          addText(`Average: ${task.average}`, 11, true)
        }

        addText(`Completed: ${new Date(task.createdAt).toLocaleString()}`, 10)
        yPosition += 5
      })

      // Current Task
      if (room.currentTask) {
        yPosition += 10
        addText("CURRENT TASK", 16, true)
        addText(`Task: ${room.currentTask.title}`, 14, true)
        addText(`Status: ${room.currentTask.revealed ? "Revealed" : "In Progress"}`, 12)

        if (room.currentTask.revealed) {
          const votes = room.currentTask.votes.map((v) => `${v.userName}: ${v.value}`).join(", ")
          addText(`Votes: ${votes}`, 11)

          if (room.currentTask.average !== undefined) {
            addText(`Average: ${room.currentTask.average}`, 11, true)
          }
        } else {
          addText(`Votes: ${room.currentTask.votes.length}`, 11)
        }
      }

      // Footer
      yPosition += 20
      addText("Made with ❤️ by Alebrijes", 10, false)

      pdf.save(`planning-poker-report-${room.name}-${Date.now()}.pdf`)
    } catch (error) {
      console.error("Failed to generate PDF:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-thermo-borderGray shadow-sm">
      <CardHeader className="bg-white">
        <CardTitle className="flex items-center gap-2 text-thermo-darkGray">
          <FileText className="w-5 h-5" />
          Reports
        </CardTitle>
        <CardDescription className="text-thermo-mediumGray">Generate and download session reports</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 bg-white">
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={generateHTMLReport}
            variant="outline"
            className="w-full bg-white border-thermo-borderGray text-thermo-darkGray hover:bg-thermo-inputGray"
          >
            <Download className="w-4 h-4 mr-2" />
            HTML Report
          </Button>
          <Button
            onClick={generateMarkdownReport}
            variant="outline"
            className="w-full bg-white border-thermo-borderGray text-thermo-darkGray hover:bg-thermo-inputGray"
          >
            <Download className="w-4 h-4 mr-2" />
            Markdown Report
          </Button>
          <Button
            onClick={generatePDFReport}
            disabled={loading}
            variant="outline"
            className="w-full bg-white border-thermo-borderGray text-thermo-darkGray hover:bg-thermo-inputGray"
          >
            <Download className="w-4 h-4 mr-2" />
            PDF Report
          </Button>
          <Button
            onClick={() => {
              const textContent = `PLANNING POKER REPORT\n=====================\n\nRoom: ${room.name}\nAdmin: ${room.adminName}\nGenerated: ${new Date().toLocaleString()}\n\nCOMPLETED TASKS (${room.tasks.length})\n${room.tasks.map((task) => `\nTask: ${task.title}\nVotes: ${task.votes.map((v) => `${v.userName}: ${v.value}`).join(", ")}\n${task.average !== undefined ? `Average: ${task.average}` : ""}\nCompleted: ${new Date(task.createdAt).toLocaleString()}\n---`).join("")}\n\n${room.currentTask ? `CURRENT TASK\nTask: ${room.currentTask.title}\nStatus: ${room.currentTask.revealed ? "Revealed" : "In Progress"}\n${room.currentTask.revealed ? `Votes: ${room.currentTask.votes.map((v) => `${v.userName}: ${v.value}`).join(", ")}\n${room.currentTask.average !== undefined ? `Average: ${room.currentTask.average}` : ""}` : `Votes: ${room.currentTask.votes.length}`}` : ""}\n\nMade with ❤️ by Alebrijes`
              const blob = new Blob([textContent], { type: "text/plain" })
              const url = URL.createObjectURL(blob)
              const a = document.createElement("a")
              a.href = url
              a.download = `planning-poker-report-${room.name}-${Date.now()}.txt`
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              URL.revokeObjectURL(url)
            }}
            variant="outline"
            className="w-full bg-white border-thermo-borderGray text-thermo-darkGray hover:bg-thermo-inputGray"
          >
            <Download className="w-4 h-4 mr-2" />
            Text Report
          </Button>
        </div>

        <div className="pt-4 border-t border-thermo-borderGray">
          <h4 className="font-medium mb-2 text-thermo-darkGray">Session Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-thermo-mediumGray">Completed Tasks:</span>
              <Badge variant="secondary" className="ml-2 bg-thermo-inputGray text-thermo-darkGray">
                {room.tasks.length}
              </Badge>
            </div>
            <div>
              <span className="text-thermo-mediumGray">Participants:</span>
              <Badge variant="secondary" className="ml-2 bg-thermo-inputGray text-thermo-darkGray">
                {room.participants.length}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
