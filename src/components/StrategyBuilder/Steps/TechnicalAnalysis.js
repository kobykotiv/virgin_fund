import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useStrategy } from '@/context/StrategyContext';
import { TrendingUp, Activity, BarChart2 } from 'lucide-react';
const TechnicalAnalysisSchema = z.object({
    technicalIndicators: z.array(z.object({
        type: z.enum(['SMA', 'EMA', 'RSI', 'MACD', 'BB']),
        parameters: z.record(z.number()),
    })).max(3),
});
const INDICATOR_PRESETS = {
    SMA: { period: 20 },
    EMA: { period: 12 },
    RSI: { period: 14, overbought: 70, oversold: 30 },
    MACD: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
    BB: { period: 20, standardDeviations: 2 },
};
export default function TechnicalAnalysis() {
    const { state, dispatch } = useStrategy();
    const [selectedIndicator, setSelectedIndicator] = React.useState(null);
    const form = useForm({
        resolver: zodResolver(TechnicalAnalysisSchema),
        defaultValues: {
            technicalIndicators: state.formData.technicalIndicators || [],
        },
    });
    const onSubmit = (data) => {
        dispatch({ type: 'UPDATE_FORM', payload: data });
        dispatch({ type: 'SET_STEP', payload: 4 });
    };
    const addIndicator = (type) => {
        const currentIndicators = form.getValues('technicalIndicators') || [];
        if (currentIndicators.length >= 3)
            return;
        form.setValue('technicalIndicators', [
            ...currentIndicators,
            { type, parameters: INDICATOR_PRESETS[type] },
        ]);
        setSelectedIndicator(null);
    };
    const removeIndicator = (index) => {
        const currentIndicators = form.getValues('technicalIndicators') || [];
        form.setValue('technicalIndicators', currentIndicators.filter((_, i) => i !== index));
    };
    return (_jsx("form", { onSubmit: form.handleSubmit(onSubmit), children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Technical Analysis" }), _jsx(CardDescription, { children: "Add up to 3 technical indicators to enhance your strategy." })] }), _jsxs(CardContent, { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("button", { type: "button", onClick: () => setSelectedIndicator('SMA'), className: "p-4 rounded-lg border bg-card hover:bg-accent transition-colors", children: [_jsx(TrendingUp, { className: "w-6 h-6 mb-2" }), _jsx("h3", { className: "font-medium", children: "Moving Averages" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Simple and exponential moving averages" })] }), _jsxs("button", { type: "button", onClick: () => setSelectedIndicator('RSI'), className: "p-4 rounded-lg border bg-card hover:bg-accent transition-colors", children: [_jsx(Activity, { className: "w-6 h-6 mb-2" }), _jsx("h3", { className: "font-medium", children: "Momentum" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "RSI and other momentum indicators" })] }), _jsxs("button", { type: "button", onClick: () => setSelectedIndicator('BB'), className: "p-4 rounded-lg border bg-card hover:bg-accent transition-colors", children: [_jsx(BarChart2, { className: "w-6 h-6 mb-2" }), _jsx("h3", { className: "font-medium", children: "Volatility" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Bollinger Bands and ATR" })] })] }), selectedIndicator && (_jsxs("div", { className: "p-4 rounded-lg border bg-muted", children: [_jsxs("h3", { className: "font-medium mb-4", children: ["Configure ", selectedIndicator] }), _jsxs("div", { className: "space-y-4", children: [Object.entries(INDICATOR_PRESETS[selectedIndicator]).map(([param, defaultValue]) => (_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: param }), _jsx(Input, { type: "number", defaultValue: defaultValue })] }, param))), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => setSelectedIndicator(null), children: "Cancel" }), _jsx(Button, { type: "button", onClick: () => addIndicator(selectedIndicator), children: "Add Indicator" })] })] })] })), _jsx("div", { className: "space-y-4", children: form.watch('technicalIndicators')?.map((indicator, index) => (_jsxs("div", { className: "flex items-center justify-between p-4 rounded-lg border bg-card", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium", children: indicator.type }), _jsx("p", { className: "text-sm text-muted-foreground", children: Object.entries(indicator.parameters)
                                                    .map(([key, value]) => `${key}: ${value}`)
                                                    .join(', ') })] }), _jsx(Button, { type: "button", variant: "ghost", onClick: () => removeIndicator(index), children: "Remove" })] }, index))) })] }), _jsxs(CardFooter, { className: "flex justify-between", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => dispatch({ type: 'SET_STEP', payload: 2 }), children: "Back" }), _jsx(Button, { type: "submit", children: "Continue" })] })] }) }));
}
