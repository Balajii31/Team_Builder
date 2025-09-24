import "server-only"
import { google } from "googleapis"
import fs from "fs"
import type { Student, Team, JoinRequest, JoinRequestStatus } from "@/types"

const STUDENTS_SHEET = "students"
const TEAMS_SHEET = "teams"
const REQUESTS_SHEET = "join_requests"

function getEnv(name: string) {
  const v = process.env[name]
  if (!v) throw new Error(`Missing environment variable: ${name}`)
  return v
}

function getAuth() {
  const creds = JSON.parse(fs.readFileSync("service-account.json", "utf8"))
  const jwt = new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })
  return jwt
}

async function getSheets() {
  const auth = getAuth()
  await auth.authorize()
  return google.sheets({ version: "v4", auth })
}

function spreadsheetId() {
  return getEnv("GOOGLE_SHEETS_ID")
}

export async function ensureSheetsSetup() {
  const sheets = await getSheets()
  const id = spreadsheetId()

  const meta = await sheets.spreadsheets.get({ spreadsheetId: id })
  const titles = meta.data.sheets?.map((s) => s.properties?.title) ?? []

  const missing: { title: string; headers: string[] }[] = []

  if (!titles.includes(STUDENTS_SHEET)) {
    missing.push({
      title: STUDENTS_SHEET,
      headers: [
        "id",
        "name",
        "regNo",
        "dept",
        "email",
        "passwordHash",
        "experienceLevel",
        "github",
        "role",
        "createdAt",
      ],
    })
  }

  if (!titles.includes(TEAMS_SHEET)) {
    missing.push({
      title: TEAMS_SHEET,
      headers: ["id", "name", "leaderId", "memberIds", "vacancies", "createdAt"],
    })
  }

  if (!titles.includes(REQUESTS_SHEET)) {
    missing.push({
      title: REQUESTS_SHEET,
      headers: ["id", "teamId", "studentId", "message", "status", "createdAt"],
    })
  }

  if (missing.length === 0) return

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: id,
    requestBody: {
      requests: missing.map((m) => ({
        addSheet: { properties: { title: m.title } },
      })),
    },
  })

  // write headers
  for (const m of missing) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: id,
      range: `${m.title}!A1:${String.fromCharCode(64 + m.headers.length)}1`,
      valueInputOption: "RAW",
      requestBody: { values: [m.headers] },
    })
  }
}

function parseRow<T = any>(headers: string[], row: any[]): T {
  const obj: any = {}
  headers.forEach((h, i) => {
    obj[h] = row[i] ?? ""
  })
  return obj as T
}

async function readAll<T = any>(sheetName: string): Promise<T[]> {
  const sheets = await getSheets()
  const id = spreadsheetId()
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: id,
    range: `${sheetName}!A1:Z`,
  })
  const values = res.data.values || []
  if (values.length < 2) return []
  const headers = values[0]
  return values.slice(1).map((row) => parseRow<T>(headers, row))
}

async function appendRow(sheetName: string, values: any[]) {
  const sheets = await getSheets()
  const id = spreadsheetId()
  await sheets.spreadsheets.values.append({
    spreadsheetId: id,
    range: `${sheetName}!A1`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [values] },
  })
}

async function updateRows(sheetName: string, headers: string[], rows: any[]) {
  const sheets = await getSheets()
  const id = spreadsheetId()
  const headerRange = `${sheetName}!A1:${String.fromCharCode(64 + headers.length)}1`
  await sheets.spreadsheets.values.update({
    spreadsheetId: id,
    range: headerRange,
    valueInputOption: "RAW",
    requestBody: { values: [headers] },
  })
  // clear data range first
  await sheets.spreadsheets.values.clear({
    spreadsheetId: id,
    range: `${sheetName}!A2:Z`,
  })
  if (rows.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: id,
      range: `${sheetName}!A2`,
      valueInputOption: "RAW",
      requestBody: { values: rows },
    })
  }
}

// Students
export async function listStudents(): Promise<Student[]> {
  const rows = await readAll<Student>(STUDENTS_SHEET)
  return rows.map((r) => ({
    ...r,
    memberIds: undefined,
  })) as unknown as Student[]
}

export async function findStudentByEmail(email: string): Promise<Student | null> {
  const students = await listStudents()
  return students.find((s) => s.email.toLowerCase() === email.toLowerCase()) ?? null
}

export async function addStudent(s: Student) {
  await appendRow(STUDENTS_SHEET, [
    s.id,
    s.name,
    s.regNo,
    s.dept,
    s.email,
    s.passwordHash,
    s.experienceLevel,
    s.github,
    s.role,
    s.createdAt,
  ])
}

// Teams
export async function listTeams(): Promise<Team[]> {
  const rows = await readAll<any>(TEAMS_SHEET)
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    leaderId: r.leaderId,
    memberIds: r.memberIds ? JSON.parse(r.memberIds) : [],
    vacancies: Number(r.vacancies ?? 0),
    createdAt: r.createdAt,
  })) as Team[]
}

export async function getTeamById(teamId: string): Promise<Team | null> {
  const teams = await listTeams()
  return teams.find((t) => t.id === teamId) ?? null
}

export async function listTeamsWithVacancies(): Promise<Team[]> {
  const teams = await listTeams()
  return teams.filter((t) => t.vacancies > 0)
}

export async function createTeam(team: Team) {
  await appendRow(TEAMS_SHEET, [
    team.id,
    team.name,
    team.leaderId,
    JSON.stringify(team.memberIds ?? []),
    team.vacancies,
    team.createdAt,
  ])
}

export async function saveTeams(teams: Team[]) {
  const headers = ["id", "name", "leaderId", "memberIds", "vacancies", "createdAt"]
  const rows = teams.map((t) => [
    t.id,
    t.name,
    t.leaderId,
    JSON.stringify(t.memberIds ?? []),
    String(t.vacancies),
    t.createdAt,
  ])
  await updateRows(TEAMS_SHEET, headers, rows)
}

export async function updateTeam(team: Team) {
  const allTeams = await listTeams()
  const index = allTeams.findIndex(t => t.id === team.id)
  if (index === -1) throw new Error("Team not found")
  allTeams[index] = team
  await saveTeams(allTeams)
}

// Join Requests
export async function listJoinRequests(): Promise<JoinRequest[]> {
  const rows = await readAll<JoinRequest>(REQUESTS_SHEET)
  return rows.map((r: any) => ({
    id: r.id,
    teamId: r.teamId,
    studentId: r.studentId,
    message: r.message ?? "",
    status: (r.status as any) || "pending",
    createdAt: r.createdAt,
  }))
}

export async function createJoinRequest(req: JoinRequest) {
  await appendRow(REQUESTS_SHEET, [req.id, req.teamId, req.studentId, req.message || "", req.status, req.createdAt])
}

export async function updateJoinRequestStatus(requestId: string, status: JoinRequestStatus) {
  const requests = await listJoinRequests()
  const index = requests.findIndex(r => r.id === requestId)
  if (index === -1) throw new Error("Join request not found")
  requests[index].status = status
  const headers = ["id", "teamId", "studentId", "message", "status", "createdAt"]
  const rows = requests.map((r) => [
    r.id,
    r.teamId,
    r.studentId,
    r.message || "",
    r.status,
    r.createdAt,
  ])
  await updateRows(REQUESTS_SHEET, headers, rows)
}
