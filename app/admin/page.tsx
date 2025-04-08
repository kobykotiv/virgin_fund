import { DatabaseConnectionOverride } from "@/components/admin/db-connection-override"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Database, Settings } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center">
        <Shield className="mr-2 h-6 w-6" />
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>
      
      <Tabs defaultValue="connections">
        <TabsList className="mb-4">
          <TabsTrigger value="connections">
            <Database className="mr-2 h-4 w-4" />
            Database Connections
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            System Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="connections">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <DatabaseConnectionOverride />
            
            <Card>
              <CardHeader>
                <CardTitle>Connection Status</CardTitle>
                <CardDescription>
                  Current database connection status and statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* This will be implemented separately if needed */}
                <p className="text-sm text-muted-foreground">
                  Connection monitoring will show here
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure global application settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                System settings will be implemented here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
