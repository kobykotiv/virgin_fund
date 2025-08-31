import fs from "fs"
import path from "path"

const KEYS_PATH = path.join(process.cwd(), "data", "secrets", "alpaca-keys.json")

export function readAlpacaKeys(): { keyId?: string; secret?: string } | null {
  try {
    if (!fs.existsSync(KEYS_PATH)) return null
    const raw = fs.readFileSync(KEYS_PATH, "utf8")
    const obj = JSON.parse(raw)
    return { keyId: obj.keyId, secret: obj.secret }
  } catch (e) {
    return null
  }
}

export function writeAlpacaKeys(keyId: string, secret: string) {
  fs.mkdirSync(path.dirname(KEYS_PATH), { recursive: true })
  fs.writeFileSync(KEYS_PATH, JSON.stringify({ keyId, secret }, null, 2), "utf8")
}
