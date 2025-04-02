import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Robot, Twitter, Github, Linkedin, Facebook, Mail } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/features" },
        { label: "Pricing", href: "/pricing" },
        { label: "Bots", href: "/bots" },
        { label: "Portfolio", href: "/portfolio" },
        { label: "Roadmap", href: "/roadmap" }
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "/docs" },
        { label: "Blog", href: "/blog" },
        { label: "Tutorials", href: "/tutorials" },
        { label: "API", href: "/api" },
        { label: "Support", href: "/support" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Contact", href: "/contact" },
        { label: "Press", href: "/press" },
        { label: "Investors", href: "/investors" }
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Terms", href: "/terms" },
        { label: "Privacy", href: "/privacy" },
        { label: "Cookies", href: "/cookies" },
        { label: "Licenses", href: "/licenses" },
        { label: "Security", href: "/security" }
      ]
    }
  ]
  
  const socialLinks = [
    { icon: <Twitter className="h-5 w-5" />, href: "https://twitter.com/virginfund", label: "Twitter" },
    { icon: <Github className="h-5 w-5" />, href: "https://github.com/virginfund", label: "GitHub" },
    { icon: <Linkedin className="h-5 w-5" />, href: "https://linkedin.com/company/virginfund", label: "LinkedIn" },
    { icon: <Facebook className="h-5 w-5" />, href: "https://facebook.com/virginfund", label: "Facebook" }
  ]
  
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Robot className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Virgin Fund</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Professional-grade algorithmic trading platform for the modern investor. Build, test, and automate your trading strategies with ease.
            </p>
            
            <div className="space-y-4">
              <h4 className="font-medium">Subscribe to our newsletter</h4>
              <div className="flex gap-2">
                <Input type="email" placeholder="Enter your email" className="max-w-xs" />
                <Button type="submit">
                  <Mail className="h-4 w-4 mr-2" />
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Get the latest updates, trading tips, and exclusive offers. No spam, ever.
              </p>
            </div>
          </div>
          
          {footerLinks.map((section, idx) => (
            <div key={idx}>
              <h4 className="font-medium mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {currentYear} Virgin Fund. All rights reserved.
          </div>
          
          <div className="flex items-center gap-4">
            {socialLinks.map((link, idx) => (
              <Link 
                key={idx} 
                href={link.href} 
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={link.label}
              >
                {link.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
