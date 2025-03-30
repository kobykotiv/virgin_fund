"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiConnection } from "@/types/db"
import { PlusCircle, Trash2, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export function ConnectionManager() {
  const [connections, setConnections] = useState<ApiConnection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddConnection, setShowAddConnection] = useState(false)
  
  // Form state for new connection
  const [provider, setProvider] = useState<string>('alpaca')
  const [name, setName] = useState<string>('')
  const [apiKey, setApiKey] = useState<string>('')
  const [secretKey, setSecretKey] = useState<string>('')
  const [passphrase, setPassphrase] = useState<string>('')
  const [canTrade, setCanTrade] = useState<boolean>(false)
  const [canWithdraw, setCanWithdraw] = useState<boolean>(false)
  
  useEffect(() => {
    fetchConnections()
  }, [])
  
  const fetchConnections = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/connections')
      if (!response.ok) throw new Error('Failed to fetch connections')
      
      const data = await response.json()
      setConnections(data)
    } catch (err: any) {
      console.error('Error fetching connections:', err)
      setError(err.message || 'Failed to load connections')
    } finally {
      setLoading(false)
    }
  }
  
  const addConnection = async () => {
    try {
      if (!provider || !apiKey || !secretKey) {
        toast({
          variant: "destructive",
          title: "Missing information",
          description: "Please fill in all required fields"
        })
        return
      }
      
      const response = await fetch('/api/connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name || `${provider} Connection`,
          provider,
          credentials: {
            apiKey,
            secretKey,
            ...(passphrase && { passphrase })
          },
          permissions: {
            canRead: true,
            canTrade,
            canWithdraw
          }
        })
      })
      
      if (!response.ok) throw new Error('Failed to add connection')
      
      // Reset form and refresh connections
      setShowAddConnection(false)
      resetForm()
      fetchConnections()
      
      toast({
        title: "Connection added",
        description: "Your API connection was successfully added"
      })
    } catch (err: any) {
      console.error('Error adding connection:', err)
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || 'Failed to add connection'
      })
    }
  }
  
  const deleteConnection = async (id: string) => {
    try {
      const response = await fetch(`/api/connections?id=${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete connection')
      
      fetchConnections()
      
      toast({
        title: "Connection deleted",
        description: "Your API connection was successfully removed"
      })
    } catch (err: any) {
      console.error('Error deleting connection:', err)
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || 'Failed to delete connection'
      })
    }
  }
  
  const resetForm = () => {
    setProvider('alpaca')
    setName('')
    setApiKey('')
    setSecretKey('')
    setPassphrase('')
    setCanTrade(false)
    setCanWithdraw(false)
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'inactive':
        return <XCircle className="h-4 w-4 text-amber-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">API Connections</h2>
        <Button onClick={() => setShowAddConnection(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Connection
        </Button>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-1/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <p>{error}</p>
              <Button variant="outline" className="mt-4" onClick={fetchConnections}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : connections.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <p>No API connections found</p>
              <Button variant="outline" className="mt-4" onClick={() => setShowAddConnection(true)}>
                Add your first connection
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {connections.map((connection) => (
            <Card key={connection.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg">{connection.name}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="capitalize">
                        {connection.provider}
                      </Badge>
                      <div className="flex items-center ml-2">
                        {getStatusIcon(connection.status)}
                        <span className="text-xs ml-1 capitalize">{connection.status}</span>
                      </div>
                    </div>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="text-sm flex justify-between">
                    <span className="text-muted-foreground">API Key:</span>
                    <span className="font-mono">{connection.credentials.apiKey}</span>
                  </div>
                  <div className="text-sm flex justify-between">
                    <span className="text-muted-foreground">Last Checked:</span>
                    <span>{new Date(connection.lastChecked).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
                  <Badge variant={connection.permissions.canRead ? "default" : "outline"}>Read</Badge>
                  <Badge variant={connection.permissions.canTrade ? "default" : "outline"}>Trade</Badge>
                  <Badge variant={connection.permissions.canWithdraw ? "default" : "outline"}>Withdraw</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="destructive" size="sm" onClick={() => deleteConnection(connection.id)} className="ml-auto">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <Dialog open={showAddConnection} onOpenChange={setShowAddConnection}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add API Connection</DialogTitle>
            <DialogDescription>
              Enter your API credentials to connect with trading platforms.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="alpaca">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="alpaca" onClick={() => setProvider('alpaca')}>Alpaca</TabsTrigger>
              <TabsTrigger value="binance" onClick={() => setProvider('binance')}>Binance</TabsTrigger>
              <TabsTrigger value="coingecko" onClick={() => setProvider('coingecko')}>CoinGecko</TabsTrigger>
            </TabsList>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Connection Name</Label>
                <Input 
                  id="name" 
                  placeholder={`${provider.charAt(0).toUpperCase() + provider.slice(1)} Connection`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input 
                  id="apiKey" 
                  placeholder="Your API key" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secretKey">Secret Key</Label>
                <Input 
                  id="secretKey" 
                  type="password" 
                  placeholder="Your secret key" 
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                />
              </div>
              
              {provider === 'binance' && (
                <div className="space-y-2">
                  <Label htmlFor="passphrase">Passphrase (Optional)</Label>
                  <Input 
                    id="passphrase" 
                    type="password" 
                    placeholder="API passphrase if required" 
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                  />
                </div>
              )}
              
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="canTrade">Allow Trading</Label>
                  <Switch 
                    id="canTrade" 
                    checked={canTrade}
                    onCheckedChange={setCanTrade}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="canWithdraw">Allow Withdrawals</Label>
                  <Switch 
                    id="canWithdraw" 
                    checked={canWithdraw}
                    onCheckedChange={setCanWithdraw}
                  />
                </div>
              </div>
            </div>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddConnection(false)}>Cancel</Button>
            <Button onClick={addConnection}>Add Connection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
