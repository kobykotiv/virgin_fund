import { Metadata } from 'next'
import { portfolios } from '@/lib/demo-portfolios'
 
interface Props {
  params: { id: string }
}
 
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const portfolio = portfolios.find(p => p.id === params.id)
 
  if (!portfolio) {
    return {
      title: 'Portfolio Not Found',
    }
  }
 
  return {
    title: `${portfolio.name} - Portfolio Details`,
    description: portfolio.focus,
    openGraph: {
      title: `${portfolio.name} - Portfolio Details`,
      description: portfolio.focus,
      images: [{
        url: `/api/og/portfolio?id=${params.id}`,
        width: 1200,
        height: 630,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${portfolio.name} - Portfolio Details`,
      description: portfolio.focus,
      images: [`/api/og/portfolio?id=${params.id}`],
    },
  }
}

export default function PortfolioPage({ params }: Props) {
  // ...existing portfolio page code...
}
