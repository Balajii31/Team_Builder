"use client"

import { useRouter } from "next/navigation"

export function ApproveButton({ requestId, action }: { requestId: string; action: "approve" | "deny" }) {
  const router = useRouter()

  async function onClick() {
    try {
      const res = await fetch("/api/teams/approve-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action }),
      })
      if (res.ok) {
        router.refresh()
      } else {
        alert("Failed to process request")
      }
    } catch (e) {
      alert("Error")
    }
  }

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        action === "approve"
          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          : "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm"
      }`}
    >
      {action === "approve" ? (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Approve
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Deny
        </>
      )}
    </button>
  )
}