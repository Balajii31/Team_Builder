import { NextResponse } from "next/server"
import { listTeams } from "@/lib/google-sheets"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await auth()
    const teams = await listTeams()
    if ((session?.user as any)?.role === "admin") {
      return NextResponse.json({ teams })
    }
    // public shape: name, id, vacancies only
    return NextResponse.json({ teams: teams.map((t) => ({ id: t.id, name: t.name, vacancies: t.vacancies })) })
  } catch (e) {
    console.error("[teams/list]", e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
