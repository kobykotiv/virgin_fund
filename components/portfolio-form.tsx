"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Portfolio name must be at least 3 characters.",
  }),
  type: z.enum(["standard", "margin"], {
    required_error: "Please select a portfolio type.",
  }),
  risk: z.enum(["conservative", "moderate", "aggressive"], {
    required_error: "Please select a risk level.",
  }),
})

interface PortfolioFormProps {
  initialData?: {
    id?: string;
    name: string;
    type: "standard" | "margin";
    risk: "conservative" | "moderate" | "aggressive";
  }
}

export function PortfolioForm({ initialData }: PortfolioFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      type: "standard",
      risk: "moderate",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setError(null)
    
    try {
      // In a real app, this would be an API call
      console.log("Form values:", values)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (initialData?.id) {
        // Update existing portfolio
        router.push(`/portfolio/${initialData.id}`)
      } else {
        // Create new portfolio
        router.push("/portfolio")
      }
    } catch (err) {
      setError("An error occurred while saving the portfolio. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData?.id ? "Edit Portfolio" : "Create Portfolio"}</CardTitle>
        <CardDescription>
          {initialData?.id 
            ? "Update your portfolio settings" 
            : "Set up a new portfolio to track your investments"}
        </CardDescription>
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portfolio Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Growth Portfolio" {...field} />
                  </FormControl>
                  <FormDescription>
                    Choose a name that describes your investment strategy.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portfolio Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select portfolio type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="margin">Margin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Standard is regular investment, margin allows borrowing.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="risk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Level</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select risk level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="conservative">Conservative</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="aggressive">Aggressive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose based on your risk tolerance.
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
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : initialData?.id ? "Update Portfolio" : "Create Portfolio"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
