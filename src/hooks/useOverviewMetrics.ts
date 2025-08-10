// src/hooks/useOverviewMetrics.ts
import { useQuery } from "react-query";
import axios from "axios";

export function useOverviewMetrics(demoMode: boolean, userId?: string) {
  return useQuery(
    ["overviewMetrics", demoMode, userId],
    async () => {
      const res = await axios.get("/api/overview/metrics", {
        headers: {
          "x-demo-mode": demoMode ? "true" : "false",
          ...(userId ? { "x-user-id": userId } : {}),
        },
      });
      return res.data;
    }
  );
}
