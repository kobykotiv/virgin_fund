import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Calculator, X, AlertCircle, Save } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { StockSearch } from './StockSearch';
export function StrategyForm() {
    const { session } = useAuth();
    const [selectedAssets, setSelectedAssets] = React.useState([]);
    const [error, setError] = React.useState('');
    const navigate = useNavigate();
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            frequency: 'monthly',
            durationYears: 1,
            initialInvestment: 1000
        }
    });
    const handleAssetSelect = (symbol) => {
        if (selectedAssets.length < 10 && !selectedAssets.includes(symbol)) {
            setSelectedAssets([...selectedAssets, symbol]);
        }
    };
    const handleAssetRemove = (symbol) => {
        setSelectedAssets(selectedAssets.filter(s => s !== symbol));
    };
    const onSubmit = async (data) => {
        try {
            if (!session?.user) {
                setError('You must be logged in to create a strategy');
                return;
            }
            if (selectedAssets.length === 0) {
                setError('Please select at least one asset');
                return;
            }
            const { error: insertError } = await supabase.from('strategies').insert({
                name: data.name,
                initial_investment: data.initialInvestment,
                frequency: data.frequency,
                duration_years: data.durationYears,
                assets: selectedAssets,
                start_date: new Date().toISOString(),
                user_id: session.user.id,
            });
            if (insertError) {
                console.error('Error creating strategy:', insertError);
                setError(insertError.message);
                return;
            }
            navigate('/dashboard');
        }
        catch (error) {
            console.error('Error creating strategy:', error);
            setError('An unexpected error occurred');
        }
    };
    return (_jsx("div", { className: "max-w-4xl mx-auto px-4 py-8", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Calculator, { className: "w-6 h-6" }), "Create New Investment Strategy"] }) }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), children: [_jsxs(CardContent, { className: "space-y-6", children: [error && (_jsxs("div", { className: "flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md", children: [_jsx(AlertCircle, { className: "w-4 h-4" }), error] })), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "name", children: "Strategy Name" }), _jsx(Controller, { name: "name", control: control, rules: { required: 'Strategy name is required' }, render: ({ field }) => (_jsx(Input, { id: "name", placeholder: "My Investment Strategy", ...field })) }), errors.name && (_jsx("p", { className: "text-sm text-red-600", children: errors.name.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "initialInvestment", children: "Initial Investment ($)" }), _jsx(Controller, { name: "initialInvestment", control: control, rules: {
                                                required: 'Initial investment is required',
                                                min: { value: 100, message: 'Minimum investment is $100' },
                                                max: { value: 100000, message: 'Maximum investment is $100,000' }
                                            }, render: ({ field }) => (_jsx(Input, { id: "initialInvestment", type: "number", min: "100", max: "100000", ...field })) }), errors.initialInvestment && (_jsx("p", { className: "text-sm text-red-600", children: errors.initialInvestment.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "frequency", children: "Investment Frequency" }), _jsx(Controller, { name: "frequency", control: control, rules: { required: 'Frequency is required' }, render: ({ field }) => (_jsxs(Select, { onValueChange: field.onChange, defaultValue: field.value, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select frequency" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "daily", children: "Daily" }), _jsx(SelectItem, { value: "weekly", children: "Weekly" }), _jsx(SelectItem, { value: "monthly", children: "Monthly" }), _jsx(SelectItem, { value: "quarterly", children: "Quarterly" }), _jsx(SelectItem, { value: "yearly", children: "Yearly" })] })] })) }), errors.frequency && (_jsx("p", { className: "text-sm text-red-600", children: errors.frequency.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "durationYears", children: "Duration (Years)" }), _jsx(Controller, { name: "durationYears", control: control, rules: {
                                                required: 'Duration is required',
                                                min: { value: 1, message: 'Minimum duration is 1 year' },
                                                max: { value: 20, message: 'Maximum duration is 20 years' }
                                            }, render: ({ field }) => (_jsx(Input, { id: "durationYears", type: "number", min: "1", max: "20", ...field })) }), errors.durationYears && (_jsx("p", { className: "text-sm text-red-600", children: errors.durationYears.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Select Assets (Max 10)" }), _jsx(StockSearch, { onSelect: handleAssetSelect, selectedAssets: selectedAssets }), _jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: selectedAssets.map((symbol) => (_jsxs("div", { className: "flex items-center gap-1 px-2 py-1 text-sm bg-primary/10 text-primary rounded", children: [symbol, _jsx("button", { type: "button", onClick: () => handleAssetRemove(symbol), className: "text-primary hover:text-primary/80", children: _jsx(X, { className: "w-3 h-3" }) })] }, symbol))) })] })] }), _jsxs(CardFooter, { className: "flex justify-end space-x-4", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => navigate('/dashboard'), children: "Cancel" }), _jsxs(Button, { type: "submit", children: [_jsx(Save, { className: "w-4 h-4 mr-2" }), "Create Strategy"] })] })] })] }) }));
}
