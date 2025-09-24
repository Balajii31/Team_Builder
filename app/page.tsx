export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-pretty">Welcome to Team Builder</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Register as a student, create a team, invite members, or request to join open teams. Admins can review all teams
          and students.
        </p>
        <div className="flex justify-center gap-4 mt-8">
          <a href="/register" className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">
            Get Started
          </a>
          <a href="/login" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent">
            Sign In
          </a>
        </div>
      </div>
    </main>
  )
}
