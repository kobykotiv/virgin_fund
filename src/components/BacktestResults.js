import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { useConfetti } from './ui/confetti';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
export function BacktestResults({ results, onSave, onRetest }) {
    const triggerConfetti = useConfetti();
    const isPositiveROI = results.roi > 0;
    React.useEffect(() => {
        if (isPositiveROI) {
            triggerConfetti();
        }
    }, [isPositiveROI, triggerConfetti]);
    const chartData = {
        labels: results.transactions.map(t => new Date(t.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Portfolio Value',
                data: results.transactions.map(t => t.amount),
                fill: true,
                borderColor: isPositiveROI ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
                backgroundColor: isPositiveROI ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
            },
        ],
    };
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'rgb(255, 255, 255)',
                bodyColor: 'rgb(255, 255, 255)',
                borderColor: isPositiveROI ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };
    return (_jsx("div", { className: "space-y-6", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Backtest Results" }), _jsx(CardDescription, { children: "Strategy performance analysis and metrics" })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-8", children: [_jsxs("div", { className: "bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(DollarSign, { className: "w-5 h-5 text-primary" }), _jsx("p", { className: "text-sm font-medium text-primary", children: "Total Investment" })] }), _jsxs("p", { className: "text-2xl font-bold", children: ["$", results.totalInvestment.toLocaleString()] })] }), _jsxs("div", { className: `bg-gradient-to-br ${isPositiveROI
                                        ? 'from-green-500/10 to-green-500/5 border-green-500/20'
                                        : 'from-red-500/10 to-red-500/5 border-red-500/20'} p-4 rounded-lg border`, children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [isPositiveROI
                                                    ? _jsx(TrendingUp, { className: "w-5 h-5 text-green-500" })
                                                    : _jsx(TrendingDown, { className: "w-5 h-5 text-red-500" }), _jsx("p", { className: "text-sm font-medium", children: "Current Value" })] }), _jsxs("p", { className: "text-2xl font-bold", children: ["$", results.currentValue.toLocaleString()] })] }), _jsxs("div", { className: "bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-4 rounded-lg border border-purple-500/20", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Activity, { className: "w-5 h-5 text-purple-500" }), _jsx("p", { className: "text-sm font-medium text-purple-600", children: "ROI" })] }), _jsxs("p", { className: "text-2xl font-bold", children: [results.roi.toFixed(2), "%"] })] }), _jsxs("div", { className: "bg-gradient-to-br from-red-500/10 to-red-500/5 p-4 rounded-lg border border-red-500/20", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(TrendingDown, { className: "w-5 h-5 text-red-500" }), _jsx("p", { className: "text-sm font-medium text-red-600", children: "Max Drawdown" })] }), _jsxs("p", { className: "text-2xl font-bold", children: [(results.maxDrawdown * 100).toFixed(2), "%"] })] })] }), _jsx("div", { className: "h-[300px]", children: _jsx(Line, { data: chartData, options: chartOptions }) }), _jsxs("div", { className: "flex justify-end gap-4 mt-6", children: [_jsx(Button, { variant: "outline", onClick: onRetest, children: "Edit & Retest" }), _jsx(Button, { onClick: onSave, children: "Save Strategy" })] })] })] }) }));
}
