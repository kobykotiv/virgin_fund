"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Key, Shield, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';

interface ApiKeyConfig {
  provider: 'alpaca' | 'coingecko';
  apiKey: string;
  secretKey?: string;
  isPaper?: boolean;
  name?: string;
}

interface ApiKeyStatus {
  provider: string;
  configured: boolean;
  isPaper?: boolean;
  lastVerified?: string;
}

export function ApiKeySetupManager() {
  const { toast } = useToast();
  const [configs, setConfigs] = useState<Record<string, ApiKeyConfig>>({
    alpaca: { provider: 'alpaca', apiKey: '', secretKey: '', isPaper: true, name: 'Alpaca Markets' },
    coingecko: { provider: 'coingecko', apiKey: '', name: 'CoinGecko' }
  });
  const [statuses, setStatuses] = useState<Record<string, ApiKeyStatus>>({});
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState('alpaca');

  // Load existing API key statuses
  useEffect(() => {
    loadApiKeyStatuses();
  }, []);

  const loadApiKeyStatuses = async () => {
    try {
      const [alpacaRes, coingeckoRes] = await Promise.all([
        fetch('/api/alpaca/keys').catch(() => null),
        fetch('/api/coingecko/keys').catch(() => null)
      ]);

      const newStatuses: Record<string, ApiKeyStatus> = {};

      if (alpacaRes?.ok) {
        const alpacaData = await alpacaRes.json();
        newStatuses.alpaca = {
          provider: 'alpaca',
          configured: alpacaData.configured,
          isPaper: alpacaData.is_paper,
          lastVerified: alpacaData.last_verified
        };
      }

      if (coingeckoRes?.ok) {
        const coingeckoData = await coingeckoRes.json();
        newStatuses.coingecko = {
          provider: 'coingecko',
          configured: coingeckoData.configured,
          lastVerified: coingeckoData.last_verified
        };
      }

      setStatuses(newStatuses);
    } catch (error) {
      console.error('Failed to load API key statuses:', error);
    }
  };

  const validateCredentials = async (config: ApiKeyConfig): Promise<boolean> => {
    try {
      if (config.provider === 'alpaca') {
        const response = await fetch('/api/alpaca/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apiKey: config.apiKey,
            secretKey: config.secretKey,
            isPaper: config.isPaper
          })
        });
        return response.ok;
      } else if (config.provider === 'coingecko') {
        const response = await fetch('/api/coingecko/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apiKey: config.apiKey
          })
        });
        return response.ok;
      }
      return false;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  };

  const saveApiKeys = async (config: ApiKeyConfig) => {
    const provider = config.provider;
    setIsLoading(prev => ({ ...prev, [provider]: true }));

    try {
      // Validate credentials first
      const isValid = await validateCredentials(config);
      if (!isValid) {
        throw new Error('Invalid API credentials');
      }

      // Save encrypted keys
      const response = await fetch(`/api/${provider}/keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save API keys');
      }

      // Update status
      await loadApiKeyStatuses();

      // Clear form
      setConfigs(prev => ({
        ...prev,
        [provider]: {
          ...prev[provider],
          apiKey: '',
          secretKey: ''
        }
      }));

      toast({
        title: "Success",
        description: `${config.name} API keys configured and encrypted successfully`,
      });

    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save API keys",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  const testConnection = async (provider: string) => {
    try {
      const response = await fetch(`/api/${provider}/test`);
      if (response.ok) {
        toast({
          title: "Connection Successful",
          description: `Successfully connected to ${provider} API`,
        });
      } else {
        throw new Error('Connection failed');
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: `Failed to connect to ${provider} API`,
        variant: "destructive",
      });
    }
  };

  const renderProviderForm = (provider: 'alpaca' | 'coingecko') => {
    const config = configs[provider];
    const status = statuses[provider];
    const loading = isLoading[provider];

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              {config.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              {status?.configured && (
                <Badge variant="outline" className="text-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Configured
                </Badge>
              )}
              {status?.isPaper && (
                <Badge variant="outline">Paper Trading</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your API keys are encrypted server-side using AES-256-GCM and never stored in plain text.
              They are only decrypted when needed for API calls.
            </AlertDescription>
          </Alert>

          {status?.configured ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-800">API keys configured and encrypted</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testConnection(provider)}
                >
                  Test Connection
                </Button>
              </div>

              {status.lastVerified && (
                <p className="text-sm text-muted-foreground">
                  Last verified: {new Date(status.lastVerified).toLocaleString()}
                </p>
              )}
            </div>
          ) : (
            <form onSubmit={(e) => {
              e.preventDefault();
              saveApiKeys(config);
            }} className="space-y-4">
              <div>
                <Label htmlFor={`${provider}-api-key`}>
                  API Key {provider === 'alpaca' && '(Public Key)'}
                </Label>
                <Input
                  id={`${provider}-api-key`}
                  type="password"
                  value={config.apiKey}
                  onChange={(e) => setConfigs(prev => ({
                    ...prev,
                    [provider]: { ...prev[provider], apiKey: e.target.value }
                  }))}
                  placeholder={`Enter your ${config.name} API key`}
                  required
                />
              </div>

              {provider === 'alpaca' && (
                <>
                  <div>
                    <Label htmlFor="alpaca-secret-key">Secret Key</Label>
                    <Input
                      id="alpaca-secret-key"
                      type="password"
                      value={config.secretKey}
                      onChange={(e) => setConfigs(prev => ({
                        ...prev,
                        alpaca: { ...prev.alpaca, secretKey: e.target.value }
                      }))}
                      placeholder="Enter your Alpaca secret key"
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="alpaca-paper"
                      checked={config.isPaper}
                      onCheckedChange={(checked) => setConfigs(prev => ({
                        ...prev,
                        alpaca: { ...prev.alpaca, isPaper: checked }
                      }))}
                    />
                    <Label htmlFor="alpaca-paper">Use Paper Trading Account</Label>
                  </div>
                </>
              )}

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save & Encrypt Keys'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const urls = {
                      alpaca: 'https://alpaca.markets/docs/trading/api/',
                      coingecko: 'https://www.coingecko.com/en/api'
                    };
                    window.open(urls[provider], '_blank');
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Get API Key
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            API Key Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Configure your API keys to enable live market data, trading, and alerts.
              Keys are encrypted server-side and never exposed to the client.
            </AlertDescription>
          </Alert>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="alpaca">Alpaca Markets</TabsTrigger>
              <TabsTrigger value="coingecko">CoinGecko</TabsTrigger>
            </TabsList>

            <TabsContent value="alpaca" className="mt-6">
              {renderProviderForm('alpaca')}
            </TabsContent>

            <TabsContent value="coingecko" className="mt-6">
              {renderProviderForm('coingecko')}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
