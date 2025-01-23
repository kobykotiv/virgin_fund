import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Button } from "../ui/button";
import { AlertTriangle } from "lucide-react";

interface BacktestErrorProps {
  error: string;
  onRetry: () => void;
}

export function BacktestError({ error, onRetry }: BacktestErrorProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-500">
          <AlertTriangle className="w-6 h-6" />
          Error Running Backtest
        </CardTitle>
        <CardDescription>
          There was a problem running your backtest
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 mb-6 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
        <div className="flex justify-end">
          <Button onClick={onRetry}>Try Again</Button>
        </div>
      </CardContent>
    </Card>
  );
}
