import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { StockSearch } from "../StockSearch";
import type { BacktestParams } from "@/types/backtest";
import type { Frequency } from "@/lib/strategies/dcaStrategy";
import { useLocation } from "react-router-dom";

const BacktestSchema = z.object({
  tickers: z.array(z.string()).min(1, "At least one ticker is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  frequency: z.enum([
    "daily",
    "weekly",
    "monthly",
    "quarterly",
    "yearly",
  ] as const satisfies readonly Frequency[]),
  investmentAmount: z.number().min(1, "Investment amount must be greater than 0"),
  benchmark: z.enum(["SPY", "BTC"]).nullable(),
  rebalanceFrequency: z.enum(["daily", "weekly", "monthly"]).optional(),
  rebalanceThreshold: z.number().min(0).max(100).optional(),
  riskManagement: z.object({
    stopLoss: z.number().min(0).max(100),
    takeProfit: z.number().min(0),
    trailingStop: z.number().min(0).max(100).optional(),
    positionSize: z.number().min(0).max(100),
  }),
});

type BacktestFormData = z.infer<typeof BacktestSchema>;

interface BeginningBacktestProps {
  onSubmit: (data: BacktestParams) => void;
  isLoading?: boolean;
}

const BeginningBacktest: React.FC<BeginningBacktestProps> = ({ onSubmit, isLoading }) => {
  const location = useLocation();
  const strategyParams = location.state;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BacktestFormData>({
    resolver: zodResolver(BacktestSchema),
    defaultValues: {
      tickers: strategyParams?.strategy?.tickers || [],
      frequency: (strategyParams?.strategy?.frequency as Frequency) || "monthly",
      benchmark: null,
      investmentAmount: 1000,
      riskManagement: strategyParams?.riskManagement || {
        stopLoss: 10,
        takeProfit: 20,
        trailingStop: 5,
        positionSize: 5,
      },
      rebalanceFrequency: strategyParams?.strategy?.rebalanceFrequency || "monthly",
      rebalanceThreshold: strategyParams?.strategy?.rebalanceThreshold || 5,
    },
  });

  const selectedTickers = watch("tickers");

  const handleAssetSelect = (symbol: string) => {
    const currentTickers = selectedTickers ?? [];
    if (currentTickers.includes(symbol)) {
      setValue(
        "tickers",
        currentTickers.filter((t) => t !== symbol)
      );
    } else {
      setValue("tickers", [...currentTickers, symbol]);
    }
  };

  const handleFormSubmit = (data: BacktestFormData) => {
    onSubmit({
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Run Backtest</CardTitle>
        <CardDescription>Test your DCA strategy using historical data</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Select Tickers</Label>
              <StockSearch
                onSelect={handleAssetSelect}
                selectedAssets={selectedTickers}
              />
              {errors.tickers && (
                <p className="text-sm text-red-500 mt-1">{errors.tickers.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  type="date"
                  id="startDate"
                  {...register("startDate")}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500 mt-1">{errors.startDate.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  type="date"
                  id="endDate"
                  {...register("endDate")}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500 mt-1">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="frequency">Investment Frequency</Label>
                <select
                  id="frequency"
                  className="w-full p-2 border rounded"
                  {...register("frequency")}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
                {errors.frequency && (
                  <p className="text-sm text-red-500 mt-1">{errors.frequency.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="investmentAmount">Investment Amount ($)</Label>
                <Input
                  type="number"
                  id="investmentAmount"
                  placeholder="1000"
                  {...register("investmentAmount", { valueAsNumber: true })}
                />
                {errors.investmentAmount && (
                  <p className="text-sm text-red-500 mt-1">{errors.investmentAmount.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rebalanceFrequency">Rebalance Frequency</Label>
                <select
                  id="rebalanceFrequency"
                  className="w-full p-2 border rounded"
                  {...register("rebalanceFrequency")}
                >
                  <option value="">None</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <Label htmlFor="rebalanceThreshold">Rebalance Threshold (%)</Label>
                <Input
                  type="number"
                  id="rebalanceThreshold"
                  placeholder="5"
                  {...register("rebalanceThreshold", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="border p-4 rounded-lg space-y-4">
              <h3 className="font-medium">Risk Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stopLoss">Stop Loss (%)</Label>
                  <Input
                    type="number"
                    id="stopLoss"
                    placeholder="10"
                    {...register("riskManagement.stopLoss", { valueAsNumber: true })}
                  />
                </div>

                <div>
                  <Label htmlFor="takeProfit">Take Profit (%)</Label>
                  <Input
                    type="number"
                    id="takeProfit"
                    placeholder="20"
                    {...register("riskManagement.takeProfit", { valueAsNumber: true })}
                  />
                </div>

                <div>
                  <Label htmlFor="trailingStop">Trailing Stop (%)</Label>
                  <Input
                    type="number"
                    id="trailingStop"
                    placeholder="5"
                    {...register("riskManagement.trailingStop", { valueAsNumber: true })}
                  />
                </div>

                <div>
                  <Label htmlFor="positionSize">Position Size (%)</Label>
                  <Input
                    type="number"
                    id="positionSize"
                    placeholder="5"
                    {...register("riskManagement.positionSize", { valueAsNumber: true })}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="benchmark">Benchmark</Label>
              <select
                id="benchmark"
                className="w-full p-2 border rounded"
                {...register("benchmark")}
              >
                <option value="">None</option>
                <option value="SPY">S&P 500 (SPY)</option>
                <option value="BTC">Bitcoin (BTC)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Running Backtest..." : "Run Backtest"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BeginningBacktest;
