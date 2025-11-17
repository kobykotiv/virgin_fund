import { Tag, Folder } from "lucide-react";
import type { AppendNote } from "../../lib/hooks/useAppendNotes";

interface NoteCardProps {
  note: AppendNote;
}

export function NoteCard({ note }: NoteCardProps) {
  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return date;
    }
  };

  return (
    <div className="glass-card bg-card text-card-foreground p-5 rounded-lg border border-border hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold break-words">{note.title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{formatDate(note.created_at)}</p>
        </div>
      </div>

      <p className="text-foreground/90 whitespace-pre-wrap break-words mb-4 text-sm leading-relaxed">
        {note.content}
      </p>

      <div className="space-y-2">
        {note.category && (
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
              {note.category}
            </span>
          </div>
        )}

        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {note.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-border/50">
        <p className="text-xs text-muted-foreground italic">
          ✓ Permanently stored
        </p>
      </div>
    </div>
  );
}
