"use client"

import React from "react"
import DashboardLayout from "@/components/DashboardLayout"
import DcaForm from "@/components/strategies/DcaForm"

export default function NewDcaPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Create DCA Strategy</h1>
        <DcaForm />
      </div>
    </DashboardLayout>
  )
}
