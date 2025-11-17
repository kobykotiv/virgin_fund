import { useEffect, useState, useCallback } from "react";
import { supabase } from "../supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface AppendNote {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  category: string | null;
  created_at: string;
}

export function useAppendNotes() {
  const [notes, setNotes] = useState<AppendNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();

    const channel: RealtimeChannel = supabase
      .channel("append_notes_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "append_notes",
        },
        (payload) => {
          const newNote = payload.new as AppendNote;
          setNotes((prev) => [newNote, ...prev]);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("append_notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setNotes(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch notes";
      setError(message);
      console.error("Error fetching notes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addNote = useCallback(
    async (note: Omit<AppendNote, "id" | "user_id" | "created_at">) => {
      try {
        setError(null);

        const { error: insertError } = await supabase
          .from("append_notes")
          .insert({
            title: note.title,
            content: note.content,
            tags: note.tags || [],
            category: note.category || null,
          });

        if (insertError) throw insertError;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to add note";
        setError(message);
        throw err;
      }
    },
    []
  );

  return {
    notes,
    loading,
    error,
    addNote,
    refetch: fetchNotes,
  };
}
