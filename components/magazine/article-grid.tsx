"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface Article {
  id: string
  title: string
  excerpt: string
  image: string
  category: string
  date: string
  author: string
}

interface ArticleGridProps {
  articles: Article[]
  columns?: number
}

export function ArticleGrid({ articles, columns = 3 }: ArticleGridProps) {
  return (
    <div className={`grid gap-6 grid-cols-1 md:grid-cols-${columns}`}>
      {articles.map((article) => (
        <Card key={article.id}>
          <div className="aspect-video relative overflow-hidden">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge>{article.category}</Badge>
              <span className="text-sm text-muted-foreground">{article.date}</span>
            </div>
            <CardTitle className="line-clamp-2">{article.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground line-clamp-3">{article.excerpt}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
