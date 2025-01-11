import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Settings as SettingsIcon, User, Bell, DollarSign, Shield, AlertCircle } from 'lucide-react';
export function Settings() {
    const { session } = useAuth();
    const queryClient = useQueryClient();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { data: profile, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', session?.user?.id)
                .single();
            if (error)
                throw error;
            return data;
        },
        enabled: !!session?.user?.id,
    });
    const updateProfile = useMutation({
        mutationFn: async (data) => {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                user_id: session?.user?.id,
                ...data,
                updated_at: new Date().toISOString(),
            });
            if (error)
                throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
    });
    React.useEffect(() => {
        if (profile) {
            Object.entries(profile).forEach(([key, value]) => {
                if (typeof value === 'string' || (typeof value === 'object' && value !== null)) {
                    setValue(key, value);
                }
            });
        }
    }, [profile, setValue]);
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" }) }));
    }
    return (_jsx("div", { className: "max-w-4xl mx-auto px-4 py-8", children: _jsxs("div", { className: "bg-white shadow-lg rounded-lg overflow-hidden", children: [_jsxs("div", { className: "px-6 py-4 border-b border-gray-200 flex items-center", children: [_jsx(SettingsIcon, { className: "w-6 h-6 text-gray-500 mr-2" }), _jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Settings" })] }), _jsxs("form", { onSubmit: handleSubmit((data) => updateProfile.mutate(data)), className: "p-6 space-y-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("h3", { className: "text-lg font-medium flex items-center", children: [_jsx(User, { className: "w-5 h-5 mr-2 text-gray-500" }), "Profile Information"] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Full Name" }), _jsx("input", { type: "text", ...register('full_name', { required: 'Full name is required' }), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" }), errors.full_name && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.full_name.message }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Bio" }), _jsx("textarea", { ...register('bio'), rows: 3, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Avatar URL" }), _jsx("input", { type: "url", ...register('avatar_url'), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("h3", { className: "text-lg font-medium flex items-center", children: [_jsx(DollarSign, { className: "w-5 h-5 mr-2 text-gray-500" }), "Investment Preferences"] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Investment Experience" }), _jsxs("select", { ...register('investment_experience'), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500", children: [_jsx("option", { value: "beginner", children: "Beginner" }), _jsx("option", { value: "intermediate", children: "Intermediate" }), _jsx("option", { value: "advanced", children: "Advanced" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Risk Tolerance" }), _jsxs("select", { ...register('risk_tolerance'), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500", children: [_jsx("option", { value: "conservative", children: "Conservative" }), _jsx("option", { value: "moderate", children: "Moderate" }), _jsx("option", { value: "aggressive", children: "Aggressive" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Preferred Currency" }), _jsxs("select", { ...register('preferred_currency'), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500", children: [_jsx("option", { value: "USD", children: "USD" }), _jsx("option", { value: "EUR", children: "EUR" }), _jsx("option", { value: "GBP", children: "GBP" }), _jsx("option", { value: "JPY", children: "JPY" })] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("h3", { className: "text-lg font-medium flex items-center", children: [_jsx(Bell, { className: "w-5 h-5 mr-2 text-gray-500" }), "Notification Preferences"] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", ...register('notification_preferences.email'), className: "rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500" }), _jsx("label", { className: "ml-2 block text-sm text-gray-700", children: "Email Notifications" })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", ...register('notification_preferences.push'), className: "rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500" }), _jsx("label", { className: "ml-2 block text-sm text-gray-700", children: "Push Notifications" })] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("h3", { className: "text-lg font-medium flex items-center", children: [_jsx(Shield, { className: "w-5 h-5 mr-2 text-gray-500" }), "Security"] }), _jsxs("div", { className: "bg-gray-50 p-4 rounded-md", children: [_jsxs("p", { className: "text-sm text-gray-600", children: ["Email: ", session?.user?.email] }), _jsx("button", { type: "button", onClick: () => { }, className: "mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", children: "Change Password" })] })] }), updateProfile.isError && (_jsx("div", { className: "rounded-md bg-red-50 p-4", children: _jsxs("div", { className: "flex", children: [_jsx(AlertCircle, { className: "h-5 w-5 text-red-400" }), _jsx("div", { className: "ml-3", children: _jsx("h3", { className: "text-sm font-medium text-red-800", children: "Error updating profile" }) })] }) })), _jsx("div", { className: "flex justify-end", children: _jsxs("button", { type: "submit", disabled: updateProfile.isPending, className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", children: [updateProfile.isPending ? (_jsx("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" })) : null, "Save Changes"] }) })] })] }) }));
}
