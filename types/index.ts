export type Role = "student" | "admin"

export interface Student {
  id: string
  name: string
  regNo: string
  dept: string
  email: string
  passwordHash: string
  experienceLevel: string
  github: string
  role: Role
  createdAt: string
}

export interface Team {
  id: string
  name: string
  leaderId: string
  memberIds: string[] // includes invited/accepted members (not leader)
  vacancies: number
  createdAt: string
}

export type JoinRequestStatus = "pending" | "approved" | "denied"

export interface JoinRequest {
  id: string
  teamId: string
  studentId: string
  message?: string
  status: JoinRequestStatus
  createdAt: string
}

export interface SessionUser {
  id: string
  email: string
  name?: string
  role: Role
}
