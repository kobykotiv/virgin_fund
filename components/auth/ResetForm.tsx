"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type FormValues = { email: string }

export default function ResetForm() {
  const { register, handleSubmit, setError } = useForm<FormValues>()

  async function onSubmit(values: FormValues) {
    try {
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({} as any))
        throw new Error(body?.error ?? 'Reset failed')
      }

      alert('If an account exists we sent a reset email')
    } catch (err: any) {
      setError('email', { message: err?.message ?? 'Unexpected error' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm">Email</label>
        <Input {...register('email', { required: true })} placeholder="you@example.com" />
      </div>
      <div className="flex items-center justify-between">
        <Button type="submit">Send reset link</Button>
      </div>
    </form>
  )
}
