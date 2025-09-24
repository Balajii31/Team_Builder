import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { findStudentById, updateStudent, ensureSheetsSetup } from "@/lib/google-sheets"
import type { Student } from "@/types"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await ensureSheetsSetup()
    const student = await findStudentById((session.user as any).id)
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Don't send password hash
    const { passwordHash, ...profile } = student
    return NextResponse.json(profile)
  } catch (e: any) {
    console.error("[profile GET] error", e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await ensureSheetsSetup()
    const body = await req.json()
    const { name, regNo, dept, experienceLevel, github } = body

    const existing = await findStudentById((session.user as any).id)
    if (!existing) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    const updated: Student = {
      ...existing,
      name: name || existing.name,
      regNo: regNo || existing.regNo,
      dept: dept || existing.dept,
      experienceLevel: experienceLevel || existing.experienceLevel,
      github: github || existing.github,
    }

    await updateStudent(updated)
    const { passwordHash, ...profile } = updated
    return NextResponse.json(profile)
  } catch (e: any) {
    console.error("[profile PUT] error", e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}