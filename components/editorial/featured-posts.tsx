import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

interface Post {
  title: string
  excerpt: string
  slug: string
  category: string
  readingTime: string
  thumbnail: string
  date: string
}

export function FeaturedPosts({ posts }: { posts: Post[] }) {
  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tight mb-8">Featured Resources</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="aspect-video relative">
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-2">
                    {post.category}
                  </Badge>
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </p>
                </CardContent>
                <CardFooter className="px-6 py-4 border-t flex justify-between text-sm text-muted-foreground">
                  <span>{post.date}</span>
                  <span>{post.readingTime} min read</span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
