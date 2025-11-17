import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, X } from "lucide-react";
import { Button } from "../ui/button";

interface AddNoteFormProps {
  onSubmit: (note: {
    title: string;
    content: string;
    tags: string[];
    category: string | null;
  }) => Promise<void>;
  isLoading?: boolean;
}

export function AddNoteForm({ onSubmit, isLoading = false }: AddNoteFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: "",
      content: "",
      tags: "",
      category: "",
    },
  });

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (data: any) => {
    if (tags.length === 0) {
      alert("Please add at least one tag");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        title: data.title,
        content: data.content,
        tags,
        category: data.category || null,
      });
      reset();
      setTags([]);
      setTagInput("");
    } catch (error) {
      console.error("Error submitting note:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="glass-card bg-card text-card-foreground p-6 rounded-lg border border-border">
      <h2 className="text-xl font-semibold mb-4">Add New Note</h2>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            {...register("title", {
              required: "Title is required",
              maxLength: { value: 200, message: "Max 200 characters" },
            })}
            type="text"
            placeholder="Enter note title"
            className="glass-input w-full border-border focus:border-primary"
            disabled={isSubmitting || isLoading}
            maxLength={200}
          />
          {errors.title && (
            <p className="text-sm text-destructive mt-1">{String(errors.title.message)}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            {...register("content", {
              required: "Content is required",
              maxLength: { value: 5000, message: "Max 5000 characters" },
            })}
            placeholder="Enter note content"
            rows={5}
            className="glass-input w-full border-border focus:border-primary resize-none"
            disabled={isSubmitting || isLoading}
            maxLength={5000}
          />
          {errors.content && (
            <p className="text-sm text-destructive mt-1">{String(errors.content.message)}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            {...register("category", {
              maxLength: { value: 100, message: "Max 100 characters" },
            })}
            type="text"
            placeholder="e.g., Work, Personal, Ideas"
            className="glass-input w-full border-border focus:border-primary"
            disabled={isSubmitting || isLoading}
            maxLength={100}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-1">Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Add tags (press Enter)"
              className="glass-input flex-1 border-border focus:border-primary"
              disabled={isSubmitting || isLoading}
            />
            <Button
              type="button"
              onClick={addTag}
              variant="outline"
              disabled={!tagInput.trim() || isSubmitting || isLoading}
              className="px-3"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="hover:text-primary/70"
                    disabled={isSubmitting || isLoading}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isSubmitting || isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
              Adding Note...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add Note
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
