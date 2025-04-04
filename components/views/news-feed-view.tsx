

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LayoutGrid, List, Search } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface NewsItem {
  title: string
  description: string
  link: string
  pubDate: string
  source: string
  image?: string
}

interface SentimentAnalysis {
  score: number