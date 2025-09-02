# Navigation Item Implementation Prompts

## Dashboard (app root `/`)
**Overview with balances, portfolio chart (Recharts), active bots summary. Use `usePortfolio()` and `useBots()` hooks.**

```typescript
// components/dashboard/Overview.tsx
import React from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import useBots from '@/hooks/useBots';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Overview: React.FC = () => {
  const { data: portfolio } = usePortfolio();
  const { data: bots } = useBots();

  const activeBots = bots?.filter(bot => bot.status === 'running') || [];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card p-4 rounded-lg">
          <h3>Total Balance</h3>
          <p className="text-2xl">${portfolio?.totalBalance || 0}</p>
        </div>
        <div className="bg-card p-4 rounded-lg">
          <h3>Active Bots</h3>
          <p className="text-2xl">{activeBots.length}</p>
        </div>
        <div className="bg-card p-4 rounded-lg">
          <h3>Total PnL</h3>
          <p className="text-2xl">${portfolio?.totalPnL || 0}</p>
        </div>
      </div>
      <div className="bg-card p-4 rounded-lg">
        <h3>Portfolio Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={portfolio?.performance || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
```

## Custom Signals
**Manage user-defined signals with CRUD. Table of signals (name, condition, actions). Integrate with alerts API.**

```typescript
// components/signals/SignalsManager.tsx
import React from 'react';
import { useSignals } from '@/hooks/useSignals';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const SignalsManager: React.FC = () => {
  const { data: signals, isLoading } = useSignals();

  if (isLoading) return <div>Loading signals...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Custom Signals</h2>
        <Button>Create Signal</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {signals?.map(signal => (
            <TableRow key={signal.id}>
              <TableCell>{signal.name}</TableCell>
              <TableCell>{signal.condition}</TableCell>
              <TableCell>
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm" variant="destructive">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
```

## Backtest
**Runner for strategies. Select strategy/parameters, run simulation, show equity curve (Recharts) and metrics. Save as bot.**

```typescript
// components/backtest/BacktestRunner.tsx
import React, { useState } from 'react';
import { useBacktests } from '@/hooks/useBacktests';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const BacktestRunner: React.FC = () => {
  const [strategy, setStrategy] = useState('');
  const [parameters, setParameters] = useState({});
  const { mutate: runBacktest, data: result } = useBacktests();

  const handleRun = () => {
    runBacktest({ strategy, parameters });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Backtest Runner</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Select value={strategy} onValueChange={setStrategy}>
          <SelectTrigger><SelectValue placeholder="Select Strategy" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="dca">DCA</SelectItem>
            <SelectItem value="grid">Grid</SelectItem>
            <SelectItem value="indicator">Indicator</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleRun}>Run Backtest</Button>
      </div>
      {result && (
        <div className="bg-card p-4 rounded-lg">
          <h3>Equity Curve</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={result.equityCurve}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="equity" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4">
            <p>Total Return: {result.metrics.totalReturn}%</p>
            <p>Sharpe Ratio: {result.metrics.sharpeRatio}</p>
            <p>Max Drawdown: {result.metrics.maxDrawdown}%</p>
          </div>
          <Button className="mt-4">Save as Bot</Button>
        </div>
      )}
    </div>
  );
};
```

## Portfolio
**Allocation pie chart, performance line chart vs benchmark. Rebalancing tools. Use `usePortfolio()` hook.**

```typescript
// components/portfolio/PortfolioOverview.tsx
import React from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const PortfolioOverview: React.FC = () => {
  const { data: portfolio } = usePortfolio();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Portfolio Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card p-4 rounded-lg">
          <h3>Asset Allocation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={portfolio?.allocation || []} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {(portfolio?.allocation || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card p-4 rounded-lg">
          <h3>Performance vs Benchmark</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={portfolio?.performance || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="portfolio" stroke="#8884d8" />
              <Line type="monotone" dataKey="benchmark" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <Button className="mt-4">Rebalance Portfolio</Button>
    </div>
  );
};
```

## Financial Tools > Financial Calculators > Compound Interest
**Calculator component with inputs (principal, rate, time). Output compounded value. Use shadcn/ui forms.**

```typescript
// components/calculators/CompoundInterestCalculator.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const CompoundInterestCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);
    const compound = p * Math.pow(1 + r, t);
    setResult(compound);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Compound Interest Calculator</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="principal">Principal Amount</Label>
          <Input id="principal" type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="rate">Annual Interest Rate (%)</Label>
          <Input id="rate" type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="time">Time (years)</Label>
          <Input id="time" type="number" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        <Button onClick={calculate}>Calculate</Button>
        {result && (
          <div className="mt-4 p-4 bg-card rounded-lg">
            <p>Future Value: ${result.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
};
```

## Financial Tools > Financial Calculators > Savings Calculator
**Inputs for monthly savings, rate. Output future value. Similar to compound interest.**

