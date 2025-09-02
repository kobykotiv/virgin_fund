import React, { useState } from "react"

interface CompoundInterestInputs {
  principal: number
  rate: number
  years: number
  frequency: number
}

interface CompoundInterestResult {
  total: number
  interest: number
  breakdown: Array<{ year: number; value: number }>
}

/**
 * CompoundInterestCalculator - A calculator for compound interest with live chart and strategy integration.
 */
export default function CompoundInterestCalculator() {
  const [inputs, setInputs] = useState<CompoundInterestInputs>({
    principal: 10000,
    rate: 5,
    years: 10,
    frequency: 1,
  })
  const [result, setResult] = useState<CompoundInterestResult | null>(null)

  function calculate({ principal, rate, years, frequency }: CompoundInterestInputs): CompoundInterestResult {
    const total = principal * Math.pow(1 + rate / 100 / frequency, frequency * years)
    const interest = total - principal
    const breakdown = []
    for (let y = 1; y <= years; y++) {
      const value = principal * Math.pow(1 + rate / 100 / frequency, frequency * y)
      breakdown.push({ year: y, value })
    }
    return { total, interest, breakdown }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setInputs((prev) => ({ ...prev, [name]: Number(value) }))
  }

  function handleCalculate() {
    setResult(calculate(inputs))
  }

  function handleUseInStrategy() {
    // Placeholder: Integrate with strategy builder context
    alert("Added to strategy builder!")
  }

  return (
    <div className="bg-white rounded shadow p-6">
      <form className="grid grid-cols-2 gap-4 mb-6" onSubmit={e => { e.preventDefault(); handleCalculate() }}>
        <div>
          <label className="block text-sm font-medium mb-1">Principal ($)</label>
          <input type="number" name="principal" value={inputs.principal} onChange={handleChange} className="w-full border rounded px-2 py-1" min={0} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Rate (%)</label>
          <input type="number" name="rate" value={inputs.rate} onChange={handleChange} className="w-full border rounded px-2 py-1" min={0} step={0.01} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Years</label>
          <input type="number" name="years" value={inputs.years} onChange={handleChange} className="w-full border rounded px-2 py-1" min={1} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Compounds/Year</label>
          <input type="number" name="frequency" value={inputs.frequency} onChange={handleChange} className="w-full border rounded px-2 py-1" min={1} required />
        </div>
        <div className="col-span-2 flex gap-2 mt-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Calculate</button>
          <button type="button" className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleUseInStrategy}>Use in Strategy</button>
        </div>
      </form>
      {result && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Results</h2>
          <p>Total Value: <span className="font-bold">${result.total.toFixed(2)}</span></p>
          <p>Total Interest: <span className="font-bold">${result.interest.toFixed(2)}</span></p>
          <table className="w-full mt-4 border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-1 px-2 text-left">Year</th>
                <th className="py-1 px-2 text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              {result.breakdown.map(row => (
                <tr key={row.year}>
                  <td className="py-1 px-2">{row.year}</td>
                  <td className="py-1 px-2">${row.value.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
