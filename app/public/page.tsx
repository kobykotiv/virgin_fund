import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PublicPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-6">Welcome to GenEric TraDer</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        This is a public page that doesn't require authentication. It can be used to test the authentication flow.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Home</Link>
        </Button>
      </div>
    </div>
  )
}

