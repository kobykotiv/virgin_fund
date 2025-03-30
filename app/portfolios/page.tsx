import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { connectToDatabase } from "@/lib/db"
import { PortfolioCard } from "@/components/portfolio-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "My Portfolios",
  description: "Manage your investment portfolios",
}

async function getPortfolios(userId: string) {
  const db = await connectToDatabase()
  
  const portfolios = await db.collection("portfolios")
    .find({ userId })
    .toArray()
    
  return portfolios
}

export default async function PortfoliosPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect("/signin?callbackUrl=/portfolios")
  }
  
  const portfolios = await getPortfolios(session.user.id)
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Portfolios</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your investment portfolios
          </p>
        </div>
        <Button asChild>
          <Link href="/portfolios/new">
            <Plus className="mr-2 h-4 w-4" /> Create Portfolio
          </Link>
        </Button>
      </div>
      
      {portfolios.length === 0 ? (
        <div className="text-center py-16 bg-muted/40 rounded-lg">
          <h3 className="text-xl font-medium">No portfolios found</h3>
          <p className="text-muted-foreground mt-1 mb-6">
            Get started by creating your first portfolio
          </p>
          <Button asChild>
            <Link href="/portfolios/new">
              <Plus className="mr-2 h-4 w-4" /> Create Portfolio
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio: any) => (
            <PortfolioCard
              key={portfolio._id}
              id={portfolio._id.toString()}
              name={portfolio.name}
              description={portfolio.description}
              totalValue={portfolio.totalValue || 0}
              performance={portfolio.performance || { day: 0, week: 0, month: 0 }}
              strategy={portfolio.strategy}
              isPublic={portfolio.sharing?.isPublic}
              botCount={portfolio.bots?.length || 0}
              assetCount={portfolio.assetCount || 0}
            />
          ))}
        </div>
      )}
    </div>
  )
}
