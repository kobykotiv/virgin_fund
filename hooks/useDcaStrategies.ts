import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type DcaStrategy = {
  id: string;
  user_id?: string;
  name: string;
  description?: string | null;
  asset: string;
  config: {
    interval: string;
    amount: number;
    duration?: string | null;
  };
  status?: string;
  created_at?: string;
  updated_at?: string;
};

type CreateDcaPayload = {
  name: string;
  description?: string;
  asset: string;
  interval: string;
  amount: number;
  duration?: string;
  is_public?: boolean;
};

type UpdateDcaPayload = Partial<CreateDcaPayload> & { id: string };

export function useDcaStrategies() {
  return useQuery({
    queryKey: ["dca-strategies"],
    queryFn: async (): Promise<DcaStrategy[]> => {
      const res = await fetch("/api/strategies/dca/list", { credentials: "same-origin" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to fetch DCA strategies");
      return (json.strategies ?? []) as DcaStrategy[];
    },
  });
}

export function useCreateDcaStrategy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateDcaPayload) => {
      const res = await fetch("/api/strategies/dca/create", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to create DCA strategy");
      return json.strategy as DcaStrategy;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dca-strategies"] }),
  });
}

export function useUpdateDcaStrategy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateDcaPayload) => {
      if (!payload.id) throw new Error("Missing strategy id");
      const { id, ...rest } = payload;
      const res = await fetch(`/api/strategies/dca/update`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...rest }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to update DCA strategy");
      return json.strategy as DcaStrategy;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dca-strategies"] }),
  });
}

export function useDeleteDcaStrategy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!id) throw new Error("Missing strategy id");
      const res = await fetch(`/api/strategies/dca/delete?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to delete DCA strategy");
      return json;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dca-strategies"] }),
  });
}

export function useBacktestDca() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id?: string; asset?: string; interval?: string; amount?: number; startDate?: string; endDate?: string }) => {
      const res = await fetch(`/api/strategies/dca/backtest`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to run backtest");
      return json as any;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dca-strategies"] }),
  });
}

export function useExecuteDca() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id?: string; asset?: string }) => {
      const res = await fetch(`/api/strategies/dca/execute`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to execute DCA")
      return json as any;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dca-strategies"] }),
  });
}
