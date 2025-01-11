import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useStrategy } from '@/context/StrategyContext';
import { useConfetti } from '@/components/ui/confetti';
import { Shield, TrendingDown, TrendingUp } from 'lucide-react';
const RiskManagementSchema = z.object({
    riskManagement: z.object({
        stopLoss: z.number().min(0).max(100),
        takeProfit: z.number().min(0),
        trailingStop: z.number().min(0).max(100).optional(),
        positionSize: z.number().min(0).max(100),
    }),
});
export default function RiskManagement() {
    const { state, dispatch } = useStrategy();
    const triggerConfetti = useConfetti();
    const form = useForm({
        resolver: zodResolver(RiskManagementSchema),
        defaultValues: {
            riskManagement: state.formData.riskManagement || {
                stopLoss: 10,
                takeProfit: 20,
                trailingStop: 5,
                positionSize: 5,
            },
        },
    });
    const onSubmit = (data) => {
        dispatch({ type: 'UPDATE_FORM', payload: data });
        triggerConfetti();
        // Navigate to success/review page
    };
    const calculateRiskReward = () => {
        const { stopLoss, takeProfit } = form.watch('riskManagement');
        return takeProfit / stopLoss;
    };
    return (_jsx("form", { onSubmit: form.handleSubmit(onSubmit), children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Risk Management" }), _jsx(CardDescription, { children: "Configure your risk management parameters to protect your investment." })] }), _jsxs(CardContent, { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-8", children: [_jsxs("div", { className: "p-4 rounded-lg border bg-card", children: [_jsx(Shield, { className: "w-6 h-6 mb-2 text-primary" }), _jsx("h3", { className: "font-medium", children: "Risk Protection" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Set stop-loss to protect your capital" })] }), _jsxs("div", { className: "p-4 rounded-lg border bg-card", children: [_jsx(TrendingUp, { className: "w-6 h-6 mb-2 text-green-500" }), _jsx("h3", { className: "font-medium", children: "Profit Targets" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Define take-profit levels" })] }), _jsxs("div", { className: "p-4 rounded-lg border bg-card", children: [_jsx(TrendingDown, { className: "w-6 h-6 mb-2 text-blue-500" }), _jsx("h3", { className: "font-medium", children: "Position Sizing" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Manage exposure per trade" })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Stop Loss (%)" }), _jsx(Slider, { value: [form.watch('riskManagement.stopLoss')], onValueChange: ([value]) => form.setValue('riskManagement.stopLoss', value), min: 0, max: 100, step: 1, className: "py-4" }), _jsx(Input, { type: "number", ...form.register('riskManagement.stopLoss', { valueAsNumber: true }), className: "w-24" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Take Profit (%)" }), _jsx(Slider, { value: [form.watch('riskManagement.takeProfit')], onValueChange: ([value]) => form.setValue('riskManagement.takeProfit', value), min: 0, max: 200, step: 1, className: "py-4" }), _jsx(Input, { type: "number", ...form.register('riskManagement.takeProfit', { valueAsNumber: true }), className: "w-24" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Trailing Stop (%)" }), _jsx(Slider, { value: [form.watch('riskManagement.trailingStop') || 0], onValueChange: ([value]) => form.setValue('riskManagement.trailingStop', value), min: 0, max: 100, step: 1, className: "py-4" }), _jsx(Input, { type: "number", ...form.register('riskManagement.trailingStop', { valueAsNumber: true }), className: "w-24" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Position Size per Trade (%)" }), _jsx(Slider, { value: [form.watch('riskManagement.positionSize')], onValueChange: ([value]) => form.setValue('riskManagement.positionSize', value), min: 0, max: 100, step: 1, className: "py-4" }), _jsx(Input, { type: "number", ...form.register('riskManagement.positionSize', { valueAsNumber: true }), className: "w-24" })] })] }), _jsxs("div", { className: "p-4 rounded-lg bg-muted", children: [_jsx("h4", { className: "font-medium mb-2", children: "Risk/Reward Ratio" }), _jsx("p", { className: "text-2xl font-bold", children: calculateRiskReward().toFixed(2) }), _jsx("p", { className: "text-sm text-muted-foreground", children: "A ratio above 1:2 is recommended for optimal risk management" })] })] }), _jsxs(CardFooter, { className: "flex justify-between", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => dispatch({ type: 'SET_STEP', payload: 3 }), children: "Back" }), _jsx(Button, { type: "submit", children: "Complete Strategy" })] })] }) }));
}
