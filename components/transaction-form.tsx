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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const formSchema = z.object({
  assetId: z.string({
    required_error: "Please select an asset",
  }),
  type: z.enum(["buy", "sell"], {
    required_error: "Please select transaction type",
  }),
  quantity: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, {
    message: "Quantity must be a positive number",
  }),
  price: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, {
    message: "Price must be a positive number",
  }),
})

interface Asset {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
}

interface TransactionFormProps {
  portfolioId: string;
  assets: Asset[];
  onComplete: () => void;
  onCancel: () => void;
}

export function TransactionForm({ portfolioId, assets, onComplete, onCancel }: TransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assetId: "",
      type: "buy",
      quantity: "",
      price: "",
    },
  })

  const watchAssetId = form.watch("assetId")
  
  // Set current price when asset is selected
  const onAssetChange = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId)
    if (asset) {
      form.setValue("price", asset.currentPrice.toString())
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setError(null)
    
    try {
      // In a real app, this would be an API call
      console.log("Recording transaction:", {
        portfolioId,
        assetId: values.assetId,
        type: values.type,
        quantity: parseFloat(values.quantity),
        price: parseFloat(values.price),
        timestamp: new Date(),
      })
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onComplete()
    } catch (err) {
      setError("An error occurred while recording the transaction. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {assets.length === 0 ? (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Assets</AlertTitle>
            <AlertDescription>Add assets to your portfolio before recording transactions.</AlertDescription>
          </Alert>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="assetId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value)
                        onAssetChange(value)
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an asset" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {assets.map(asset => (
                          <SelectItem key={asset.id} value={asset.id}>
                            {asset.symbol} - {asset.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Transaction Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-6"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="buy" />
                          </FormControl>
                          <FormLabel className="font-normal">Buy</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="sell" />
                          </FormControl>
                          <FormLabel className="font-normal">Sell</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                        Number of shares.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Share</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0.01" {...field} />
                      </FormControl>
                      <FormDescription>
                        Current market price in USD.
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
                  {isSubmitting ? "Processing..." : "Record Transaction"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}
