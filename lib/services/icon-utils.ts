export class IconUtils {
  private static colors = {
    stock: {
      background: '#1E88E5',
      text: '#FFFFFF'
    },
    crypto: {
      background: '#7B1FA2',
      text: '#FFFFFF'
    },
    forex: {
      background: '#388E3C',
      text: '#FFFFFF'
    },
    option: {
      background: '#F57C00',
      text: '#FFFFFF'
    },
    default: {
      background: '#757575',
      text: '#FFFFFF'
    }
  }

  static generateFallbackIcon(
    symbol: string, 
    type: keyof typeof IconUtils.colors = 'default'
  ): string {
    const colors = this.colors[type]
    const letters = symbol.slice(0, 2).toUpperCase()
    
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
        <rect width="50" height="50" fill="${colors.background}"/>
        <text 
          x="25" 
          y="25" 
          dy=".3em" 
          fill="${colors.text}" 
          font-family="Arial" 
          font-size="20" 
          text-anchor="middle"
        >${letters}</text>
      </svg>
    `)}`
  }

  private static hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash)
  }

  static async getAssetIcon(symbol: string, type: string): Promise<string> {
    try {
      const response = await fetch(`https://api.asset-icons.com/${symbol.toLowerCase()}.svg`)
      if (!response.ok) throw new Error('Icon not found')
      return response.url
    } catch {
      return this.generateFallbackIcon(symbol, type as keyof typeof IconUtils.colors)
    }
  }
}
