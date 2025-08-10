// src/hooks/useBacktest.ts
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";

export function useListBacktest(demoMode: boolean, userId?: string) {
  return useQuery(
    ["backtests", demoMode, userId],
    async () => {
      const res = await axios.get("/api/backtest/list", {
        headers: {
          "x-demo-mode": demoMode ? "true" : "false",
          ...(userId ? { "x-user-id": userId } : {}),
        },
      });
      return res.data.backtests;
    }
  );
}

export function useCreateBacktest(demoMode: boolean, userId?: string) {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: any) => {
      const res = await axios.post("/api/backtest/create", payload, {
        headers: {
          "x-demo-mode": demoMode ? "true" : "false",
          ...(userId ? { "x-user-id": userId } : {}),
        },
      });
      return res.data.backtest;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["backtests", demoMode, userId]);
      },
    }
  );
}

export function useUpdateBacktest(demoMode: boolean, userId?: string) {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ id, ...payload }: any) => {
      const res = await axios.put(`/api/backtest/update/${id}`, payload, {
        headers: {
          "x-demo-mode": demoMode ? "true" : "false",
          ...(userId ? { "x-user-id": userId } : {}),
        },
      });
      return res.data.backtest;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["backtests", demoMode, userId]);
      },
    }
  );
}

export function useDeleteBacktest(demoMode: boolean, userId?: string) {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: string) => {
      const res = await axios.delete(`/api/backtest/delete/${id}`, {
        headers: {
          "x-demo-mode": demoMode ? "true" : "false",
          ...(userId ? { "x-user-id": userId } : {}),
        },
      });
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["backtests", demoMode, userId]);
      },
    }
  );
}
