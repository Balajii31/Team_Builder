import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createJoinRequest, getTeamById, ensureSheetsSetup } from "@/lib/google-sheets"
import type { JoinRequest } from "@/types"
import { randomUUID } from "crypto"

export async function POST(req: Request) {
  try {
    await ensureSheetsSetup()
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const user = session.user as any
    if (user.role !== "student")
      return NextResponse.json({ error: "Only students can request to join" }, { status: 403 })

    const { teamId, message } = await req.json()
    if (!teamId) return NextResponse.json({ error: "teamId required" }, { status: 400 })

    const team = await getTeamById(teamId)
    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 })
    if (team.vacancies <= 0) return NextResponse.json({ error: "No vacancies available" }, { status: 400 })

    const reqObj: JoinRequest = {
      id: randomUUID(),
      teamId,
      studentId: user.id,
      message: message || "",
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    await createJoinRequest(reqObj)
    return NextResponse.json({ ok: true, requestId: reqObj.id })
  } catch (e) {
    console.error("[teams/request-join]", e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
