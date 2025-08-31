import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

function storagePath() {
  return path.join(process.cwd(), "data", "signals.json")
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const id = body.id
    const p = storagePath()
    if (!fs.existsSync(p)) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 })
    let arr = JSON.parse(fs.readFileSync(p, "utf8"))
    const before = arr.length
    arr = arr.filter((s: any) => s.id !== id)
    fs.writeFileSync(p, JSON.stringify(arr, null, 2), "utf8")
    return NextResponse.json({ ok: true, removed: before - arr.length })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
