import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StockSearch } from '@/components/StockSearch';
import { SearchHelpPopover } from '@/components/ui/search-help-popover';
import { useStrategy } from '@/context/StrategyContext';
import { AssetSchema } from '@/types/strategy';
const BasicInfoSchema = z.object({
    name: z.string().min(1, "Strategy name is required"),
    description: z.string(),
    selectedAssets: z.array(AssetSchema).min(1, "Select at least one asset").max(20, "Maximum 20 assets allowed"),
});
export default function BasicInfo() {
    const { state, dispatch } = useStrategy();
    const form = useForm({
        resolver: zodResolver(BasicInfoSchema),
        defaultValues: {
            name: state.formData.name || '',
            description: state.formData.description || '',
            selectedAssets: state.formData.selectedAssets || [],
        },
    });
    const onSubmit = (data) => {
        dispatch({ type: 'UPDATE_FORM', payload: data });
        dispatch({ type: 'SET_STEP', payload: 2 });
    };
    return (_jsx("form", { onSubmit: form.handleSubmit(onSubmit), children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Basic Information" }), _jsx(CardDescription, { children: "Let's start by naming your strategy and selecting the assets you want to trade." })] }), _jsxs(CardContent, { className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "name", children: "Strategy Name" }), _jsx(Input, { id: "name", ...form.register('name'), placeholder: "My Investment Strategy" }), form.formState.errors.name && (_jsx("p", { className: "text-sm text-destructive", children: form.formState.errors.name.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "description", children: "Description" }), _jsx(Textarea, { id: "description", ...form.register('description'), placeholder: "Describe your investment strategy...", className: "h-24" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Label, { children: "Select Assets (Max 20)" }), _jsx(SearchHelpPopover, { className: "text-muted-foreground hover:text-primary transition-colors" })] }), _jsx(StockSearch, { onSelect: (symbol) => {
                                        const currentAssets = form.getValues('selectedAssets') || [];
                                        form.setValue('selectedAssets', [...currentAssets, { symbol, name: symbol }]);
                                    }, selectedAssets: form.watch('selectedAssets')?.map(a => a.symbol) || [] })] })] }), _jsxs(CardFooter, { className: "flex justify-between", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => dispatch({ type: 'SET_STEP', payload: 1 }), children: "Back" }), _jsx(Button, { type: "submit", children: "Continue" })] })] }) }));
}
