import { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DocContent } from "@/components/docs/doc-content"
import { getDocContent } from "@/lib/get-doc-content"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Portfolio Documentation - Virgin Fund",
  description: "Documentation for portfolio management in the Virgin Fund platform",
}

export default async function PortfolioDocsPage() {
  const portfolioManagementContent = await getDocContent("portfolio-management")
  const portfolioModelsContent = await getDocContent("portfolio-models")
  const userPortfolioSystemContent = await getDocContent("user-portfolio-system")
  const assetHoldingsContent = await getDocContent("asset-holdings")
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Portfolio Documentation
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Learn everything about portfolio management in the Virgin Fund platform.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Types</CardTitle>
            <CardDescription>Types of portfolios supported by Virgin Fund</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <p><strong>Standard:</strong> Basic investment account</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <p><strong>Margin:</strong> Leveraged trading account</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                <p><strong>Retirement:</strong> IRA/401k accounts</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <p><strong>Managed:</strong> Professionally managed accounts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Features</CardTitle>
            <CardDescription>Key portfolio management capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <p><strong>Multi-portfolio:</strong> Create and manage multiple portfolios</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <p><strong>Performance tracking:</strong> Real-time analytics and reporting</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <p><strong>Asset management:</strong> Buy, sell, and monitor your assets</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <p><strong>Risk controls:</strong> Set limits and safety measures</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="management" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="management">Management</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="user-system">User System</TabsTrigger>
          <TabsTrigger value="holdings">Asset Holdings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="management" className="mt-6">
          <DocContent content={portfolioManagementContent} />
        </TabsContent>
        
        <TabsContent value="models" className="mt-6">
          <DocContent content={portfolioModelsContent} />
        </TabsContent>
        
        <TabsContent value="user-system" className="mt-6">
          <DocContent content={userPortfolioSystemContent} />
        </TabsContent>
        
        <TabsContent value="holdings" className="mt-6">
          <DocContent content={assetHoldingsContent} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
