import fs from 'fs'
import path from 'path'

const ENV_LOCAL = path.join(process.cwd(), '.env.local')

export async function readEnvLocal(): Promise<Record<string,string>> {
  try {
    const raw = await fs.promises.readFile(ENV_LOCAL, 'utf8')
    const lines = raw.split(/\r?\n/)
    const out: Record<string,string> = {}
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq)
      const val = trimmed.slice(eq + 1)
      out[key] = val
    }
    return out
  } catch (e) {
    return {}
  }
}

export async function writeEnvLocal(vars: Record<string,string>): Promise<void> {
  const existing = await readEnvLocal()
  const merged = { ...existing, ...vars }
  const lines: string[] = []
  for (const [k, v] of Object.entries(merged)) {
    lines.push(`${k}=${String(v)}`)
  }
  const content = lines.join('\n') + '\n'
  await fs.promises.writeFile(ENV_LOCAL, content, 'utf8')
}
