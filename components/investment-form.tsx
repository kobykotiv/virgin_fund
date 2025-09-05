"use client"

import React, { useState } from "react";
import { useToast } from "./toast-provider";

/**
 * InvestmentForm
 *
 * Controlled form for creating/editing investments.
 * - Fields: amount (required), fund selection (required), notes (optional)
 * - Inline validation and disabled submit while invalid
 * - Shows loading indicator while submitting and a toast on success/error
 *
 * This is intentionally dependency-free (no Zod) to keep the bundle small.
 */

interface InvestmentFormProps {
  initial?: { amount?: number; fundId?: string; notes?: string };
  funds?: { id: string; name: string }[]; // optional preloaded funds
  onSaved?: (result: any) => void;
}

export default function InvestmentForm({ initial, funds = [], onSaved }: InvestmentFormProps) {
  const [amount, setAmount] = useState<string>(initial?.amount ? String(initial.amount) : "");
  const [fundId, setFundId] = useState<string>(initial?.fundId ?? (funds[0]?.id ?? ""));
  const [notes, setNotes] = useState<string>(initial?.notes ?? "");
  const [loading, setLoading] = useState(false);

  const [touched, setTouched] = useState<{ amount?: boolean; fundId?: boolean }>({});
  const { push } = useToast();

  const amountVal = Number(amount);
  const isAmountValid = !Number.isNaN(amountVal) && amountVal > 0;
  const isFundValid = typeof fundId === "string" && fundId.trim().length > 0;

  const isFormValid = isAmountValid && isFundValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ amount: true, fundId: true });
    if (!isFormValid) return;
    setLoading(true);
    try {
      const res = await fetch("/api/investments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountVal, fundId, notes }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed" }));
        throw new Error(err?.error || "Failed to save");
      }
      const json = await res.json();
      push({ type: "success", message: "Investment saved" });
      onSaved && onSaved(json);
      // reset form
      setAmount("");
      setNotes("");
    } catch (err: any) {
      console.error("Investment save failed", err);
      push({ type: "error", message: `Failed to save investment: ${err?.message ?? "unknown"}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded border bg-white dark:bg-gray-900">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Amount</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, amount: true }))}
          aria-invalid={touched.amount && !isAmountValid}
          aria-describedby="amount-error"
          className="mt-1 w-full px-3 py-2 rounded border bg-white dark:bg-gray-800 text-sm"
        />
        {touched.amount && !isAmountValid && <div id="amount-error" className="text-xs text-red-600 mt-1">Enter an amount greater than 0</div>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Fund</label>
        <select
          value={fundId}
          onChange={(e) => setFundId(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, fundId: true }))}
          aria-invalid={touched.fundId && !isFundValid}
          aria-describedby="fund-error"
          className="mt-1 w-full px-3 py-2 rounded border bg-white dark:bg-gray-800 text-sm"
        >
          <option value="">Select a fund</option>
          {funds.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        {touched.fundId && !isFundValid && <div id="fund-error" className="text-xs text-red-600 mt-1">Choose a fund</div>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 w-full px-3 py-2 rounded border bg-white dark:bg-gray-800 text-sm"
          rows={3}
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            setAmount("");
            setFundId(funds[0]?.id ?? "");
            setNotes("");
            setTouched({});
          }}
          className="px-4 py-2 rounded border text-sm"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className="px-4 py-2 rounded bg-primary text-white disabled:opacity-50"
        >
          {loading ? "Saving…" : "Save Investment"}
        </button>
      </div>
    </form>
  );
}
