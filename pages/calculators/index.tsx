import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

const calculators = [
  { label: 'Savings Calculator', route: '/calculators/savings' },
  { label: 'Compound Interest', route: '/calculators/compound-interest' },
  { label: 'Inflation Calculator', route: '/calculators/inflation' },
  { label: 'Retirement Calculator', route: '/calculators/retirement' },
  { label: 'Mortgage', route: '/calculators/mortgage' },
  { label: 'Debt Payoff', route: '/calculators/debt-payoff' },
  { label: 'Fee Impact', route: '/calculators/fee-impact' },
];

export default function CalculatorsHub() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Financial Calculators</h1>
      <div className="bg-muted/10 p-4 rounded shadow">
        <ul className="space-y-2">
          {calculators.map((calc) => (
            <li key={calc.route}>
              <Link href={calc.route} className="text-primary hover:underline">
                {calc.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </DashboardLayout>
  );
}
