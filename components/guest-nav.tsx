"use client"

import { Button } from "@/components/ui/button"
import { Calculator, TrendingUp, BarChart2, Info } from "lucide-react"

export function GuestNav() {
  return (
    <nav className="flex flex-col space-y-1">
      <Button variant="ghost" className="justify-start">
        <Calculator className="mr-2 h-4 w-4" />
        Trade Calculators
      </Button>
      <Button variant="ghost" className="justify-start">  
        <BarChart2 className="mr-2 h-4 w-4" />
        Portfolio Backtesting
      </Button>
      <Button variant="ghost" className="justify-start">
        <TrendingUp className="mr-2 h-4 w-4" />
        Market Analysis 
      </Button>
      <Button variant="ghost" className="justify-start">
        <Info className="mr-2 h-4 w-4" />
        Education
      </Button>
    </nav>
  )
}
