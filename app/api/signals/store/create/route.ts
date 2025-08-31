import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

function storagePath() {
  return path.join(process.cwd(), "data", "signals.json")
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const p = storagePath()
    let arr: any[] = []
    if (fs.existsSync(p)) arr = JSON.parse(fs.readFileSync(p, "utf8"))
    const id = body.id || `sig_${Date.now()}`
    const item = { ...body, id }
    arr.push(item)
    fs.mkdirSync(path.dirname(p), { recursive: true })
    fs.writeFileSync(p, JSON.stringify(arr, null, 2), "utf8")
    return NextResponse.json({ ok: true, item })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
