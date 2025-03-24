"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AlpacaService, AlpacaEnvironment } from "@/lib/alpaca-service";

interface AlpacaContextType {
  alpacaService: AlpacaService;
  isConnected: boolean;
  isLive: boolean;
  connectToAlpaca: (apiKey: string, apiSecret: string, environment: AlpacaEnvironment) => Promise<void>;
  disconnectFromAlpaca: () => void;
  accountInfo: any | null;
  refreshAccountInfo: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AlpacaContext = createContext<AlpacaContextType | undefined>(undefined);

export function AlpacaProvider({ children }: { children: ReactNode }) {
  const [alpacaService, setAlpacaService] = useState<AlpacaService>(new AlpacaService());
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [accountInfo, setAccountInfo] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Try to load credentials from localStorage on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Try to get account info to verify connection
        setIsLoading(true);
        const account = await alpacaService.getAccount();
        setAccountInfo(account);
        setIsConnected(true);
        setIsLive(account.status === "ACTIVE" && !account.trading_blocked);
        setError(null);
      } catch (err) {
        // Not connected or invalid credentials
        setIsConnected(false);
        setAccountInfo(null);
        console.log("Not currently connected to Alpaca");
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  const connectToAlpaca = async (apiKey: string, apiSecret: string, environment: AlpacaEnvironment) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Create new service instance with provided credentials
      const service = new AlpacaService({
        apiKey,
        apiSecret,
        environment
      });
      
      // Test connection by getting account info
      const account = await service.getAccount();
      
      // Save credentials to localStorage
      service.saveCredentialsToStorage({
        apiKey,
        apiSecret,
        environment
      });
      
      // Update state
      setAlpacaService(service);
      setAccountInfo(account);
      setIsConnected(true);
      setIsLive(environment === "live");
      
    } catch (err: any) {
      setError(err.message || "Failed to connect to Alpaca");
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectFromAlpaca = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("alpaca_credentials");
    }
    setIsConnected(false);
    setAccountInfo(null);
    setError(null);
  };

  const refreshAccountInfo = async () => {
    if (!isConnected) return;
    
    try {
      setIsLoading(true);
      const account = await alpacaService.getAccount();
      setAccountInfo(account);
    } catch (err: any) {
      setError(err.message || "Failed to refresh account information");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlpacaContext.Provider
      value={{
        alpacaService,
        isConnected,
        isLive,
        connectToAlpaca,
        disconnectFromAlpaca,
        accountInfo,
        refreshAccountInfo,
        isLoading,
        error
      }}
    >
      {children}
    </AlpacaContext.Provider>
  );
}

export function useAlpaca() {
  const context = useContext(AlpacaContext);
  if (context === undefined) {
    throw new Error("useAlpaca must be used within an AlpacaProvider");
  }
  return context;
}
