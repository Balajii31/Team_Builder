import { listTeamsWithVacancies } from "@/lib/google-sheets"
import RequestJoinButton from "./request-join-button"

export default async function RegisteredTeamsPage() {
  const teams = await listTeamsWithVacancies()
  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="mb-8 text-3xl font-semibold text-pretty">Registered Teams</h1>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((t) => (
          <li key={t.id} className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2">{t.name}</h2>
            <div className="space-y-1 mb-4">
              <p className="text-sm text-muted-foreground">Team ID: {t.id}</p>
              <p className="text-sm text-muted-foreground">Vacancies: {t.vacancies}</p>
            </div>
            <RequestJoinButton teamId={t.id} />
          </li>
        ))}
      </ul>
    </main>
  )
}
