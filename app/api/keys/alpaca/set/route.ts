import { NextResponse } from "next/server"
import { writeAlpacaKeys } from "@/lib/server-keys"

export async function POST(req: Request) {
  const admin = req.headers.get("x-admin-token")
  if (!process.env.ADMIN_TOKEN || admin !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 })
  }
  try {
    const { keyId, secret } = await req.json()
    if (!keyId || !secret) return NextResponse.json({ ok: false, error: "missing" }, { status: 400 })
    writeAlpacaKeys(keyId, secret)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
