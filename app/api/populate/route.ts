import { NextResponse } from "next/server"
import { ensureSheetsSetup, addStudent, createTeam } from "@/lib/google-sheets"
import type { Student, Team } from "@/types"
import { randomUUID } from "crypto"
import bcrypt from "bcryptjs"

const dummyStudents: Omit<Student, "id" | "passwordHash" | "createdAt">[] = [
  {
    name: "Alice Johnson",
    regNo: "CSE001",
    dept: "CSE",
    email: "alice@example.com",
    experienceLevel: "Advanced",
    github: "https://github.com/alice",
    role: "student",
  },
  {
    name: "Bob Smith",
    regNo: "ECE002",
    dept: "ECE",
    email: "bob@example.com",
    experienceLevel: "Intermediate",
    github: "https://github.com/bob",
    role: "student",
  },
  {
    name: "Charlie Brown",
    regNo: "MECH003",
    dept: "MECH",
    email: "charlie@example.com",
    experienceLevel: "Beginner",
    github: "https://github.com/charlie",
    role: "student",
  },
  {
    name: "Diana Prince",
    regNo: "EEE004",
    dept: "EEE",
    email: "diana@example.com",
    experienceLevel: "Advanced",
    github: "https://github.com/diana",
    role: "student",
  },
  {
    name: "Eve Wilson",
    regNo: "CSE005",
    dept: "CSE",
    email: "eve@example.com",
    experienceLevel: "Intermediate",
    github: "https://github.com/eve",
    role: "student",
  },
]

const dummyTeams: Omit<Team, "id" | "createdAt">[] = [
  {
    name: "Web Warriors",
    leaderId: "", // will set after creating students
    memberIds: [],
    vacancies: 2,
  },
  {
    name: "AI Explorers",
    leaderId: "",
    memberIds: [],
    vacancies: 3,
  },
]

export async function POST() {
  try {
    await ensureSheetsSetup()

    // Add students
    const createdStudents: Student[] = []
    for (const s of dummyStudents) {
      const passwordHash = await bcrypt.hash("password123", 10)
      const student: Student = {
        ...s,
        id: randomUUID(),
        passwordHash,
        createdAt: new Date().toISOString(),
      }
      await addStudent(student)
      createdStudents.push(student)
    }

    // Add teams
    const createdTeams: Team[] = []
    for (let i = 0; i < dummyTeams.length; i++) {
      const teamData = dummyTeams[i]
      const leader = createdStudents[i % createdStudents.length]
      const team: Team = {
        ...teamData,
        id: randomUUID(),
        leaderId: leader.id,
        memberIds: [],
        createdAt: new Date().toISOString(),
      }
      await createTeam(team)
      createdTeams.push(team)
    }

    return NextResponse.json({
      message: "Dummy data populated successfully",
      students: createdStudents.map(s => ({ name: s.name, email: s.email })),
      teams: createdTeams.map(t => ({ name: t.name, leader: createdStudents.find(s => s.id === t.leaderId)?.name })),
    })
  } catch (e: any) {
    console.error("[populate] error", e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}