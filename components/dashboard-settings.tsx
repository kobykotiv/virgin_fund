"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"; // For Paper/Live toggle
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export function DashboardSettings() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [isPaper, setIsPaper] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasKeys, setHasKeys] = useState(false);
  const [isCheckingKeys, setIsCheckingKeys] = useState(true);

  // Fetch key status on component mount
  useEffect(() => {
    const checkKeyStatus = async () => {
      setIsCheckingKeys(true);
      try {
        const response = await fetch('/api/user/alpaca-credentials');
        if (response.ok) {
          const data = await response.json();
          setHasKeys(data.hasKeys);
        } else {
          // Handle error, maybe show a toast
          console.error("Failed to check key status");
           toast({
             title: "Error",
             description: "Could not check Alpaca key status.",
             variant: "destructive",
           });
        }
      } catch (error) {
        console.error("Error checking key status:", error);
         toast({
           title: "Error",
           description: "Could not check Alpaca key status.",
           variant: "destructive",
         });
      } finally {
        setIsCheckingKeys(false);
      }
    };
    checkKeyStatus();
  }, [toast]); // Added toast to dependency array

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/user/alpaca-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, secretKey, isPaper }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save credentials');
      }

      setHasKeys(true); // Assume keys are now set
      toast({
        title: "Success",
        description: "Alpaca credentials saved successfully.",
      });
      // Clear fields after successful save for security
      setApiKey(""); 
      setSecretKey("");

    } catch (error) {
      console.error("Error saving credentials:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not save credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alpaca API Credentials</CardTitle>
        <CardDescription>
          Connect your Alpaca account to enable trading features. Your keys are stored securely.
          {isCheckingKeys ? (
             <span className="ml-2 text-xs text-muted-foreground">(Checking status...)</span>
          ) : hasKeys ? (
             <span className="ml-2 text-xs text-green-600">(Credentials are set)</span>
          ) : (
             <span className="ml-2 text-xs text-orange-600">(Credentials not set)</span>
          )}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password" // Use password type to obscure input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Alpaca API Key"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secretKey">Secret Key</Label>
            <Input
              id="secretKey"
              type="password" // Use password type to obscure input
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter your Alpaca Secret Key"
              required
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="isPaper"
              checked={isPaper}
              onCheckedChange={setIsPaper}
              disabled={isLoading}
            />
            <Label htmlFor="isPaper">Use Paper Trading Account</Label>
          </div>
           <p className="text-xs text-muted-foreground">
             It is recommended to start with a Paper Trading account. Ensure this matches the account type your API keys belong to.
           </p>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading || isCheckingKeys}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Saving..." : "Save Credentials"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
