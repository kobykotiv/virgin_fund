import { useState, useEffect } from 'react'
import { contentService } from '@/lib/services/content-service'
import { LandingPageContent } from '@/lib/content/landing-page'

export function useContent(section?: keyof LandingPageContent) {
  const [content, setContent] = useState<LandingPageContent | any>(
    contentService.getContent(section)
  )

  const updateContent = async (updates: Partial<LandingPageContent>) => {
    await contentService.updateContent(updates)
    setContent(contentService.getContent(section))
  }

  const resetContent = () => {
    contentService.resetContent()
    setContent(contentService.getContent(section))
  }

  return {
    content,
    updateContent,
    resetContent
  }
}