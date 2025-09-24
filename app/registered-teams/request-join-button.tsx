"use client"

import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function RequestJoinButton({ teamId }: { teamId: string }) {
  const { toast } = useToast()
  const router = useRouter()

  async function onClick() {
    try {
      const res = await fetch("/api/teams/request-join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId }),
      })
      if (res.status === 401) {
        router.push("/login")
        return
      }
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to send request")
      toast({ title: "Request sent", description: "Team leader will review your request." })
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" })
    }
  }

  return (
    <button
      onClick={onClick}
      className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
      Request to Join
    </button>
  )
}
