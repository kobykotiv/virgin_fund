"use client";

import { useState } from "react";
import { useAlpaca } from "@/context/alpaca-context";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, KeyRound, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ApiKeysPage() {
  const { connectToAlpaca, isConnected, isLive, disconnectFromAlpaca, isLoading, error } = useAlpaca();
  
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [isPaperTrading, setIsPaperTrading] = useState(true);
  
  const handleConnect = async () => {
    if (!apiKey || !apiSecret) return;
    await connectToAlpaca(apiKey, apiSecret, isPaperTrading ? "paper" : "live");
  };

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">API Integration</h1>
          <p className="text-muted-foreground">
            Connect your Alpaca account to enable trading and market data.
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5" />
                  Alpaca API Keys
                </CardTitle>
                <CardDescription>
                  Enter your Alpaca API keys to connect to your trading account
                </CardDescription>
              </div>
              
              {isConnected && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {isLive ? "Live Trading" : "Paper Trading"}
                  </span>
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            {isConnected ? (
              <div className="space-y-4">
                <div className="rounded-md bg-muted p-4">
                  <p className="text-sm">
                    You are currently connected to Alpaca's {isLive ? "live" : "paper"} trading API.
                  </p>
                </div>
                
                <Button variant="outline" onClick={disconnectFromAlpaca}>
                  Disconnect from Alpaca
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <Input
                      id="api-key"
                      placeholder="Enter your Alpaca API key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="api-secret">API Secret</Label>
                    <Input
                      id="api-secret"
                      type="password"
                      placeholder="Enter your Alpaca API secret"
                      value={apiSecret}
                      onChange={(e) => setApiSecret(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Paper Trading</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable paper trading mode (simulated trading with fake money)
                      </p>
                    </div>
                    <Switch
                      checked={isPaperTrading}
                      onCheckedChange={setIsPaperTrading}
                    />
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>
                    Don't have an Alpaca account yet?{" "}
                    <a
                      href="https://app.alpaca.markets/signup"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary inline-flex items-center hover:underline"
                    >
                      Sign up for free
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter>
            {!isConnected && (
              <Button
                onClick={handleConnect}
                disabled={!apiKey || !apiSecret || isLoading}
                className="w-full"
              >
                {isLoading ? "Connecting..." : "Connect to Alpaca"}
              </Button>
            )}
          </CardFooter>
        </Card>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Available Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Paper Trading</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Practice trading with simulated money in a risk-free environment
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Crypto Trading</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Trade cryptocurrencies 24/7 with minimal fees
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Fractional Trading</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Buy and sell fractions of shares and cryptocurrencies
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Margin Trading</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Trade with leverage and short-selling capabilities
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
