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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useStrategy } from "@/context/StrategyContext";
import { Info } from "lucide-react";
import { DCAConfigSchema } from "@/types/strategy";
import type { Frequency } from "@/lib/strategies/dcaStrategy";

const StrategyConfigSchema = z.object({
  strategyType: z.enum(["DCA", "TRADER", "GRID"]),
  frequency: DCAConfigSchema.shape.frequency,
  rebalanceFrequency: DCAConfigSchema.shape.rebalanceFrequency,
  rebalanceThreshold: DCAConfigSchema.shape.rebalanceThreshold,
  strategyConfig: z.object({
    investmentAmount: z.number().min(1),
  }),
});

type StrategyConfigFormData = z.infer<typeof StrategyConfigSchema>;

export default function StrategyConfig() {
  const { state, dispatch } = useStrategy();
  const form = useForm<StrategyConfigFormData>({
    resolver: zodResolver(StrategyConfigSchema),
    defaultValues: {
      strategyType: state.formData.strategyType || "DCA",
      frequency: (state.formData.frequency as Frequency) || "monthly",
      rebalanceFrequency: state.formData.rebalanceFrequency || "monthly",
      rebalanceThreshold: state.formData.rebalanceThreshold || 5,
      strategyConfig: state.formData.strategyConfig || {
        investmentAmount: 1000,
      },
    },
  });

  const onSubmit = (data: StrategyConfigFormData) => {
    dispatch({ type: "UPDATE_FORM", payload: data });
    dispatch({ type: "SET_STEP", payload: 3 });
  };

  const showRebalancing = form.watch("strategyType") === "DCA";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Strategy Configuration</CardTitle>
          <CardDescription>
            Choose your strategy type and configure its parameters.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Strategy Type</Label>
            <Select
              onValueChange={(value) =>
                form.setValue("strategyType", value as "DCA" | "TRADER" | "GRID")
              }
              defaultValue={form.getValues("strategyType")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a strategy type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DCA">
                  <div className="flex items-start gap-2">
                    <span>Dollar Cost Averaging</span>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </div>
                </SelectItem>
                <SelectItem value="TRADER" disabled>
                  <div className="flex items-start gap-2">
                    <span>Active Trading</span>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </div>
                </SelectItem>
                <SelectItem value="GRID" disabled>
                  <div className="flex items-start gap-2">
                    <span>Grid Trading</span>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 rounded-lg border p-4 bg-muted/50">
            <div className="space-y-2">
              <Label>Investment Amount ($)</Label>
              <Input
                type="number"
                {...form.register("strategyConfig.investmentAmount", {
                  valueAsNumber: true,
                })}
                min={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Investment Frequency</Label>
              <Select
                onValueChange={(value) =>
                  form.setValue("frequency", value as Frequency)
                }
                defaultValue={form.getValues("frequency")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {showRebalancing && (
              <>
                <div className="space-y-2">
                  <Label>Rebalance Frequency</Label>
                  <Select
                    onValueChange={(value) =>
                      form.setValue("rebalanceFrequency", value as "daily" | "weekly" | "monthly")
                    }
                    defaultValue={form.getValues("rebalanceFrequency")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select rebalance frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Rebalance Threshold (%)</Label>
                  <Input
                    type="number"
                    {...form.register("rebalanceThreshold", {
                      valueAsNumber: true,
                    })}
                    min={1}
                    max={100}
                    placeholder="5"
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => dispatch({ type: "SET_STEP", payload: 1 })}
          >
            Back
          </Button>
          <Button type="submit">Continue</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