```typescript
// components/calculators/SavingsCalculator.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const SavingsCalculator: React.FC = () => {
  const [monthly, setMonthly] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const m = parseFloat(monthly);
    const r = parseFloat(rate) / 100 / 12; // Monthly rate
    const t = parseFloat(time) * 12; // Months
    const future = m * ((Math.pow(1 + r, t) - 1) / r);
    setResult(future);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Savings Calculator</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="monthly">Monthly Savings</Label>
          <Input id="monthly" type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="rate">Annual Interest Rate (%)</Label>
          <Input id="rate" type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="time">Time (years)</Label>
          <Input id="time" type="number" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        <Button onClick={calculate}>Calculate</Button>
        {result && (
          <div className="mt-4 p-4 bg-card rounded-lg">
            <p>Future Value: ${result.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
};
```

## Financial Tools > Financial Calculators > Retirement Calculator
**Inputs for current savings, contributions, retirement age. Output projections.**

```typescript
// components/calculators/RetirementCalculator.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const RetirementCalculator: React.FC = () => {
  const [current, setCurrent] = useState('');
  const [monthly, setMonthly] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const c = parseFloat(current);
    const m = parseFloat(monthly);
    const r = parseFloat(rate) / 100 / 12;
    const t = parseFloat(years) * 12;
    const future = c * Math.pow(1 + r, t) + m * ((Math.pow(1 + r, t) - 1) / r);
    setResult(future);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Retirement Calculator</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="current">Current Savings</Label>
          <Input id="current" type="number" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="monthly">Monthly Contribution</Label>
          <Input id="monthly" type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="rate">Expected Return (%)</Label>
          <Input id="rate" type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="years">Years Until Retirement</Label>
          <Input id="years" type="number" value={years} onChange={(e) => setYears(e.target.value)} />
        </div>
        <Button onClick={calculate}>Calculate</Button>
        {result && (
          <div className="mt-4 p-4 bg-card rounded-lg">
            <p>Projected Savings: ${result.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
};
```

## Financial Tools > Financial Calculators > Inflation Calculator
**Inputs for amount, inflation rate, years. Output adjusted value.**

```typescript
// components/calculators/InflationCalculator.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const InflationCalculator: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const a = parseFloat(amount);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(years);
    const adjusted = a / Math.pow(1 + r, t);
    setResult(adjusted);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Inflation Calculator</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="amount">Future Amount</Label>
          <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="rate">Inflation Rate (%)</Label>
          <Input id="rate" type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="years">Years</Label>
          <Input id="years" type="number" value={years} onChange={(e) => setYears(e.target.value)} />
        </div>
        <Button onClick={calculate}>Calculate</Button>
        {result && (
          <div className="mt-4 p-4 bg-card rounded-lg">
            <p>Present Value: ${result.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
};
```

## Financial Tools > Market Analysis
**Charts for market trends (Recharts). Integrate Alpaca market data.**

```typescript
// components/market/MarketAnalysis.tsx
import React from 'react';
import { useMarketData } from '@/hooks/useMarketData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const MarketAnalysis: React.FC = () => {
  const { data: marketData } = useMarketData();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Market Analysis</h2>
      <div className="bg-card p-4 rounded-lg">
        <h3>Market Trends</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={marketData?.trends || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sp500" stroke="#8884d8" name="S&P 500" />
            <Line type="monotone" dataKey="nasdaq" stroke="#82ca9d" name="NASDAQ" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
```

## Trading Tools > Trading Calculators > Risk/Reward
**Inputs for entry, stop-loss, target. Output ratio and position size.**

```typescript
// components/calculators/RiskRewardCalculator.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const RiskRewardCalculator: React.FC = () => {
  const [entry, setEntry] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [target, setTarget] = useState('');
  const [result, setResult] = useState<{ ratio: number; risk: number; reward: number } | null>(null);

  const calculate = () => {
    const e = parseFloat(entry);
    const sl = parseFloat(stopLoss);
    const t = parseFloat(target);
    const risk = Math.abs(e - sl);
    const reward = Math.abs(t - e);
    const ratio = reward / risk;
    setResult({ ratio, risk, reward });
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Risk/Reward Calculator</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="entry">Entry Price</Label>
          <Input id="entry" type="number" value={entry} onChange={(e) => setEntry(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="stopLoss">Stop Loss</Label>
          <Input id="stopLoss" type="number" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="target">Target Price</Label>
          <Input id="target" type="number" value={target} onChange={(e) => setTarget(e.target.value)} />
        </div>
        <Button onClick={calculate}>Calculate</Button>
        {result && (
          <div className="mt-4 p-4 bg-card rounded-lg">
            <p>Risk/Reward Ratio: {result.ratio.toFixed(2)}</p>
            <p>Risk per Share: ${result.risk.toFixed(2)}</p>
            <p>Reward per Share: ${result.reward.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
};
```

## Trading Tools > Trading Calculators > Position Size
**Inputs for account size, risk %, stop-loss. Output position size.**

