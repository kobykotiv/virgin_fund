import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    // Clear auth cookies
    const cookieStore = cookies()
    cookieStore.delete("auth-token")
    cookieStore.delete("demo-mode")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { error: "Failed to logout" },
      { status: 500 }
    )
  }
}