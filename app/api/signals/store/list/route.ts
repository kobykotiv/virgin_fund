import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

function storagePath() {
  return path.join(process.cwd(), "data", "signals.json")
}

export async function GET() {
  try {
    const p = storagePath()
    if (!fs.existsSync(p)) return NextResponse.json({ ok: true, signals: [] })
    const raw = fs.readFileSync(p, "utf8")
    const arr = JSON.parse(raw)
    return NextResponse.json({ ok: true, signals: arr })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
