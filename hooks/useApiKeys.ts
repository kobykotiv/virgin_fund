import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type ApiKeyPayload = {
  api_key: string;
  secret_key: string;
  is_paper?: boolean;
  name?: string;
  provider?: string;
  metadata?: Record<string, unknown>;
};

export function useApiKeys() {
  return useQuery({
    queryKey: ["api-keys"],
    queryFn: async () => {
      const res = await fetch("/api/api-keys", { credentials: "same-origin" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to fetch api keys");
      return json.keys as any[];
    },
  });
}

export function useCreateApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ApiKeyPayload) => {
      const res = await fetch("/api/api-keys", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to save api key");
      return json.key;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["api-keys"] }),
  });
}
