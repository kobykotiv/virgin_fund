import { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DocContent } from "@/components/docs/doc-content"
import { getDocContent } from "@/lib/get-doc-content"

export const metadata: Metadata = {
  title: "API Reference - Virgin Fund Documentation",
  description: "Complete API reference for the Virgin Fund platform",
}

export default async function ApiReferencePage() {
  const apiRoutesContent = await getDocContent("api-routes")
  const apiDocsContent = await getDocContent("api-documentation-mvp")
  const apiAccessContent = await getDocContent("api-access")
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          API Reference
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Complete documentation for the Virgin Fund API endpoints and integration options.
        </p>
      </div>
      
      <Tabs defaultValue="routes" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="routes">API Routes</TabsTrigger>
          <TabsTrigger value="documentation">API Documentation</TabsTrigger>
          <TabsTrigger value="access">API Access</TabsTrigger>
        </TabsList>
        
        <TabsContent value="routes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>API Routes</CardTitle>
              <CardDescription>
                Overview of all available API endpoints in the Virgin Fund platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocContent content={apiRoutesContent} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documentation" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>
                Detailed documentation for the Virgin Fund API endpoints.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocContent content={apiDocsContent} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="access" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>
                Information about API connections and authentication.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocContent content={apiAccessContent} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>API Keys & Authentication</CardTitle>
            <CardDescription>
              Learn how to authenticate with the Virgin Fund API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">Authentication</h3>
            <p className="text-muted-foreground mb-4">
              All API requests require authentication using JWT tokens. Pass your token in the Authorization header:
            </p>
            
            <div className="bg-muted p-4 rounded-md font-mono text-sm mb-6">
              Authorization: Bearer &lt;your_token&gt;
            </div>
            
            <h3 className="text-lg font-semibold mb-2">Rate Limits</h3>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span>Default</span>
                <Badge variant="outline">100 req/min</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Premium Plan</span>
                <Badge variant="outline">500 req/min</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Enterprise Plan</span>
                <Badge variant="outline">Unlimited</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
