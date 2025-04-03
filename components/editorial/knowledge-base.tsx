import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"

interface Category {
  title: string
  articles: {
    title: string
    slug: string
  }[]
}

interface KnowledgeBaseProps {
  categories: Category[]
  activeSlug?: string
  onSearch: (term: string) => void
}

export function KnowledgeBase({ categories, activeSlug, onSearch }: KnowledgeBaseProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search documentation..."
          className="pl-8"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <ScrollArea className="flex-1 py-4">
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category.title} className="space-y-2">
              <h4 className="font-medium">{category.title}</h4>
              <div className="grid grid-flow-row auto-rows-max text-sm">
                {category.articles.map((article) => (
                  <a
                    key={article.slug}
                    href={`/docs/${article.slug}`}
                    className={cn(
                      "flex w-full items-center rounded-md p-2 hover:bg-muted",
                      activeSlug === article.slug && "bg-muted font-medium"
                    )}
                  >
                    {article.title}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
