import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pencil, Save, X } from "lucide-react"
import { MDXRemote } from "next-mdx-remote"
import { Editor } from "@monaco-editor/react"

interface WikiArticleProps {
  title: string
  content: string
  lastModified: string
  author: string
  canEdit?: boolean
  onSave?: (content: string) => Promise<void>
}

export function WikiArticle({ 
  title, 
  content, 
  lastModified, 
  author, 
  canEdit = false,
  onSave 
}: WikiArticleProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(content)

  const handleSave = async () => {
    if (onSave) {
      await onSave(editContent)
      setIsEditing(false)
    }
  }

  return (
    <article className="max-w-3xl mx-auto py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-sm text-muted-foreground">
            Last modified {lastModified} by {author}
          </p>
        </div>
        {canEdit && !isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <Editor
            height="500px"
            defaultLanguage="markdown"
            value={editContent}
            onChange={(value) => setEditContent(value || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              lineNumbers: "off",
              wordWrap: "on"
            }}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      ) : (
        <div className="prose prose-blue dark:prose-invert max-w-none">
          <MDXRemote {...content} />
        </div>
      )}
    </article>
  )
}
