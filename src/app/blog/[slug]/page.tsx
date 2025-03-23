import { getPostBySlug } from '@/lib/blog'
import { notFound } from 'next/navigation'

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  
  if (!post) {
    notFound()
  }

  return (
    <article className="max-w-4xl mx-auto py-8 px-4 prose lg:prose-xl">
      <h1>{post.title}</h1>
      <div className="text-sm text-gray-500 mb-8">
        {new Date(post.date).toLocaleDateString()}
      </div>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}
