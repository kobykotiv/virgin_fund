// Small cron expansion utility. Uses `cron-parser` if available. If not installed,
// callers should catch the error and ask the user to `bun add cron-parser`.
export async function expandCron(cronExpr: string, count = 5, options: any = {}) {
  try {
    const parser = await import('cron-parser')
    const it = parser.parseExpression(cronExpr, options)
    const out: string[] = []
    for (let i = 0; i < count; i++) {
      out.push(it.next().toISOString())
    }
    return out
  } catch (e: any) {
    throw new Error('cron-parser not available. Install it with: bun add cron-parser')
  }
}
