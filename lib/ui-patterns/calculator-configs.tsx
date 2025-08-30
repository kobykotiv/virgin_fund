// =============================================================================
// Calculator Configurations - Declarative Setup
// =============================================================================

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CalculatorConfig } from './declarative-calculator';

export const COMPOUND_INTEREST_CONFIG: CalculatorConfig<any> = {
  id: 'compound-interest',
  title: 'Compound Interest Calculator',
  description: 'Calculate how your investment will grow over time with compound interest.',
  fields: [
    {
      name: 'principal',
      label: 'Principal Amount ($)',
      type: 'number',
      defaultValue: 1000,
      validation: { required: true, min: 0 },
      placeholder: 'Enter principal amount',
    },
    {
      name: 'rate',
      label: 'Annual Interest Rate (%)',
      type: 'slider',
      defaultValue: 5,
      validation: { required: true, min: 0, max: 20, step: 0.1 },
      format: (value: number) => `${value}%`,
    },
    {
      name: 'time',
      label: 'Time Period (Years)',
      type: 'slider',
      defaultValue: 10,
      validation: { required: true, min: 1, max: 50, step: 1 },
      format: (value: number) => `${value} years`,
    },
    {
      name: 'compoundFrequency',
      label: 'Compound Frequency',
      type: 'select',
      defaultValue: 'annually',
      validation: {
        required: true,
        options: [
          { value: 'annually', label: 'Annually' },
          { value: 'semi-annually', label: 'Semi-annually' },
          { value: 'quarterly', label: 'Quarterly' },
          { value: 'monthly', label: 'Monthly' },
          { value: 'daily', label: 'Daily' },
        ],
      },
    },
  ],
  calculate: (values: any) => {
    const { principal, rate, time, compoundFrequency } = values;

    // Determine compounding periods per year
    let n = 1;
    switch (compoundFrequency) {
      case 'monthly': n = 12; break;
      case 'quarterly': n = 4; break;
      case 'semi-annually': n = 2; break;
      case 'daily': n = 365; break;
    }

    const data = [];
    for (let year = 0; year <= time; year++) {
      const amount = principal * Math.pow(1 + rate / 100 / n, n * year);
      data.push({
        year,
        amount: Math.round(amount),
      });
    }

    return { data, finalAmount: data[data.length - 1].amount };
  },
  renderResult: (result: any) => (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-2xl font-bold text-green-600">
          Final Amount: ${result.finalAmount.toLocaleString()}
        </p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={result.data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
          <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']} />
          <Legend />
          <Line type="monotone" dataKey="amount" stroke="#82ca9d" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  ),
};

export const MORTGAGE_CONFIG: CalculatorConfig<any> = {
  id: 'mortgage',
  title: 'Mortgage Calculator',
  description: 'Calculate your monthly mortgage payments and total costs.',
  fields: [
    {
      name: 'price',
      label: 'Home Price ($)',
      type: 'number',
      defaultValue: 300000,
      validation: { required: true, min: 0 },
      placeholder: 'Enter home price',
    },
    {
      name: 'downPayment',
      label: 'Down Payment ($)',
      type: 'number',
      defaultValue: 60000,
      validation: { required: true, min: 0 },
      placeholder: 'Enter down payment',
    },
    {
      name: 'rate',
      label: 'Interest Rate (%)',
      type: 'number',
      defaultValue: 4.5,
      validation: { required: true, min: 0, max: 20, step: 0.1 },
      placeholder: 'Enter interest rate',
    },
    {
      name: 'term',
      label: 'Loan Term',
      type: 'select',
      defaultValue: 30,
      validation: {
        required: true,
        options: [
          { value: 15, label: '15 years' },
          { value: 20, label: '20 years' },
          { value: 30, label: '30 years' },
        ],
      },
    },
  ],
  calculate: (values: any) => {
    const { price, downPayment, rate, term } = values;
    const principal = price - downPayment;
    const monthlyRate = rate / 100 / 12;
    const payments = term * 12;

    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, payments)) /
      (Math.pow(1 + monthlyRate, payments) - 1);

    const totalPayment = monthlyPayment * payments;
    const totalInterest = totalPayment - principal;

    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
      principal,
      pieData: [
        { name: 'Principal', value: principal, color: '#0088FE' },
        { name: 'Interest', value: totalInterest, color: '#FF8042' },
      ],
    };
  },
  renderResult: (result: any) => {
    const COLORS = ['#0088FE', '#FF8042'];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm font-medium">Monthly Payment</p>
            <p className="text-2xl font-bold">${result.monthlyPayment.toFixed(2)}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm font-medium">Total Cost</p>
            <p className="text-2xl font-bold">${result.totalPayment.toFixed(2)}</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={result.pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {result.pieData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  },
};

export const SAVINGS_CONFIG: CalculatorConfig<any> = {
  id: 'savings',
  title: 'Savings Calculator',
  description: 'Calculate how your savings will grow over time.',
  fields: [
    {
      name: 'initialAmount',
      label: 'Initial Amount ($)',
      type: 'number',
      defaultValue: 1000,
      validation: { required: true, min: 0 },
      placeholder: 'Enter initial amount',
    },
    {
      name: 'monthlyContribution',
      label: 'Monthly Contribution ($)',
      type: 'number',
      defaultValue: 200,
      validation: { required: true, min: 0 },
      placeholder: 'Enter monthly contribution',
    },
    {
      name: 'rate',
      label: 'Annual Interest Rate (%)',
      type: 'slider',
      defaultValue: 3,
      validation: { required: true, min: 0, max: 10, step: 0.1 },
      format: (value: number) => `${value}%`,
    },
    {
      name: 'time',
      label: 'Time Period (Years)',
      type: 'slider',
      defaultValue: 20,
      validation: { required: true, min: 1, max: 50, step: 1 },
      format: (value: number) => `${value} years`,
    },
  ],
  calculate: (values: any) => {
    const { initialAmount, monthlyContribution, rate, time } = values;
    const monthlyRate = rate / 100 / 12;
    const months = time * 12;

    let balance = initialAmount;
    const data = [{ month: 0, balance: initialAmount }];

    for (let month = 1; month <= months; month++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
      if (month % 12 === 0) {
        data.push({ month: month / 12, balance: Math.round(balance) });
      }
    }

    return {
      data,
      finalBalance: Math.round(balance),
      totalContributions: initialAmount + (monthlyContribution * months),
      totalInterest: Math.round(balance - initialAmount - (monthlyContribution * months)),
    };
  },
  renderResult: (result: any) => (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-muted text-center">
          <p className="text-sm font-medium">Final Balance</p>
          <p className="text-xl font-bold text-green-600">${result.finalBalance.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-lg bg-muted text-center">
          <p className="text-sm font-medium">Total Contributions</p>
          <p className="text-xl font-bold">${result.totalContributions.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-lg bg-muted text-center">
          <p className="text-sm font-medium">Interest Earned</p>
          <p className="text-xl font-bold text-blue-600">${result.totalInterest.toLocaleString()}</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={result.data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" label={{ value: 'Years', position: 'insideBottomRight', offset: -10 }} />
          <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
          <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Balance']} />
          <Legend />
          <Line type="monotone" dataKey="balance" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  ),
};

// Export all calculator configurations
export const CALCULATOR_CONFIGS = {
  'compound-interest': COMPOUND_INTEREST_CONFIG,
  'mortgage': MORTGAGE_CONFIG,
  'savings': SAVINGS_CONFIG,
} as const;

export type CalculatorType = keyof typeof CALCULATOR_CONFIGS;
