"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type FormValues = { name?: string; email: string; password: string }

export default function SignUpForm() {
  const router = useRouter()
  const { register, handleSubmit, setError } = useForm<FormValues>()

  async function onSubmit(values: FormValues) {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({} as any))
        throw new Error(body?.error ?? 'Registration failed')
      }

      router.push('/dashboard')
    } catch (err: any) {
      setError('email', { message: err?.message ?? 'Unexpected error' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm">Name</label>
        <Input {...register('name')} placeholder="Your full name" />
      </div>
      <div>
        <label className="block text-sm">Email</label>
        <Input {...register('email', { required: true })} placeholder="you@example.com" />
      </div>
      <div>
        <label className="block text-sm">Password</label>
        <Input {...register('password', { required: true })} type="password" />
      </div>
      <div className="flex items-center justify-between">
        <Button type="submit">Create account</Button>
      </div>
    </form>
  )
}
