"use client"

import React from 'react'
import ResetForm from '@/components/auth/ResetForm'

export default function ResetPage() {
  return (
    <div className="max-w-xl mx-auto py-12">
      <h1 className="text-2xl font-semibold mb-4">Reset password</h1>
      <ResetForm />
    </div>
  )
}
