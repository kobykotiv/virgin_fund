import { PortfolioForm } from "@/components/portfolio-form"

// Mock data - would normally be fetched based on ID
const getPortfolio = (id: string) => {
  const mockPortfolios = [
    { id: "1", name: "Growth Portfolio", type: "standard" as const, risk: "aggressive" as const },
    { id: "2", name: "Dividend Income", type: "standard" as const, risk: "conservative" as const },
    { id: "3", name: "Tech Focus", type: "margin" as const, risk: "moderate" as const },
  ]
  
  return mockPortfolios.find(p => p.id === id)
}

export default function EditPortfolioPage({ params }: { params: { id: string } }) {
  const portfolio = getPortfolio(params.id)
  
  if (!portfolio) {
    return (
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Portfolio Not Found</h1>
        <p>The requested portfolio could not be found.</p>
      </div>
    )
  }
  
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Edit Portfolio</h1>
      <PortfolioForm initialData={portfolio} />
    </div>
  )
}
