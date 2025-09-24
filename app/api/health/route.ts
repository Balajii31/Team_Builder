import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { ensureSheetsSetup } from "@/lib/google-sheets"

export async function GET() {
  // Public summary by default; detailed status for admin only
  let details: any = null
  let ok = true

  // quick env presence checks (do not reveal secrets)
  const envStatus = {
    GOOGLE_SHEETS_ID: !!process.env.GOOGLE_SHEETS_ID,
    GOOGLE_SERVICE_ACCOUNT: !!process.env.GOOGLE_SERVICE_ACCOUNT,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
  }

  // check Sheets connectivity
  let sheetsReachable = false
  try {
    // ensureSheetsSetup also verifies auth and creates missing sheets if needed
    await ensureSheetsSetup()
    sheetsReachable = true
  } catch (e) {
    ok = false
    sheetsReachable = false
    console.error("[health] sheets check failed", e)
  }

  // If admin, provide detailed view
  const session = await auth()
  const isAdmin = (session?.user as any)?.role === "admin"
  if (isAdmin) {
    details = {
      env: envStatus,
      googleSheets: { reachable: sheetsReachable },
    }
  }

  return NextResponse.json({
    ok: ok && envStatus.GOOGLE_SHEETS_ID && envStatus.GOOGLE_SERVICE_ACCOUNT && envStatus.NEXTAUTH_SECRET,
    details: details ?? undefined,
  })
}
