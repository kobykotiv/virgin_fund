import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'

export default async function BlogPage() {
  const posts = await getAllPosts()
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Trading Blog</h1>
      <div className="grid gap-6">
        {posts.map((post) => (
          <article key={post.slug} className="border rounded-lg p-6">
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
            </Link>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            <div className="text-sm text-gray-500">
              {new Date(post.date).toLocaleDateString()}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
