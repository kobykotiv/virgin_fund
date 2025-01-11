import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, } from 'chart.js';
import { calculateMetrics } from '../lib/calculations';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);
export function PerformanceMetrics({ strategies }) {
    const currentPrices = {};
    const metrics = strategies.map(strategy => calculateMetrics(strategy.transactions, currentPrices));
    const totalInvestment = strategies.reduce((sum, s) => sum + s.initial_investment, 0);
    const totalValue = metrics.reduce((sum, m) => sum + m.currentValue, 0);
    const avgROI = metrics.reduce((sum, m) => sum + m.roi, 0) / metrics.length;
    const maxDrawdown = Math.max(...metrics.map(m => m.maxDrawdown));
    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Portfolio Value',
                data: [totalInvestment, /* ... historical values ... */ , totalValue],
                fill: true,
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
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
                borderColor: 'rgb(99, 102, 241)',
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
        interaction: {
            intersect: false,
            mode: 'nearest',
        },
    };
    return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Portfolio Performance" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-8", children: [_jsxs("div", { className: "bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(DollarSign, { className: "w-5 h-5 text-primary" }), _jsx("p", { className: "text-sm font-medium text-primary", children: "Total Investment" })] }), _jsxs("p", { className: "text-2xl font-bold", children: ["$", totalInvestment.toLocaleString()] })] }), _jsxs("div", { className: "bg-gradient-to-br from-green-500/10 to-green-500/5 p-4 rounded-lg border border-green-500/20", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(TrendingUp, { className: "w-5 h-5 text-green-500" }), _jsx("p", { className: "text-sm font-medium text-green-600", children: "Current Value" })] }), _jsxs("p", { className: "text-2xl font-bold", children: ["$", totalValue.toLocaleString()] })] }), _jsxs("div", { className: "bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-4 rounded-lg border border-purple-500/20", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Activity, { className: "w-5 h-5 text-purple-500" }), _jsx("p", { className: "text-sm font-medium text-purple-600", children: "Average ROI" })] }), _jsxs("p", { className: "text-2xl font-bold", children: [avgROI.toFixed(2), "%"] })] }), _jsxs("div", { className: "bg-gradient-to-br from-red-500/10 to-red-500/5 p-4 rounded-lg border border-red-500/20", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(TrendingDown, { className: "w-5 h-5 text-red-500" }), _jsx("p", { className: "text-sm font-medium text-red-600", children: "Max Drawdown" })] }), _jsxs("p", { className: "text-2xl font-bold", children: [(maxDrawdown * 100).toFixed(2), "%"] })] })] }), _jsx("div", { className: "h-[300px]", children: _jsx(Line, { data: chartData, options: chartOptions }) })] })] }));
}
