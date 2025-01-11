import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useReducer, useEffect } from 'react';
const initialState = {
    currentStep: 1,
    formData: {},
    isValid: false,
    isDirty: false,
};
const StrategyContext = createContext(null);
function strategyReducer(state, action) {
    switch (action.type) {
        case 'SET_STEP':
            return { ...state, currentStep: action.payload };
        case 'UPDATE_FORM':
            return {
                ...state,
                formData: { ...state.formData, ...action.payload },
                isDirty: true,
            };
        case 'SET_VALID':
            return { ...state, isValid: action.payload };
        case 'SET_DIRTY':
            return { ...state, isDirty: action.payload };
        default:
            return state;
    }
}
export function StrategyProvider({ children }) {
    const [state, dispatch] = useReducer(strategyReducer, initialState);
    // Autosave form data every 30 seconds if dirty
    useEffect(() => {
        if (!state.isDirty)
            return;
        const timer = setTimeout(() => {
            localStorage.setItem('strategyFormData', JSON.stringify(state.formData));
            dispatch({ type: 'SET_DIRTY', payload: false });
        }, 30000);
        return () => clearTimeout(timer);
    }, [state.formData, state.isDirty]);
    return (_jsx(StrategyContext.Provider, { value: { state, dispatch }, children: children }));
}
export function useStrategy() {
    const context = useContext(StrategyContext);
    if (!context) {
        throw new Error('useStrategy must be used within a StrategyProvider');
    }
    return context;
}
