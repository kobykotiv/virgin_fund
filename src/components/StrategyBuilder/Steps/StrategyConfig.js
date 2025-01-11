import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useStrategy } from '@/context/StrategyContext';
import { Info } from 'lucide-react';
const StrategyConfigSchema = z.object({
    strategyType: z.enum(['DCA', 'TRADER', 'GRID']),
    strategyConfig: z.object({
        investmentAmount: z.number().min(1),
        frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']),
        rebalanceThreshold: z.number().min(1).max(100).optional(),
    }),
});
export default function StrategyConfig() {
    const { state, dispatch } = useStrategy();
    const form = useForm({
        resolver: zodResolver(StrategyConfigSchema),
        defaultValues: {
            strategyType: state.formData.strategyType || 'DCA',
            strategyConfig: state.formData.strategyConfig || {
                investmentAmount: 100,
                frequency: 'monthly',
                rebalanceThreshold: 5,
            },
        },
    });
    const onSubmit = (data) => {
        dispatch({ type: 'UPDATE_FORM', payload: data });
        dispatch({ type: 'SET_STEP', payload: 3 });
    };
    return (_jsx("form", { onSubmit: form.handleSubmit(onSubmit), children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Strategy Configuration" }), _jsx(CardDescription, { children: "Choose your strategy type and configure its parameters." })] }), _jsxs(CardContent, { className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Strategy Type" }), _jsxs(Select, { onValueChange: (value) => form.setValue('strategyType', value), defaultValue: form.getValues('strategyType'), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select a strategy type" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "DCA", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx("span", { children: "Dollar Cost Averaging" }), _jsx(Info, { className: "w-4 h-4 text-muted-foreground" })] }) }), _jsx(SelectItem, { value: "TRADER", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx("span", { children: "Active Trading" }), _jsx(Info, { className: "w-4 h-4 text-muted-foreground" })] }) }), _jsx(SelectItem, { value: "GRID", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx("span", { children: "Grid Trading" }), _jsx(Info, { className: "w-4 h-4 text-muted-foreground" })] }) })] })] })] }), _jsxs("div", { className: "space-y-4 rounded-lg border p-4 bg-muted/50", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Investment Amount ($)" }), _jsx(Input, { type: "number", ...form.register('strategyConfig.investmentAmount', { valueAsNumber: true }), min: 1 })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Investment Frequency" }), _jsxs(Select, { onValueChange: (value) => form.setValue('strategyConfig.frequency', value), defaultValue: form.getValues('strategyConfig.frequency'), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select frequency" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "daily", children: "Daily" }), _jsx(SelectItem, { value: "weekly", children: "Weekly" }), _jsx(SelectItem, { value: "monthly", children: "Monthly" }), _jsx(SelectItem, { value: "quarterly", children: "Quarterly" }), _jsx(SelectItem, { value: "yearly", children: "Yearly" })] })] })] }), form.watch('strategyType') !== 'DCA' && (_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Rebalance Threshold (%)" }), _jsx(Input, { type: "number", ...form.register('strategyConfig.rebalanceThreshold', { valueAsNumber: true }), min: 1, max: 100 })] }))] })] }), _jsxs(CardFooter, { className: "flex justify-between", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => dispatch({ type: 'SET_STEP', payload: 1 }), children: "Back" }), _jsx(Button, { type: "submit", children: "Continue" })] })] }) }));
}
