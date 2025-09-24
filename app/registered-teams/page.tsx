import { listTeamsWithVacancies } from "@/lib/google-sheets"
import RequestJoinButton from "./request-join-button"

export const dynamic = 'force-dynamic'

export default async function RegisteredTeamsPage() {
  const teams = await listTeamsWithVacancies()

  if (teams.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
              <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">No Teams Available</h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                There are currently no teams with available vacancies. Check back later or create your own team.
              </p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Available Teams</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join an existing team or explore opportunities to collaborate with fellow students.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((t) => (
            <div key={t.id} className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative rounded-xl border bg-card p-6 shadow-sm hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{t.name}</h3>
                      <p className="text-xs text-muted-foreground font-mono">ID: {t.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Available spots</span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-xs font-medium">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {t.vacancies} open
                    </span>
                  </div>

                  <RequestJoinButton teamId={t.id} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Can't find a suitable team?{" "}
            <a href="/dashboard" className="text-primary hover:underline font-medium">
              Create your own
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
