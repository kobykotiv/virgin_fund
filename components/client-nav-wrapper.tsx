"use client"

import React from "react"
import { DashboardNav } from '@/components/dashboard-nav'

interface ClientNavWrapperProps {
  items: any[]
}

export default function ClientNavWrapper({ items }: ClientNavWrapperProps) {
  return <DashboardNav items={items} />
}
