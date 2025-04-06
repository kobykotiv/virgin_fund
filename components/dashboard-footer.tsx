import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Github, Twitter, Globe, Mail, Heart, Coffee } from "lucide-react"

export function DashboardFooter() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="mt-auto border-t bg-muted/20 py-6">
      <div className="container flex flex-col space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Virgin Fund</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:underline text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:underline text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:underline text-muted-foreground hover:text-foreground transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/docs" className="hover:underline text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/api" className="hover:underline text-muted-foreground hover:text-foreground transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="/learn" className="hover:underline text-muted-foreground hover:text-foreground transition-colors">
                  Learning Center
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="hover:underline text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:underline text-muted-foreground hover:text-foreground transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Connect</h3>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" asChild aria-label="GitHub">
                <Link href="https://github.com/virginfund" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild aria-label="Twitter">
                <Link href="https://twitter.com/virginfund" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild aria-label="Website">
                <Link href="https://virgin-fund.app" target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild aria-label="Email">
                <Link href="mailto:contact@virgin-fund.app">
                  <Mail className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <span>© {currentYear} Virgin Fund. All rights reserved.</span>
          </div>
          
          <div className="flex items-center space-x-1 mt-4 md:mt-0">
            <span>Powered by</span>
            <Link href="https://alpaca.markets" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Alpaca Markets
            </Link>
            <span>•</span>
            <Link href="https://coingecko.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
              CoinGecko
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
              <Heart className="h-3.5 w-3.5 text-red-500" />
              <span>Sponsor</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
              <Coffee className="h-3.5 w-3.5" />
              <span>Buy us a coffee</span>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
