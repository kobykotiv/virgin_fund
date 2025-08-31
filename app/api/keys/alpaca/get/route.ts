import { NextResponse } from "next/server"
import { getAlpacaKeysFromStore, hasSupabase } from "@/lib/supabaseAdmin"

export async function GET() {
  const keys = await getAlpacaKeysFromStore()
  if (!keys) return NextResponse.json({ ok: true, keys: null })
  // never return the raw secret, only presence or redacted key id
  return NextResponse.json({ ok: true, keys: { keyId: keys.keyId ? "[REDACTED]" : null, provider: hasSupabase() ? "supabase" : "file" } })
}
