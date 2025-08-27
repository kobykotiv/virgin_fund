type Condition = {
  id: string
  type: 'price' | 'indicator' | 'volume'
  indicator?: string
  comparator: '<' | '<=' | '==' | '>=' | '>'
  value: number
}

type Group = {
  id: string
  op: 'AND' | 'OR'
  conditions: Array<Condition | Group>
}

type Context = {
  price: number
  volume?: number
  indicators?: Record<string, number | number[]>
}

function compare(left: number, comp: string, right: number) {
  switch (comp) {
    case '<': return left < right
    case '<=': return left <= right
    case '==': return left === right
    case '>=': return left >= right
    case '>': return left > right
    default: return false
  }
}

export function evaluateCondition(cond: Condition, ctx: Context): boolean {
  if (cond.type === 'price') {
    return compare(ctx.price, cond.comparator, cond.value)
  }

  if (cond.type === 'volume') {
    return compare(ctx.volume ?? 0, cond.comparator, cond.value)
  }

  if (cond.type === 'indicator') {
    const key = cond.indicator ?? ''
    const val = ctx.indicators?.[key]
    // if indicator value is array (timeseries), take last
    const num = Array.isArray(val) ? (val as number[]).slice(-1)[0] : (val as number) ?? 0
    return compare(num, cond.comparator, cond.value)
  }

  return false
}

export function evaluateGroup(group: Group, ctx: Context): boolean {
  const results = group.conditions.map((c) => {
    if ((c as Group).conditions) return evaluateGroup(c as Group, ctx)
    return evaluateCondition(c as Condition, ctx)
  })

  if (group.op === 'AND') return results.every(Boolean)
  return results.some(Boolean)
}

export function evaluateRule(rule: Group | undefined, ctx: Context): boolean {
  if (!rule) return false
  try {
    return evaluateGroup(rule, ctx)
  } catch (e) {
    return false
  }
}