```typescript
// components/calculators/PositionSizeCalculator.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const PositionSizeCalculator: React.FC = () => {
  const [account, setAccount] = useState('');
  const [riskPercent, setRiskPercent] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [entry, setEntry] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const a = parseFloat(account);
    const rp = parseFloat(riskPercent) / 100;
    const sl = parseFloat(stopLoss);
    const e = parseFloat(entry);
    const riskAmount = a * rp;
    const riskPerShare = Math.abs(e - sl);
    const positionSize = riskAmount / riskPerShare;
    setResult(positionSize);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Position Size Calculator</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="account">Account Size</Label>
          <Input id="account" type="number" value={account} onChange={(e) => setAccount(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="riskPercent">Risk Percentage (%)</Label>
          <Input id="riskPercent" type="number" value={riskPercent} onChange={(e) => setRiskPercent(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="entry">Entry Price</Label>
          <Input id="entry" type="number" value={entry} onChange={(e) => setEntry(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="stopLoss">Stop Loss</Label>
          <Input id="stopLoss" type="number" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} />
        </div>
        <Button onClick={calculate}>Calculate</Button>
        {result && (
          <div className="mt-4 p-4 bg-card rounded-lg">
            <p>Position Size: {result.toFixed(2)} shares</p>
          </div>
        )}
      </div>
    </div>
  );
};
```

## Trading Tools > Trading Calculators > Leverage
**Inputs for margin, leverage ratio. Output effective exposure.**

```typescript
// components/calculators/LeverageCalculator.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const LeverageCalculator: React.FC = () => {
  const [margin, setMargin] = useState('');
  const [leverage, setLeverage] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const m = parseFloat(margin);
    const l = parseFloat(leverage);
    const exposure = m * l;
    setResult(exposure);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Leverage Calculator</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="margin">Margin Amount</Label>
          <Input id="margin" type="number" value={margin} onChange={(e) => setMargin(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="leverage">Leverage Ratio</Label>
          <Input id="leverage" type="number" value={leverage} onChange={(e) => setLeverage(e.target.value)} />
        </div>
        <Button onClick={calculate}>Calculate</Button>
        {result && (
          <div className="mt-4 p-4 bg-card rounded-lg">
            <p>Effective Exposure: ${result.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
};
```

## Trading Tools > Trading Calculators > Pivot Points
**Inputs for OHLC. Output pivot levels. Use market data hooks.**

```typescript
// components/calculators/PivotPointsCalculator.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const PivotPointsCalculator: React.FC = () => {
  const [high, setHigh] = useState('');
  const [low, setLow] = useState('');
  const [close, setClose] = useState('');
  const [result, setResult] = useState<{
    pivot: number;
    r1: number;
    r2: number;
    s1: number;
    s2: number;
  } | null>(null);

  const calculate = () => {
    const h = parseFloat(high);
    const l = parseFloat(low);
    const c = parseFloat(close);
    const pivot = (h + l + c) / 3;
    const r1 = 2 * pivot - l;
    const r2 = pivot + (h - l);
    const s1 = 2 * pivot - h;
    const s2 = pivot - (h - l);
    setResult({ pivot, r1, r2, s1, s2 });
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Pivot Points Calculator</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="high">High</Label>
          <Input id="high" type="number" value={high} onChange={(e) => setHigh(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="low">Low</Label>
          <Input id="low" type="number" value={low} onChange={(e) => setLow(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="close">Close</Label>
          <Input id="close" type="number" value={close} onChange={(e) => setClose(e.target.value)} />
        </div>
        <Button onClick={calculate}>Calculate</Button>
        {result && (
          <div className="mt-4 p-4 bg-card rounded-lg">
            <p>Pivot: ${result.pivot.toFixed(2)}</p>
            <p>R1: ${result.r1.toFixed(2)}</p>
            <p>R2: ${result.r2.toFixed(2)}</p>
            <p>S1: ${result.s1.toFixed(2)}</p>
            <p>S2: ${result.s2.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
};
```

## Trading Tools > Strategy Builder
**Drag-and-drop builder for custom strategies. Save to Supabase. Integrate with backtest.**

```typescript
// components/strategy/StrategyBuilder.tsx
import React, { useState } from 'react';
import { useStrategyBuilder } from '@/hooks/useStrategyBuilder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const StrategyBuilder: React.FC = () => {
  const [strategy, setStrategy] = useState<any>({});
  const { mutate: saveStrategy } = useStrategyBuilder();

  const addIndicator = (indicator: string) => {
    setStrategy(prev => ({
      ...prev,
      indicators: [...(prev.indicators || []), indicator]
    }));
  };

  const handleSave = () => {
    saveStrategy(strategy);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Strategy Builder</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3>Available Indicators</h3>
          <div className="space-y-2">
            <Button onClick={() => addIndicator('SMA')}>SMA</Button>
            <Button onClick={() => addIndicator('EMA')}>EMA</Button>
            <Button onClick={() => addIndicator('RSI')}>RSI</Button>
            <Button onClick={() => addIndicator('MACD')}>MACD</Button>
          </div>
        </div>
        <div>
          <h3>Strategy Configuration</h3>
          <Card>
            <CardHeader>
              <CardTitle>Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              {strategy.indicators?.map((indicator: string, index: number) => (
                <div key={index}>{indicator}</div>
              ))}
            </CardContent>
          </Card>
          <Button onClick={handleSave} className="mt-4">Save Strategy</Button>
        </div>
      </div>
    </div>
  );
};
```
