import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogIn, UserPlus, ArrowLeft } from 'lucide-react';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
import { Button } from './ui/button';
export function AuthForm({ type }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [captchaError, setCaptchaError] = useState('');
    const [userCaptcha, setUserCaptcha] = useState('');
    const [authError, setAuthError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        if (type === 'signup') {
            loadCaptchaEnginge(6);
        }
    }, [type]);
    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            setAuthError('');
            if (type === 'signup') {
                if (!validateCaptcha(userCaptcha)) {
                    setCaptchaError('Invalid captcha');
                    return;
                }
                const { data: signUpData, error } = await supabase.auth.signUp({
                    email: data.email,
                    password: data.password,
                });
                if (error) {
                    if (error.message === 'User already registered') {
                        setAuthError('An account with this email already exists. Please sign in instead.');
                    }
                    else {
                        setAuthError(error.message);
                    }
                    return;
                }
                if (signUpData.user) {
                    navigate('/dashboard', { replace: true });
                }
            }
            else {
                const { data: signInData, error } = await supabase.auth.signInWithPassword({
                    email: data.email,
                    password: data.password,
                });
                if (error) {
                    setAuthError('Invalid email or password');
                    return;
                }
                if (signInData.user) {
                    navigate('/dashboard', { replace: true });
                }
            }
        }
        catch (error) {
            console.error('Authentication error:', error);
            setAuthError('An unexpected error occurred. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8", children: [_jsx("div", { className: "sm:mx-auto sm:w-full sm:max-w-md mb-8", children: _jsxs(Button, { variant: "ghost", onClick: () => navigate('/'), className: "flex items-center gap-2 text-gray-600 hover:text-gray-900", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), "Back to Home"] }) }), _jsxs("div", { className: "sm:mx-auto sm:w-full sm:max-w-md", children: [_jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: type === 'login' ? 'Sign in to your account' : 'Create a new account' }), type === 'login' && (_jsxs("p", { className: "mt-2 text-center text-sm text-gray-600", children: ["Or", ' ', _jsx(Link, { to: "/signup", className: "font-medium text-blue-600 hover:text-blue-500", children: "create a new account" })] })), type === 'signup' && (_jsxs("p", { className: "mt-2 text-center text-sm text-gray-600", children: ["Already have an account?", ' ', _jsx(Link, { to: "/login", className: "font-medium text-blue-600 hover:text-blue-500", children: "Sign in" })] }))] }), _jsx("div", { className: "mt-8 sm:mx-auto sm:w-full sm:max-w-md", children: _jsxs("div", { className: "bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10", children: [authError && (_jsx("div", { className: "mb-4 p-3 rounded-md bg-red-50 border border-red-200", children: _jsx("p", { className: "text-sm text-red-600", children: authError }) })), _jsxs("form", { className: "space-y-6", onSubmit: handleSubmit(onSubmit), children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "Email address" }), _jsxs("div", { className: "mt-1", children: [_jsx("input", { id: "email", type: "email", autoComplete: "email", ...register('email', {
                                                        required: 'Email is required',
                                                        pattern: {
                                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                            message: 'Invalid email address'
                                                        }
                                                    }), className: "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" }), errors.email && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.email.message }))] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: "Password" }), _jsxs("div", { className: "mt-1", children: [_jsx("input", { id: "password", type: "password", autoComplete: type === 'login' ? 'current-password' : 'new-password', ...register('password', {
                                                        required: 'Password is required',
                                                        minLength: {
                                                            value: 6,
                                                            message: 'Password must be at least 6 characters'
                                                        }
                                                    }), className: "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" }), errors.password && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.password.message }))] })] }), type === 'signup' && (_jsxs("div", { children: [_jsx("label", { htmlFor: "captcha", className: "block text-sm font-medium text-gray-700", children: "Verify Captcha" }), _jsxs("div", { className: "mt-1", children: [_jsx(LoadCanvasTemplate, {}), _jsx("input", { id: "captcha", type: "text", value: userCaptcha, onChange: (e) => {
                                                        setUserCaptcha(e.target.value);
                                                        setCaptchaError('');
                                                    }, className: "mt-2 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500", placeholder: "Enter captcha" }), captchaError && (_jsx("p", { className: "mt-2 text-sm text-red-600", children: captchaError }))] })] })), _jsx("div", { children: _jsxs("button", { type: "submit", disabled: isLoading, className: "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed", children: [isLoading ? (_jsx("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" })) : type === 'login' ? (_jsx(LogIn, { className: "w-5 h-5 mr-2" })) : (_jsx(UserPlus, { className: "w-5 h-5 mr-2" })), type === 'login' ? 'Sign in' : 'Sign up'] }) })] })] }) })] }));
}
