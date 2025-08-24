import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export function useDesigns() {
  return useQuery({
    queryKey: ["designs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("designs").select("id, name, url, created_at").order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });
}

export function useTemplates() {
  return useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const { data, error } = await supabase.from("templates").select("id, name, created_at").order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });
}
