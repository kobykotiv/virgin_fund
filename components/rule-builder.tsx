import React from 'react'
import RulePreview from '@/components/rule/RulePreview'
import { generateDemoMarketData } from '@/lib/demo-data'

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

function uid(prefix = '') {
  return prefix + Math.random().toString(36).slice(2, 9)
}

export default function RuleBuilder({ value, onChange }: { value?: Group; onChange: (g: Group) => void }) {
  const root: Group = value ?? { id: uid('g_'), op: 'AND', conditions: [] }

  const addCondition = (group: Group) => {
    const c: Condition = { id: uid('c_'), type: 'indicator', indicator: 'rsi', comparator: '<', value: 30 }
    group.conditions.push(c)
    onChange({ ...root })
  }

  const addGroup = (group: Group) => {
    const g: Group = { id: uid('g_'), op: 'AND', conditions: [] }
    group.conditions.push(g)
    onChange({ ...root })
  }

  const updateCond = (group: Group, idx: number, patch: Partial<Condition>) => {
    const item = group.conditions[idx] as Condition
    Object.assign(item, patch)
    onChange({ ...root })
  }

  const removeAt = (group: Group, idx: number) => {
    group.conditions.splice(idx, 1)
    onChange({ ...root })
  }

  const renderGroup = (g: Group) => {
    return (
      <div key={g.id} className="p-2 border rounded bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium">Group ({g.op})</div>
          <div className="flex items-center space-x-2">
            <select value={g.op} onChange={(e) => { g.op = e.target.value as any; onChange({ ...root }) }} className="text-sm border p-1 rounded">
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
            <button type="button" className="text-xs text-blue-600" onClick={() => addCondition(g)}>+ Condition</button>
            <button type="button" className="text-xs text-blue-600" onClick={() => addGroup(g)}>+ Group</button>
          </div>
        </div>

        <div className="space-y-2">
          {g.conditions.map((c, idx) => {
            if ((c as Group).conditions) {
              return <div key={(c as Group).id}>{renderGroup(c as Group)}</div>
            }
            const cond = c as Condition
            return (
              <div key={cond.id} className="flex items-center space-x-2">
                <select value={cond.type} onChange={(e) => updateCond(g, idx, { type: e.target.value as any })} className="text-sm border p-1 rounded">
                  <option value="indicator">Indicator</option>
                  <option value="price">Price</option>
                  <option value="volume">Volume</option>
                </select>
                {cond.type === 'indicator' && (
                  <select value={cond.indicator} onChange={(e) => updateCond(g, idx, { indicator: e.target.value })} className="text-sm border p-1 rounded">
                    <option value="rsi">RSI</option>
                    <option value="macd">MACD</option>
                    <option value="bollinger">Bollinger</option>
                  </select>
                )}
                <select value={cond.comparator} onChange={(e) => updateCond(g, idx, { comparator: e.target.value as any })} className="text-sm border p-1 rounded">
                  <option>{'<'}</option>
                  <option>{'<='}</option>
                  <option>{'=='}</option>
                  <option>{'>='}</option>
                  <option>{'>'}</option>
                </select>
                <input type="number" value={cond.value} onChange={(e) => updateCond(g, idx, { value: Number(e.target.value) })} className="text-sm border p-1 rounded w-20" />
                <button type="button" className="text-xs text-red-600" onClick={() => removeAt(g, idx)}>Remove</button>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {renderGroup(root)}
      <div className="text-xs text-gray-600">Rule JSON:</div>
      <pre className="text-xs bg-white p-2 rounded border overflow-auto" style={{ maxHeight: 200 }}>{JSON.stringify(root, null, 2)}</pre>
      <div>
        <RulePreview rule={root} sample={generateDemoMarketData()} />
      </div>
    </div>
  )
}
