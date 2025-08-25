"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "@/lib/supabaseClient";

export function useNotifications() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const u = await supabase.auth.getUser();
        const user = (u as any)?.data?.user ?? null;
        if (!user) return [] as any[];

        const { data, error } = await supabase
          .from("notifications")
          .select("id, alert_id, payload, read, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (error) throw error;
        return data ?? [];
      } catch (e) {
        console.warn("useNotifications fetch error", e);
        return [] as any[];
      }
    },
    staleTime: 10_000,
  });

  // mark read mutation
  const markRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id);
      if (error) throw error;
      return true;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  // realtime subscription to notifications for current user
  useEffect(() => {
    let mounted = true;
    let channel: any = null;

    (async () => {
      const u = await supabase.auth.getUser();
      const user = (u as any)?.data?.user ?? null;
      if (!user) return;

      try {
        channel = supabase
          .channel(`public:realtime:user=${user.id}`)
          .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
            (payload: any) => {
              // Invalidate to re-fetch latest notifications
              try {
                qc.invalidateQueries({ queryKey: ["notifications"] });
              } catch (e) {
                // ignore
              }
            }
          )
          .subscribe();
      } catch (e) {
        // ignore subscribe errors
      }
    })();

    return () => {
      mounted = false;
      try {
        if (channel) channel.unsubscribe();
      } catch (e) {
        // ignore
      }
    };
  }, [qc]);

  return { ...query, markRead };
}
