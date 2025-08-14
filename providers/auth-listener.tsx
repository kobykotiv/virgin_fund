"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export function useSupabaseAuthListener(onAuthChange?: (event: string) => void) {
  const router = useRouter();
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (onAuthChange) onAuthChange(event);
      if (event === "SIGNED_IN") router.refresh();
      if (event === "SIGNED_OUT") router.push("/login");
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router, onAuthChange]);
}
