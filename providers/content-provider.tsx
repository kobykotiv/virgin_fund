"use client"

import { createContext, useContext, useState, useEffect } from "react"
import type { LandingPageContent } from "@/lib/content/landing-page"
import { defaultContent } from "@/lib/content/landing-page"

interface ContentContextType {
  content: LandingPageContent
  updateContent: (newContent: LandingPageContent) => Promise<void>
  resetContent: () => void
  isAdmin: boolean
}

const ContentContext = createContext<ContentContextType | undefined>(undefined)

const STORAGE_KEY = "landing_page_content"

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<LandingPageContent>(defaultContent)
  const [isAdmin, setIsAdmin] = useState(false)

  // Load content from localStorage on mount
  useEffect(() => {
    const storedContent = localStorage.getItem(STORAGE_KEY)
    if (storedContent) {
      try {
        setContent(JSON.parse(storedContent))
      } catch (error) {
        console.error("Error parsing stored content:", error)
        // Reset to default if there's an error
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultContent))
      }
    }

    // Check admin status - this could be more sophisticated in a real app
    const isUserAdmin = localStorage.getItem("isAdmin") === "true"
    setIsAdmin(isUserAdmin)
  }, [])

  const updateContent = async (newContent: LandingPageContent) => {
    if (!isAdmin) {
      throw new Error("Unauthorized: Only admins can update content")
    }

    try {
      // In a real app, you would make an API call here to persist changes
      // For now, we'll just use localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newContent))
      setContent(newContent)
    } catch (error) {
      console.error("Error updating content:", error)
      throw error
    }
  }

  const resetContent = () => {
    if (!isAdmin) {
      throw new Error("Unauthorized: Only admins can reset content")
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultContent))
    setContent(defaultContent)
  }

  return (
    <ContentContext.Provider value={{ content, updateContent, resetContent, isAdmin }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const context = useContext(ContentContext)
  if (context === undefined) {
    throw new Error("useContent must be used within a ContentProvider")
  }
  return context
}