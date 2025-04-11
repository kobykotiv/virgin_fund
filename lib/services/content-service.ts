import { LandingPageContent, defaultContent } from '../content/landing-page'

class ContentService {
  private content: LandingPageContent = defaultContent

  // Get content with optional section filter
  getContent(section?: keyof LandingPageContent): LandingPageContent | any {
    if (section) {
      return this.content[section]
    }
    return this.content
  }

  // Update content (would typically connect to a CMS or API)
  async updateContent(updates: Partial<LandingPageContent>): Promise<void> {
    this.content = {
      ...this.content,
      ...updates
    }
  }

  // Reset content to defaults
  resetContent(): void {
    this.content = defaultContent
  }
}

export const contentService = new ContentService()