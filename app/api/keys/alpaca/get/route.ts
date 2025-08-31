import { NextResponse } from "next/server"
import { readAlpacaKeys } from "@/lib/server-keys"

export async function GET() {
  const keys = readAlpacaKeys()
  if (!keys) return NextResponse.json({ ok: true, keys: null })
  return NextResponse.json({ ok: true, keys: { keyId: keys.keyId ? "[REDACTED]" : null } })
}
