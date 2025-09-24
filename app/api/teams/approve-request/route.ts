import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getTeamById, updateJoinRequestStatus, updateTeam, listJoinRequests, ensureSheetsSetup } from "@/lib/google-sheets"
import type { JoinRequestStatus } from "@/types"

export async function POST(req: Request) {
  try {
    await ensureSheetsSetup()
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const user = session.user as any
    if (user.role !== "student") return NextResponse.json({ error: "Only students can approve requests" }, { status: 403 })

    const { requestId, action } = await req.json() // action: "approve" or "deny"
    if (!requestId || !action) return NextResponse.json({ error: "requestId and action required" }, { status: 400 })
    if (!["approve", "deny"].includes(action)) return NextResponse.json({ error: "Invalid action" }, { status: 400 })

    const requests = await listJoinRequests()
    const request = requests.find(r => r.id === requestId)
    if (!request) return NextResponse.json({ error: "Join request not found" }, { status: 404 })

    const team = await getTeamById(request.teamId)
    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 })
    if (team.leaderId !== user.id) return NextResponse.json({ error: "Only team leader can approve requests" }, { status: 403 })

    if (request.status !== "pending") return NextResponse.json({ error: "Request already processed" }, { status: 400 })

    const newStatus: JoinRequestStatus = action === "approve" ? "approved" : "denied"
    await updateJoinRequestStatus(requestId, newStatus)

    if (action === "approve") {
      // Add member and update vacancies
      if (team.vacancies <= 0) return NextResponse.json({ error: "No vacancies available" }, { status: 400 })
      team.memberIds.push(request.studentId)
      team.vacancies -= 1
      await updateTeam(team)
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("[teams/approve-request]", e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}