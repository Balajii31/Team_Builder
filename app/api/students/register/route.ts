import { NextResponse } from "next/server"
import { addStudent, findStudentByEmail, ensureSheetsSetup } from "@/lib/google-sheets"
import type { Student } from "@/types"
import { randomUUID } from "crypto"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    await ensureSheetsSetup()
    const body = await req.json()
    const { name, regNo, dept, email, password, experienceLevel, github, role } = body || {}
    if (!name || !regNo || !dept || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const existing = await findStudentByEmail(email)
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const student: Student = {
      id: randomUUID(),
      name,
      regNo,
      dept,
      email,
      passwordHash,
      experienceLevel: experienceLevel || "",
      github: github || "",
      role: role || "member",
      createdAt: new Date().toISOString(),
    }

    await addStudent(student)
    return NextResponse.json({ ok: true, studentId: student.id })
  } catch (e: any) {
    console.error("[register] error", e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
