"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Info, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const formSchema = z.object({
  symbol: z.string().min(1, {
    message: "Symbol is required",
  }).max(10),
  quantity: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, {
    message: "Quantity must be a positive number",
  }),
  averagePrice: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, {
    message: "Price must be a positive number",
  }),
})

interface AssetFormProps {
  portfolioId: string;
  onComplete: () => void;
  onCancel: () => void;
}

export function AssetForm({ portfolioId, onComplete, onCancel }: AssetFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stockInfo, setStockInfo] = useState<{name?: string, price?: number} | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: "",
      quantity: "",
      averagePrice: "",
    },
  })

  const watchSymbol = form.watch("symbol")

  // Simulate fetching stock information
  const searchStock = async () => {
    if (!watchSymbol || watchSymbol.length < 2) return;
    
    setIsSearching(true)
    try {
      // This would be an API call to fetch stock info
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock stock info
      const mockStocks: Record<string, {name: string, price: number}> = {
        "AAPL": { name: "Apple Inc.", price: 189.84 },
        "MSFT": { name: "Microsoft Corporation", price: 378.85 },
        "GOOG": { name: "Alphabet Inc.", price: 142.17 },
        "AMZN": { name: "Amazon.com, Inc.", price: 152.12 },
        "NVDA": { name: "NVIDIA Corporation", price: 593.28 },
      }
      
      const upperSymbol = watchSymbol.toUpperCase()
      const stock = mockStocks[upperSymbol]
      
      if (stock) {
        setStockInfo(stock)
        form.setValue("averagePrice", stock.price.toString())
      } else {
        setStockInfo(null)
      }
    } catch (err) {
      console.error("Error fetching stock info:", err)
      setStockInfo(null)
    } finally {
      setIsSearching(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setError(null)
    
    try {
      // In a real app, this would be an API call
      console.log("Adding asset to portfolio:", {
        portfolioId,
        symbol: values.symbol.toUpperCase(),
        quantity: parseFloat(values.quantity),
        averagePrice: parseFloat(values.averagePrice),
      })
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onComplete()
    } catch (err) {
      setError("An error occurred while adding the asset. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Asset</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Symbol</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="AAPL" {...field} onChange={(e) => {
                        field.onChange(e)
                        setStockInfo(null)
                      }} />
                    </FormControl>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={searchStock}
                      disabled={isSearching || !watchSymbol || watchSymbol.length < 2}
                    >
                      {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                    </Button>
                  </div>
                  <FormDescription>
                    Enter the ticker symbol (e.g., AAPL for Apple).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {stockInfo && (
              <Alert className="mb-2">
                <Info className="h-4 w-4" />
                <AlertTitle>{watchSymbol.toUpperCase()}</AlertTitle>
                <AlertDescription>
                  {stockInfo.name} - Current Price: ${stockInfo.price?.toFixed(2)}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" min="0.000001" {...field} />
                    </FormControl>
                    <FormDescription>
                      Number of shares to add.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="averagePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Average Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" min="0.01" {...field} />
                    </FormControl>
                    <FormDescription>
                      Price per share in USD.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Asset"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
