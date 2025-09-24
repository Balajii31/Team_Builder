import { auth } from "@/lib/auth"
import { listTeams, listStudents, listJoinRequests } from "@/lib/google-sheets"
import Link from "next/link"
import { ApproveButton } from "@/components/approve-button"

async function StudentDashboard({ userId, userRole }: { userId: string, userRole: string }) {
  const teams = await listTeams()
  const joinRequests = await listJoinRequests()
  const myTeam = teams.find((t) => t.leaderId === userId || t.memberIds.includes(userId))
  const myPendingRequests = myTeam ? joinRequests.filter(r => r.teamId === myTeam.id && r.status === "pending") : []

  return (
    <div className="space-y-8">
      {/* Team Status Card */}
      <div className="rounded-xl border bg-card p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold">Team Status</h2>
        </div>

        {!myTeam ? (
          <div className="space-y-6">
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <p className="text-muted-foreground mb-4">You haven't joined a team yet</p>
              {userRole === "leader" && <CreateTeamForm />}
              {userRole !== "leader" && (
                <p className="text-sm text-muted-foreground">
                  Contact your team leader or explore available teams below.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Team Name</p>
              <p className="text-lg font-semibold">{myTeam.name}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Available Spots</p>
              <p className="text-lg font-semibold">{myTeam.vacancies}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Your Role</p>
              <p className="text-lg font-semibold">{myTeam.leaderId === userId ? "Team Leader" : "Member"}</p>
            </div>
          </div>
        )}
      </div>

      {/* Pending Requests */}
      {myTeam && myTeam.leaderId === userId && myPendingRequests.length > 0 && (
        <div className="rounded-xl border bg-card p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Pending Requests</h2>
            <span className="bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 text-xs font-medium px-2 py-1 rounded-full">
              {myPendingRequests.length}
            </span>
          </div>

          <div className="space-y-4">
            {myPendingRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                <div className="space-y-1">
                  <p className="font-medium">Student ID: {req.studentId}</p>
                  {req.message && <p className="text-sm text-muted-foreground">"{req.message}"</p>}
                </div>
                <div className="flex gap-3">
                  <ApproveButton requestId={req.id} action="approve" />
                  <ApproveButton requestId={req.id} action="deny" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="rounded-xl border bg-card p-8 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/registered-teams"
            className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent transition-colors"
          >
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div>
              <p className="font-medium">Browse Teams</p>
              <p className="text-sm text-muted-foreground">Find teams with available spots</p>
            </div>
          </Link>

          {!myTeam && userRole === "leader" && (
            <div className="flex items-center gap-3 p-4 rounded-lg border bg-primary/5 border-primary/20">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <div>
                <p className="font-medium">Create Team</p>
                <p className="text-sm text-muted-foreground">Start your own team</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

async function AdminDashboard() {
  const [teams, students] = await Promise.all([listTeams(), listStudents()])
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <section className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">All Teams</h2>
        <ul className="space-y-3">
          {teams.map((t) => (
            <li key={t.id} className="rounded-md border p-4 bg-muted/30">
              <p className="font-medium text-base mb-2">{t.name}</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Team ID: {t.id}</p>
                <p>Leader ID: {t.leaderId}</p>
                <p>Members: {t.memberIds.length}</p>
                <p>Vacancies: {t.vacancies}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">All Students</h2>
        <ul className="space-y-3">
          {students.map((s) => (
            <li key={s.id} className="rounded-md border p-4 bg-muted/30">
              <p className="font-medium text-base mb-2">{s.name}</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Email: {s.email}</p>
                <p>Dept: {s.dept}</p>
                <p>Reg No: {s.regNo}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}


function CreateTeamForm() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Create Your Team</h3>
        <p className="text-sm text-muted-foreground">Invite up to 5 members to join your team</p>
      </div>

      <form action="/api/teams/create" method="post" className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Team Name</label>
          <input
            name="name"
            className="w-full rounded-lg border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            placeholder="Enter team name"
            required
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium">Invite Team Members (Optional)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="space-y-2">
                <label className="text-xs text-muted-foreground">Member {num}</label>
                <input
                  name={`member${num}`}
                  type="email"
                  className="w-full rounded-lg border bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder={`member${num}@example.com`}
                />
              </div>
            ))}
          </div>
        </div>

        <button className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Team
        </button>
      </form>
    </div>
  )
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) {
    // Redirect via RSC
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-muted-foreground">
          You must be logged in.{" "}
          <Link className="text-primary underline" href="/login">
            Go to Login
          </Link>
        </p>
      </main>
    )
  }

  const role = (session.user as any).role as "student" | "admin"
  const userId = (session.user as any).id as string

  // Get user role from student data
  const students = await listStudents()
  const student = students.find(s => s.id === userId)
  const userRole = student?.role || "member"

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="mb-8 text-3xl font-semibold text-pretty">Dashboard</h1>
      {role === "admin" ? <AdminDashboard /> : <StudentDashboard userId={userId} userRole={userRole} />}
    </main>
  )
}
