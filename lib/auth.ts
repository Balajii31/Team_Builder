import "server-only"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions, User } from "next-auth"
import { findStudentByEmail } from "@/lib/google-sheets"
import bcrypt from "bcryptjs"
import { getServerSession } from "next-auth"
import type { Role } from "@/types"

function requireEnv(name: string) {
  const v = process.env[name]
  if (!v) throw new Error(`Missing environment variable: ${name}`)
  return v
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        // Admin login via env
        if (adminEmail && adminPassword && credentials.email === adminEmail && credentials.password === adminPassword) {
          const adminUser: User = { id: "admin", email: adminEmail, name: "Admin", role: "admin" as Role } as any
          return adminUser
        }

        // Student lookup in Google Sheets
        const student = await findStudentByEmail(credentials.email)
        if (!student) return null

        const ok = await bcrypt.compare(credentials.password, student.passwordHash)
        if (!ok) return null

        const u: User = {
          id: student.id,
          email: student.email,
          name: student.name,
          role: "student" as Role,
        } as any
        return u
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.uid = (user as any).id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.uid
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
}

export async function auth() {
  return getServerSession(authOptions)
}
