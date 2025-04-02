import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Robot, Menu, Search } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DocsSidebar } from "@/components/docs/docs-sidebar"

export function DocsNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Robot className="h-5 w-5 text-primary" />
            <span className="font-bold">Virgin Fund</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/docs" className="transition-colors hover:text-foreground/80">
              Documentation
            </Link>
            <Link href="/docs/api-routes" className="transition-colors hover:text-foreground/80">
              API Reference
            </Link>
            <Link href="/docs/getting-started" className="transition-colors hover:text-foreground/80">
              Getting Started
            </Link>
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-2 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <MobileLink href="/" className="flex items-center" onOpenChange={() => {}}>
              <Robot className="mr-2 h-5 w-5 text-primary" />
              <span className="font-bold">Virgin Fund</span>
            </MobileLink>
            <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
              <DocsSidebar />
            </ScrollArea>
          </SheetContent>
        </Sheet>
        <Link href="/" className="mr-6 flex items-center space-x-2 md:hidden">
          <Robot className="h-5 w-5 text-primary" />
          <span className="font-bold">Virgin Fund</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documentation..."
                className="pl-8 md:w-[200px] lg:w-[320px]"
              />
            </div>
          </div>
          <nav className="flex items-center space-x-2">
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: React.ComponentProps<typeof Link> & {
  onOpenChange?: (open: boolean) => void
}) {
  return (
    <Link
      href={href}
      onClick={() => onOpenChange?.(false)}
      className={className}
      {...props}
    >
      {children}
    </Link>
  )
}
