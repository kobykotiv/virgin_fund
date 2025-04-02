import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Robot } from "lucide-react"
import { cn } from "@/lib/utils"

export function MainNav() {
  const { isAuthenticated } = useAuth()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b transition-all duration-200",
      scrolled ? "bg-background/80 backdrop-blur-lg" : "bg-background"
    )}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Robot className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Virgin Fund</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/bots" className="text-sm hover:text-primary transition-colors">Bots</Link>
            <Link href="/portfolio" className="text-sm hover:text-primary transition-colors">Portfolio</Link>
            <Link href="/pricing" className="text-sm hover:text-primary transition-colors">Pricing</Link>
            <Link href="/docs" className="text-sm hover:text-primary transition-colors">Docs</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-primary to-primary-600 hover:opacity-90">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
