import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useStrategy } from "@/context/StrategyContext";
import { TrendingUp, Activity, BarChart2 } from "lucide-react";

const TechnicalAnalysisSchema = z.object({
  technicalIndicators: z
    .array(
      z.object({
        type: z.enum(["SMA", "EMA", "RSI", "MACD", "BB"]),
        parameters: z.record(z.number()),
      }),
    )
    .max(3),
});

type TechnicalAnalysisFormData = z.infer<typeof TechnicalAnalysisSchema>;

const INDICATOR_PRESETS = {
  SMA: { period: 20 },
  EMA: { period: 12 },
  RSI: { period: 14, overbought: 70, oversold: 30 },
  MACD: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
  BB: { period: 20, standardDeviations: 2 },
};

export default function TechnicalAnalysis() {
  const { state, dispatch } = useStrategy();
  const [selectedIndicator, setSelectedIndicator] = React.useState<
    keyof typeof INDICATOR_PRESETS | null
  >(null);

  const form = useForm<TechnicalAnalysisFormData>({
    resolver: zodResolver(TechnicalAnalysisSchema),
    defaultValues: {
      technicalIndicators: state.formData.technicalIndicators || [],
    },
  });

  const onSubmit = (data: TechnicalAnalysisFormData) => {
    dispatch({ type: "UPDATE_FORM", payload: data });
    dispatch({ type: "SET_STEP", payload: 4 });
  };

  const addIndicator = (type: keyof typeof INDICATOR_PRESETS) => {
    const currentIndicators = form.getValues("technicalIndicators") || [];
    if (currentIndicators.length >= 3) return;

    form.setValue("technicalIndicators", [
      ...currentIndicators,
      { type, parameters: INDICATOR_PRESETS[type] },
    ]);
    setSelectedIndicator(null);
  };

  const removeIndicator = (index: number) => {
    const currentIndicators = form.getValues("technicalIndicators") || [];
    form.setValue(
      "technicalIndicators",
      currentIndicators.filter((_, i) => i !== index),
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Technical Analysis</CardTitle>
          <CardDescription>
            Add up to 3 technical indicators to enhance your strategy.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setSelectedIndicator("SMA")}
              className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <TrendingUp className="w-6 h-6 mb-2" />
              <h3 className="font-medium">Moving Averages</h3>
              <p className="text-sm text-muted-foreground">
                Simple and exponential moving averages
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedIndicator("RSI")}
              className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <Activity className="w-6 h-6 mb-2" />
              <h3 className="font-medium">Momentum</h3>
              <p className="text-sm text-muted-foreground">
                RSI and other momentum indicators
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedIndicator("BB")}
              className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <BarChart2 className="w-6 h-6 mb-2" />
              <h3 className="font-medium">Volatility</h3>
              <p className="text-sm text-muted-foreground">
                Bollinger Bands and ATR
              </p>
            </button>
          </div>

          {selectedIndicator && (
            <div className="p-4 rounded-lg border bg-muted">
              <h3 className="font-medium mb-4">
                Configure {selectedIndicator}
              </h3>
              <div className="space-y-4">
                {Object.entries(INDICATOR_PRESETS[selectedIndicator]).map(
                  ([param, defaultValue]) => (
                    <div key={param} className="space-y-2">
                      <Label>{param}</Label>
                      <Input type="number" defaultValue={defaultValue} />
                    </div>
                  ),
                )}
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedIndicator(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => addIndicator(selectedIndicator)}
                  >
                    Add Indicator
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {form.watch("technicalIndicators")?.map((indicator, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border bg-card"
              >
                <div>
                  <h4 className="font-medium">{indicator.type}</h4>
                  <p className="text-sm text-muted-foreground">
                    {Object.entries(indicator.parameters)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(", ")}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeIndicator(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => dispatch({ type: "SET_STEP", payload: 2 })}
          >
            Back
          </Button>
          <Button type="submit">Continue</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
