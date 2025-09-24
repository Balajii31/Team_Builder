"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function RegisterPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    regNo: "",
    dept: "",
    email: "",
    password: "",
    experienceLevel: "",
    github: "",
    role: "",
  })

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/students/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Registration failed")
      toast({ title: "Registration successful", description: "You can now log in." })
      router.push("/login")
    } catch (err: any) {
      toast({ title: "Registration failed", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-pretty">Register</h1>
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
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="rounded-md border bg-background px-3 py-2"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
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
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </main>
  )
}
