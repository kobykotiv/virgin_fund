import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { validateStrategyParams, prepareStrategyParams } from "@/lib/strategies/validateStrategy";
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
import { Slider } from "@/components/ui/slider";
import { useStrategy } from "@/context/StrategyContext";
import { useConfetti } from "@/components/ui/confetti";
import { Shield, TrendingDown, TrendingUp } from "lucide-react";

const RiskManagementSchema = z.object({
  riskManagement: z.object({
    stopLoss: z.number().min(0).max(100),
    takeProfit: z.number().min(0),
    trailingStop: z.number().min(0).max(100).optional(),
    positionSize: z.number().min(0).max(100),
  }),
});

type RiskManagementFormData = z.infer<typeof RiskManagementSchema>;

export default function RiskManagement() {
  const { state, dispatch } = useStrategy();
  const triggerConfetti = useConfetti();
  const navigate = useNavigate();

  const form = useForm<RiskManagementFormData>({
    resolver: zodResolver(RiskManagementSchema),
    defaultValues: {
      riskManagement: state.formData.riskManagement || {
        stopLoss: 10,
        takeProfit: 20,
        trailingStop: 5,
        positionSize: 5,
      },
    },
  });

  const onSubmit = async (data: RiskManagementFormData) => {
    // Update form data in context
    dispatch({ type: "UPDATE_FORM", payload: data });
    
    // Get full strategy data with latest risk management params
    const strategyData = prepareStrategyParams({
      ...state.formData,
      ...data
    });

    // Validate strategy params
    const validation = await validateStrategyParams(strategyData);
    
    if (!validation.isValid) {
      console.error("Strategy validation failed:", validation.errors);
      // Show first error to the user
      alert(validation.errors[0]);
      return;
    }

    triggerConfetti();
    
    // Navigate to backtest with validated strategy parameters
    navigate("/backtest", { 
      state: { 
        riskManagement: data.riskManagement,
        strategy: strategyData
      }
    });
  };

  const calculateRiskReward = () => {
    const { stopLoss, takeProfit } = form.watch("riskManagement");
    return takeProfit / stopLoss;
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Risk Management</CardTitle>
          <CardDescription>
            Configure your risk management parameters to protect your
            investment.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-lg border bg-card">
              <Shield className="w-6 h-6 mb-2 text-primary" />
              <h3 className="font-medium">Risk Protection</h3>
              <p className="text-sm text-muted-foreground">
                Set stop-loss to protect your capital
              </p>
            </div>

            <div className="p-4 rounded-lg border bg-card">
              <TrendingUp className="w-6 h-6 mb-2 text-green-500" />
              <h3 className="font-medium">Profit Targets</h3>
              <p className="text-sm text-muted-foreground">
                Define take-profit levels
              </p>
            </div>

            <div className="p-4 rounded-lg border bg-card">
              <TrendingDown className="w-6 h-6 mb-2 text-blue-500" />
              <h3 className="font-medium">Position Sizing</h3>
              <p className="text-sm text-muted-foreground">
                Manage exposure per trade
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Stop Loss (%)</Label>
              <Slider
                value={[form.watch("riskManagement.stopLoss")]}
                onValueChange={([value]) =>
                  form.setValue("riskManagement.stopLoss", value)
                }
                min={0}
                max={100}
                step={1}
                className="py-4"
              />
              <Input
                type="number"
                {...form.register("riskManagement.stopLoss", {
                  valueAsNumber: true,
                })}
                className="w-24"
              />
            </div>

            <div className="space-y-2">
              <Label>Take Profit (%)</Label>
              <Slider
                value={[form.watch("riskManagement.takeProfit")]}
                onValueChange={([value]) =>
                  form.setValue("riskManagement.takeProfit", value)
                }
                min={0}
                max={200}
                step={1}
                className="py-4"
              />
              <Input
                type="number"
                {...form.register("riskManagement.takeProfit", {
                  valueAsNumber: true,
                })}
                className="w-24"
              />
            </div>

            <div className="space-y-2">
              <Label>Trailing Stop (%)</Label>
              <Slider
                value={[form.watch("riskManagement.trailingStop") || 0]}
                onValueChange={([value]) =>
                  form.setValue("riskManagement.trailingStop", value)
                }
                min={0}
                max={100}
                step={1}
                className="py-4"
              />
              <Input
                type="number"
                {...form.register("riskManagement.trailingStop", {
                  valueAsNumber: true,
                })}
                className="w-24"
              />
            </div>

            <div className="space-y-2">
              <Label>Position Size per Trade (%)</Label>
              <Slider
                value={[form.watch("riskManagement.positionSize")]}
                onValueChange={([value]) =>
                  form.setValue("riskManagement.positionSize", value)
                }
                min={0}
                max={100}
                step={1}
                className="py-4"
              />
              <Input
                type="number"
                {...form.register("riskManagement.positionSize", {
                  valueAsNumber: true,
                })}
                className="w-24"
              />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted">
            <h4 className="font-medium mb-2">Risk/Reward Ratio</h4>
            <p className="text-2xl font-bold">
              {calculateRiskReward().toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">
              A ratio above 1:2 is recommended for optimal risk management
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => dispatch({ type: "SET_STEP", payload: 3 })}
          >
            Back
          </Button>
          <Button>Begin Backtest</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
