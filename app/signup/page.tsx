"use client"

import React from 'react'
import SignUpForm from '@/components/auth/SignUpForm'

export default function SignUpPage() {
  return (
    <div className="max-w-xl mx-auto py-12">
      <h1 className="text-2xl font-semibold mb-4">Create an account</h1>
      <SignUpForm />
    </div>
  )
}
