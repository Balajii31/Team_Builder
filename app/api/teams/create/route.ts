import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createTeam, listTeams, listStudents, ensureSheetsSetup } from "@/lib/google-sheets"
import type { Team } from "@/types"
import { randomUUID } from "crypto"

export async function POST(req: Request) {
  try {
    await ensureSheetsSetup()
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const user = session.user as any
    if (user.role !== "student") return NextResponse.json({ error: "Only students can create teams" }, { status: 403 })

    const contentType = req.headers.get("content-type") || ""
    let name: string | undefined
    let vacanciesRaw: any

    let memberEmails: string[] = []

    if (contentType.includes("application/json")) {
      const data = await req.json()
      name = data?.name
      vacanciesRaw = data?.vacancies
      memberEmails = data?.memberEmails || []
    } else {
      const form = await req.formData()
      name = (form.get("name") as string) || undefined
      vacanciesRaw = form.get("vacancies")
      // Collect member emails from form
      for (let i = 1; i <= 5; i++) {
        const email = form.get(`member${i}`) as string
        if (email) memberEmails.push(email)
      }
    }

    if (!name) return NextResponse.json({ error: "Team name required" }, { status: 400 })

    // Prevent creating multiple teams as leader
    const teams = await listTeams()
    const alreadyLeader = teams.some((t) => t.leaderId === user.id)
    if (alreadyLeader) return NextResponse.json({ error: "You have already created a team" }, { status: 400 })

    // Find member IDs from emails and validate they exist
    const students = await listStudents()
    const memberIds: string[] = []
    const invalidEmails: string[] = []

    for (const email of memberEmails) {
      if (!email.trim()) continue // Skip empty emails
      const student = students.find(s => s.email.toLowerCase() === email.toLowerCase())
      if (student) {
        // Check if student is already in another team
        const existingTeams = await listTeams()
        const alreadyInTeam = existingTeams.some(t =>
          t.leaderId === student.id || t.memberIds.includes(student.id)
        )
        if (alreadyInTeam) {
          return NextResponse.json({
            error: `Student ${email} is already part of another team`
          }, { status: 400 })
        }
        memberIds.push(student.id)
      } else {
        invalidEmails.push(email)
      }
    }

    if (invalidEmails.length > 0) {
      return NextResponse.json({
        error: `The following emails are not registered students: ${invalidEmails.join(', ')}`
      }, { status: 400 })
    }

    const totalMembers = memberIds.length
    // Team capacity: leader + 5 members = 6 total, so vacancies = 5 - members_added
    const v = Math.max(0, 5 - totalMembers)
    const team: Team = {
      id: randomUUID(),
      name,
      leaderId: user.id,
      memberIds,
      vacancies: v,
      createdAt: new Date().toISOString(),
    }

    await createTeam(team)
    return NextResponse.json({ ok: true, teamId: team.id })
  } catch (e) {
    console.error("[teams/create]", e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
