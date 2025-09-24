import { auth } from "@/lib/auth"
import { listTeams, listStudents, listJoinRequests } from "@/lib/google-sheets"
import Link from "next/link"

async function StudentDashboard({ userId, userRole }: { userId: string, userRole: string }) {
  const teams = await listTeams()
  const joinRequests = await listJoinRequests()
  const myTeam = teams.find((t) => t.leaderId === userId || t.memberIds.includes(userId))
  const myPendingRequests = myTeam ? joinRequests.filter(r => r.teamId === myTeam.id && r.status === "pending") : []

  return (
    <div className="space-y-8">
      <section className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Your Team</h2>
        {!myTeam ? (
          <div className="space-y-4">
            <p className="text-muted-foreground">You are not part of a team yet.</p>
            {userRole === "leader" && <CreateTeamForm />}
            {userRole !== "leader" && (
              <p className="text-sm text-muted-foreground">
                Only team leaders can create teams. You can join existing teams.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-base">
              <span className="font-medium">Team:</span> {myTeam.name}
            </p>
            <p className="text-base">
              <span className="font-medium">Vacancies:</span> {myTeam.vacancies}
            </p>
            <p className="text-base">
              <span className="font-medium">Role:</span> {myTeam.leaderId === userId ? "Leader" : "Member"}
            </p>
          </div>
        )}
      </section>

      {myTeam && myTeam.leaderId === userId && myPendingRequests.length > 0 && (
        <section className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Pending Join Requests</h2>
          <ul className="space-y-3">
            {myPendingRequests.map((req) => (
              <li key={req.id} className="rounded-md border p-4 bg-muted/30">
                <p className="font-medium text-base mb-2">Student ID: {req.studentId}</p>
                <p className="text-sm text-muted-foreground mb-2">Message: {req.message || "No message"}</p>
                <div className="flex gap-2">
                  <ApproveButton requestId={req.id} action="approve" />
                  <ApproveButton requestId={req.id} action="deny" />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Explore Teams with Vacancies</h2>
        <Link href="/registered-teams" className="text-base text-primary underline hover:text-primary/80">
          View Registered Teams
        </Link>
      </section>
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

function ApproveButton({ requestId, action }: { requestId: string; action: "approve" | "deny" }) {
  return (
    <button
      onClick={async () => {
        try {
          const res = await fetch("/api/teams/approve-request", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ requestId, action }),
          })
          if (res.ok) {
            window.location.reload()
          } else {
            alert("Failed to process request")
          }
        } catch (e) {
          alert("Error")
        }
      }}
      className={`inline-flex items-center rounded-md px-3 py-1 text-sm font-medium ${
        action === "approve"
          ? "bg-green-600 text-white hover:bg-green-700"
          : "bg-red-600 text-white hover:bg-red-700"
      }`}
    >
      {action === "approve" ? "Approve" : "Deny"}
    </button>
  )
}

function CreateTeamForm() {
  return (
    <div className="space-y-4">
      <form action="/api/teams/create" method="post" className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Team Name</label>
          <input
            name="name"
            className="w-full rounded-md border bg-background px-3 py-2"
            placeholder="e.g. Alpha Coders"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Member 1 Email</label>
            <input
              name="member1"
              type="email"
              className="w-full rounded-md border bg-background px-3 py-2"
              placeholder="member1@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Member 2 Email</label>
            <input
              name="member2"
              type="email"
              className="w-full rounded-md border bg-background px-3 py-2"
              placeholder="member2@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Member 3 Email</label>
            <input
              name="member3"
              type="email"
              className="w-full rounded-md border bg-background px-3 py-2"
              placeholder="member3@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Member 4 Email</label>
            <input
              name="member4"
              type="email"
              className="w-full rounded-md border bg-background px-3 py-2"
              placeholder="member4@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Member 5 Email</label>
            <input
              name="member5"
              type="email"
              className="w-full rounded-md border bg-background px-3 py-2"
              placeholder="member5@example.com"
            />
          </div>
        </div>
        <button className="inline-flex items-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
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
