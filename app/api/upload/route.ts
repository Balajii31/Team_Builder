import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Mock upload - just return file info
    const mockId = `mock_${Date.now()}`
    const mockUrl = `https://example.com/files/${mockId}`

    return NextResponse.json({
      id: mockId,
      name: file.name,
      url: mockUrl,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}