// BotForm: Modal form for creating or editing a trading bot.
// Uses shadcn/ui Dialog, Form, and React Query mutation hooks.

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateBot, useUpdateBot } from "@/hooks/useBots";
import type { Bot } from "@/types/bot";

interface BotFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Partial<Bot>;
  mode?: "create" | "edit";
}

const STRATEGIES = [
  { value: "basket", label: "Basket" },
  { value: "grid", label: "Grid" },
  { value: "dca", label: "DCA" },
  { value: "indicator", label: "Indicator" },
];

export default function BotForm({ open, onOpenChange, initial, mode = "create" }: BotFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [strategy, setStrategy] = useState(initial?.strategy ?? "");
  const [assets, setAssets] = useState((initial?.assets ?? []).join(","));
  const [capital, setCapital] = useState(
    typeof (initial as any)?.allocation === "number"
      ? String((initial as any).allocation)
      : typeof (initial as any)?.capital === "number"
      ? String((initial as any).capital)
      : ""
  );
  const [status, setStatus] = useState(initial?.status ?? "paused");

  const createBot = useCreateBot();
  const updateBot = useUpdateBot();

  function resetForm() {
    setName(initial?.name ?? "");
    setStrategy(initial?.strategy ?? "");
    setAssets((initial?.assets ?? []).join(","));
    setCapital(
      typeof (initial as any)?.allocation === "number"
        ? String((initial as any).allocation)
        : typeof (initial as any)?.capital === "number"
        ? String((initial as any).capital)
        : ""
    );
    setStatus(initial?.status ?? "paused");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: any = {
      name,
      strategy,
      assets: assets.split(",").map((a) => a.trim()).filter(Boolean),
      capital: Number(capital),
      status,
    };
    if (mode === "edit" && initial?.id) {
      await updateBot.mutateAsync({ id: initial.id, ...payload });
    } else {
      await createBot.mutateAsync(payload);
    }
    onOpenChange(false);
    resetForm();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Bot" : "Create Bot"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="bot-name" className="block text-sm font-medium">
            Name
          </label>
          <Input
            id="bot-name"
            placeholder="Bot name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <Select value={strategy} onValueChange={setStrategy}>
            <SelectTrigger>
              <SelectValue placeholder="Select strategy" />
            </SelectTrigger>
            <SelectContent>
              {STRATEGIES.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <label htmlFor="bot-assets" className="block text-sm font-medium">
            Assets
          </label>
          <Input
            id="bot-assets"
            placeholder="Comma-separated symbols (e.g. BTCUSD,ETHUSD)"
            value={assets}
            onChange={e => setAssets(e.target.value)}
            required
          />
          <label htmlFor="bot-capital" className="block text-sm font-medium">
            Capital
          </label>
          <Input
            id="bot-capital"
            type="number"
            placeholder="Capital allocation"
            value={capital}
            onChange={e => setCapital(e.target.value)}
            required
            min={0}
          />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="stopped">Stopped</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button type="submit" disabled={createBot.isPending || updateBot.isPending}>
              {mode === "edit" ? "Save Changes" : "Create Bot"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => { onOpenChange(false); resetForm(); }}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/*
Summary of Changes:
- Created BotForm modal for create/edit bot flows.
- Uses shadcn/ui Dialog, Form, Select, and React Query mutations.
- Fields: name, strategy, assets, capital, status.
- Handles both create and edit modes.
*/
