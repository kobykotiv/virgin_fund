import { Button } from "@/components/ui/button"
import Link from "next/link"
import { UserCircle } from "lucide-react"

export function AuthButtons() {
  return (
    <div id="auth-buttons" className="flex gap-4 items-center">
      <Link href="/login">
        <Button variant="secondary" size="lg" className="font-bold text-primary hover:text-primary-foreground hover:bg-primary shadow-sm border-2 border-primary">
          <UserCircle className="mr-2 h-5 w-5" />
          Log In
        </Button>
      </Link>
      <Link href="/signup">
        <Button size="lg" className="font-bold shadow-md">
          Sign Up
        </Button>
      </Link>
    </div>
  )
}
