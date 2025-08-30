// =============================================================================
// Declarative UI Patterns - Base Types and Interfaces
// =============================================================================

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface AsyncComponentProps<T = any> extends BaseComponentProps {
  data?: T;
  loading?: boolean;
  error?: string | Error | null;
  onRetry?: () => void;
}

export interface FormFieldProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export interface CalculatorConfig<T = any> {
  id: string;
  title: string;
  description: string;
  fields: FormFieldConfig[];
  calculate: (values: Record<string, any>) => T;
  renderResult?: (result: T) => React.ReactNode;
}

export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'number' | 'select' | 'text' | 'textarea' | 'slider';
  defaultValue: any;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    step?: number;
    options?: { value: string; label: string }[];
  };
  format?: (value: any) => string;
  placeholder?: string;
}

// =============================================================================
// Declarative Calculator Hook
// =============================================================================

export function useDeclarativeCalculator<T>(
  config: CalculatorConfig<T>,
  initialValues?: Record<string, any>
) {
  const [values, setValues] = useState<Record<string, any>>(() => {
    const defaults = config.fields.reduce((acc, field) => {
      acc[field.name] = initialValues?.[field.name] ?? field.defaultValue;
      return acc;
    }, {} as Record<string, any>);
    return defaults;
  });

  const [result, setResult] = useState<T | null>(null);
  const [calculating, setCalculating] = useState<boolean>(false);

  const updateField = useCallback((name: string, value: any) => {
    setValues((prev: Record<string, any>) => ({ ...prev, [name]: value }));
  }, []);

  const calculate = useCallback(async () => {
    setCalculating(true);
    try {
      const calcResult = config.calculate(values);
      setResult(calcResult);
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setCalculating(false);
    }
  }, [config, values]);

  const reset = useCallback(() => {
    setValues(config.fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue;
      return acc;
    }, {} as Record<string, any>));
    setResult(null);
  }, [config.fields]);

  return {
    values,
    result,
    calculating,
    updateField,
    calculate,
    reset,
  };
}

// =============================================================================
// Declarative Form Field Component
// =============================================================================

export function DeclarativeFormField({ config, value, onChange, error }: {
  config: FormFieldConfig;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}) {
  const handleChange = (newValue: any) => {
    onChange(newValue);
  };

  switch (config.type) {
    case 'number':
      return (
        <div className="space-y-2">
          <Label htmlFor={config.name}>
            {config.label}
            {config.validation?.required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id={config.name}
            type="number"
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(Number(e.target.value))}
            min={config.validation?.min}
            max={config.validation?.max}
            step={config.validation?.step}
            placeholder={config.placeholder}
            className={error ? 'border-red-500' : ''}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      );

    case 'select':
      return (
        <div className="space-y-2">
          <Label htmlFor={config.name}>
            {config.label}
            {config.validation?.required && <span className="text-red-500">*</span>}
          </Label>
          <Select value={value} onValueChange={handleChange}>
            <SelectTrigger id={config.name} className={error ? 'border-red-500' : ''}>
              <SelectValue placeholder={config.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {config.validation?.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      );

    case 'slider':
      return (
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor={config.name}>
              {config.label}
              {config.validation?.required && <span className="text-red-500">*</span>}
            </Label>
            <span>{config.format ? config.format(value) : value}</span>
          </div>
          <Slider
            id={config.name}
            min={config.validation?.min}
            max={config.validation?.max}
            step={config.validation?.step}
            value={[value]}
            onValueChange={(values) => handleChange(values[0])}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      );

    default:
      return null;
  }
}

// =============================================================================
// Declarative Calculator Component
// =============================================================================

export function DeclarativeCalculator<T>({ config }: { config: CalculatorConfig<T> }) {
  const { values, result, calculating, updateField, calculate, reset } = useDeclarativeCalculator(config);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{config.title}</CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {config.fields.map((fieldConfig) => (
          <DeclarativeFormField
            key={fieldConfig.name}
            config={fieldConfig}
            value={values[fieldConfig.name]}
            onChange={(value) => updateField(fieldConfig.name, value)}
          />
        ))}

        <div className="flex gap-2">
          <Button onClick={calculate} disabled={calculating} className="flex-1">
            {calculating ? 'Calculating...' : 'Calculate'}
          </Button>
          <Button variant="outline" onClick={reset}>
            Reset
          </Button>
        </div>

        {result && config.renderResult && (
          <div className="mt-6">
            {config.renderResult(result)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
