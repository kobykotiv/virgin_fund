import { Metadata } from "next"
import { getDocContent } from "@/lib/get-doc-content"
import { DocContent } from "@/components/docs/doc-content"
import { notFound } from "next/navigation"

interface DocPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({
  params,
}: DocPageProps): Promise<Metadata> {
  try {
    const doc = await getDocContent(params.slug)
    const title = doc.split('\n')[0].replace(/^#\s+/, '')
    
    return {
      title: `${title} - Virgin Fund Documentation`,
      description: `Learn about ${title} in the Virgin Fund platform`,
    }
  } catch {
    return {
      title: "Documentation - Virgin Fund",
      description: "Virgin Fund documentation",
    }
  }
}

export default async function DocPage({ params }: DocPageProps) {
  try {
    const content = await getDocContent(params.slug)
    
    return (
      <DocContent content={content} />
    )
  } catch {
    notFound()
  }
}
