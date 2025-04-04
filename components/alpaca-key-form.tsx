import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { useToast } from "./ui/use-toast"
import { AlpacaClient, type AlpacaConfig } from "@/lib/alpaca-client"

const formSchema = z.object({
  apiKey: z.string().min(1, "API Key is required"),
  secretKey: z.string().min(1, "Secret Key is required"),
  isPaper: z.boolean().default(true),
})

export function AlpacaKeyForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isConfigured, setIsConfigured] = useState(AlpacaClient.hasValidConfig())

  const form = useForm<AlpacaConfig>({
    resolver: zodResolver(formSchema),
    defaultValues: AlpacaClient.getConfig() || {
      apiKey: "",
      secretKey: "",
      isPaper: true,
    },
  })

  const onSubmit = async (data: AlpacaConfig) => {
    setIsLoading(true)
    try {
      const isValid = await AlpacaClient.testConnection(data)
      if (!isValid) {
        throw new Error("Invalid API credentials")
      }

      AlpacaClient.saveConfig(data)
      setIsConfigured(true)
      toast({
        title: "Success",
        description: "API keys configured successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save API keys",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key</Label>
          <Input
            id="apiKey"
            type="password"
            {...form.register("apiKey")}
            placeholder="Your Alpaca API Key"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="secretKey">Secret Key</Label>
          <Input
            id="secretKey"
            type="password"
            {...form.register("secretKey")}
            placeholder="Your Alpaca Secret Key"
          />
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="isPaper"
            checked={form.watch("isPaper")}
            onCheckedChange={(checked) => form.setValue("isPaper", checked)}
          />
          <Label htmlFor="isPaper">Use Paper Trading</Label>
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Testing Connection..." : "Save API Keys"}
      </Button>

      {isConfigured && (
        <p className="text-sm text-green-600">
          ✓ API keys configured
        </p>
      )}
    </form>
  )
}
