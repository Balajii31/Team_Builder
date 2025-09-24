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
      className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:opacity-90"
    >
      Request to Join
    </button>
  )
}
