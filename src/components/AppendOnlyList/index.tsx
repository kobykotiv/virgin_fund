import { useAppendNotes } from "../../lib/hooks/useAppendNotes";
import { AddNoteForm } from "./AddNoteForm";
import { NoteCard } from "./NoteCard";
import { BlobBackground } from "../ui/blob-background";
import { AlertCircle, InboxIcon } from "lucide-react";
import { useState } from "react";

export function AppendOnlyList() {
  const { notes, loading, error, addNote } = useAppendNotes();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleAddNote = async (note: {
    title: string;
    content: string;
    tags: string[];
    category: string | null;
  }) => {
    try {
      setSubmitError(null);
      await addNote(note);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add note";
      setSubmitError(message);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <BlobBackground />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent mb-2">
            Append-Only Notes
          </h1>
          <p className="text-muted-foreground">
            A permanent record of your thoughts and ideas. Notes cannot be edited or deleted once added.
          </p>
        </div>

        {/* Error Display */}
        {(error || submitError) && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">{error || submitError}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Note Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <AddNoteForm onSubmit={handleAddNote} />
            </div>
          </div>

          {/* Notes List */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-12 glass-card bg-card text-card-foreground p-8 rounded-lg border border-border">
                <InboxIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No notes yet</h3>
                <p className="text-muted-foreground">
                  Create your first note to get started. Your notes will appear here in reverse chronological order.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hint at the bottom */}
        <div className="mt-16 pt-8 border-t border-border/50 text-center">
          <div className="inline-block bg-muted/50 px-4 py-3 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Append-Only Feature:</span> Notes are permanently stored and cannot be modified or deleted. This ensures a complete audit trail of all entries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
