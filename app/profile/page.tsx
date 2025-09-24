"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [form, setForm] = useState({
    name: "",
    regNo: "",
    dept: "",
    email: "",
    experienceLevel: "",
    github: "",
    role: "",
  })

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/login")
      return
    }
    fetchProfile()
  }, [session, status, router])

  async function fetchProfile() {
    try {
      const res = await fetch("/api/profile")
      if (!res.ok) throw new Error("Failed to fetch profile")
      const data = await res.json()
      setForm({
        name: data.name || "",
        regNo: data.regNo || "",
        dept: data.dept || "",
        email: data.email || "",
        experienceLevel: data.experienceLevel || "",
        github: data.github || "",
        role: data.role || "",
      })
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setFetchLoading(false)
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Update failed")
      toast({ title: "Profile updated", description: "Your profile has been updated successfully." })
    } catch (err: any) {
      toast({ title: "Update failed", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <main className="mx-auto max-w-xl px-4 py-10">
        <div className="text-center">Loading profile...</div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-pretty">Profile</h1>
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
        <input
          className="rounded-md border bg-background px-3 py-2"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="rounded-md border bg-background px-3 py-2"
          placeholder="Registration No"
          value={form.regNo}
          onChange={(e) => setForm({ ...form, regNo: e.target.value })}
          required
        />
        <Select value={form.dept} onValueChange={(value) => setForm({ ...form, dept: value })}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CSE">CSE</SelectItem>
            <SelectItem value="ECE">ECE</SelectItem>
            <SelectItem value="EEE">EEE</SelectItem>
            <SelectItem value="MECH">MECH</SelectItem>
          </SelectContent>
        </Select>
        <input
          className="rounded-md border bg-background px-3 py-2"
          type="email"
          placeholder="Email"
          value={form.email}
          disabled
        />
        <Select value={form.experienceLevel} onValueChange={(value) => setForm({ ...form, experienceLevel: value })}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Experience Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
        <Select value={form.role} onValueChange={(value) => setForm({ ...form, role: value })}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="leader">Team Leader</SelectItem>
            <SelectItem value="member">Team Member</SelectItem>
          </SelectContent>
        </Select>
        <input
          className="rounded-md border bg-background px-3 py-2"
          placeholder="GitHub profile link"
          value={form.github}
          onChange={(e) => setForm({ ...form, github: e.target.value })}
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </main>
  )
}