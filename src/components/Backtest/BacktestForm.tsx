import React from "react";
import { useForm } from "react-hook-form";
import { BacktestParams } from "../../types/backtest";
import { AssetList } from "../StockSearch/AssetList";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const BacktestSchema = z.object({
  tickers: z.array(z.string()).min(1, "At least one ticker is required"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  frequency: z.enum([
    "daily",
    "weekly",
    "monthly",
    "quarterly",
    "biannual",
    "annual",
  ]),
  investmentAmount: z.number().min(1, "Investment amount must be greater than 0"),
  benchmark: z.enum(["SPY", "BTC"]).nullable(),
});

type BacktestFormData = z.infer<typeof BacktestSchema>;

interface BacktestFormProps {
  onSubmit: (data: BacktestParams) => void;
  isLoading?: boolean;
}

export function BacktestForm({ onSubmit, isLoading }: BacktestFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BacktestFormData>({
    resolver: zodResolver(BacktestSchema),
    defaultValues: {
      frequency: "monthly",
      benchmark: null,
      investmentAmount: 1000,
      tickers: [],
    },
  });

  const selectedTickers = watch("tickers");

  const handleAssetSelect = (symbol: string) => {
    if (!selectedTickers.includes(symbol)) {
      setValue("tickers", [...selectedTickers, symbol]);
    }
  };

  const handleAssetRemove = (symbol: string) => {
    setValue(
      "tickers",
      selectedTickers.filter((t) => t !== symbol)
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Run Backtest</CardTitle>
        <CardDescription>
          Test your investment strategy using historical data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <div>
              <Label>Select Tickers</Label>
              <AssetList
                selectedAssets={selectedTickers.map(symbol => ({ symbol, name: symbol }))}
                onAssetSelect={handleAssetSelect}
                onAssetRemove={handleAssetRemove}
              />
              {errors.tickers && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.tickers.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  type="date"
                  id="startDate"
                  {...register("startDate", {
                    valueAsDate: true,
                  })}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  type="date"
                  id="endDate"
                  {...register("endDate", {
                    valueAsDate: true,
                  })}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.endDate.message}
                  </p>
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
                  <option value="biannual">Biannual</option>
                  <option value="annual">Annual</option>
                </select>
                {errors.frequency && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.frequency.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="investmentAmount">Investment Amount ($)</Label>
                <Input
                  type="number"
                  id="investmentAmount"
                  placeholder="1000"
                  {...register("investmentAmount", {
                    valueAsNumber: true,
                  })}
                />
                {errors.investmentAmount && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.investmentAmount.message}
                  </p>
                )}
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
}
