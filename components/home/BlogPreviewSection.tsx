
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default async function BlogPreviewSection({ page = 1, perPage = 4 }: { page?: number; perPage?: number }) {
  // Read blog posts from the blog folder (server-side only)
  const blogDir = path.join(process.cwd(), "blog")
  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".md"))
  const posts = files.map((file) => {
    const content = fs.readFileSync(path.join(blogDir, file), "utf8")
    const { data, content: body } = matter(content)
    return {
      slug: file.replace(/\.md$/, ""),
      title: data.title || file,
      date: data.date || "",
      author: data.author || "",
      tags: data.tags || [],
      excerpt: body.slice(0, 180) + "...",
    }
  })
  // Sort by date descending
  posts.sort((a, b) => (a.date < b.date ? 1 : -1))
  // Pagination
  const start = (page - 1) * perPage
  const paginated = posts.slice(start, start + perPage)

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Latest Blog Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginated.map((post) => (
          <Card key={post.slug}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>{post.date} &mdash; {post.author}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-muted-foreground">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="text-primary underline">Read more</Link>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Pagination controls can be added here */}
    </section>
  )
}
