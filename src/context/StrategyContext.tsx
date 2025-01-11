import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Strategy } from "@/types/strategy";

interface StrategyState {
  currentStep: number;
  formData: Partial<Strategy>;
  isValid: boolean;
  isDirty: boolean;
}

type StrategyAction =
  | { type: "SET_STEP"; payload: number }
  | { type: "UPDATE_FORM"; payload: Partial<Strategy> }
  | { type: "SET_VALID"; payload: boolean }
  | { type: "SET_DIRTY"; payload: boolean };

const initialState: StrategyState = {
  currentStep: 1,
  formData: {},
  isValid: false,
  isDirty: false,
};

const StrategyContext = createContext<{
  state: StrategyState;
  dispatch: React.Dispatch<StrategyAction>;
} | null>(null);

function strategyReducer(
  state: StrategyState,
  action: StrategyAction,
): StrategyState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.payload };
    case "UPDATE_FORM":
      return {
        ...state,
        formData: { ...state.formData, ...action.payload },
        isDirty: true,
      };
    case "SET_VALID":
      return { ...state, isValid: action.payload };
    case "SET_DIRTY":
      return { ...state, isDirty: action.payload };
    default:
      return state;
  }
}

export function StrategyProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(strategyReducer, initialState);

  // Autosave form data every 30 seconds if dirty
  useEffect(() => {
    if (!state.isDirty) return;

    const timer = setTimeout(() => {
      localStorage.setItem("strategyFormData", JSON.stringify(state.formData));
      dispatch({ type: "SET_DIRTY", payload: false });
    }, 30000);

    return () => clearTimeout(timer);
  }, [state.formData, state.isDirty]);

  return (
    <StrategyContext.Provider value={{ state, dispatch }}>
      {children}
    </StrategyContext.Provider>
  );
}

export function useStrategy() {
  const context = useContext(StrategyContext);
  if (!context) {
    throw new Error("useStrategy must be used within a StrategyProvider");
  }
  return context;
}
