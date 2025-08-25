"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Form, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type FormValues = {
  email: string
  password: string
}

export default function SignInForm() {
  const router = useRouter()
  const form = useForm<FormValues>({ defaultValues: { email: "", password: "" } })

  async function onSubmit(values: FormValues) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "same-origin",
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({} as any))
        throw new Error(body?.error ?? "Sign in failed")
      }

      // success -> server set cookie; navigate to dashboard
      router.push("/dashboard")
    } catch (err: any) {
      form.setError("email", { message: err?.message ?? "Unexpected error" })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md w-full space-y-4">
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input {...form.register("email", { required: "Email is required" })} type="email" placeholder="you@example.com" />
          </FormControl>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <Input {...form.register("password", { required: "Password is required" })} type="password" placeholder="Password" />
          </FormControl>
          <FormMessage />
        </FormItem>

        <div className="flex items-center justify-between">
          <Button type="submit">Sign in</Button>
          <a className="text-sm text-muted-foreground hover:underline" href="/auth/forgot">Forgot?</a>
        </div>
      </form>
    </Form>
  )
}
