import { Metadata } from "next"
import Link from "next/link"
import { UserAuthForm } from "@/components/auth/user-auth-form"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Login - Virgin Fund",
  description: "Login to your Virgin Fund account",
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const mode = searchParams.mode as string | undefined
  const isDemo = mode === "demo"

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {isDemo ? "Try Demo Mode" : "Welcome back"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isDemo 
              ? "Experience the platform with simulated data"
              : "Enter your email to sign in to your account"
            }
          </p>
        </div>
        <UserAuthForm demo={isDemo} />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link 
            href="/signup" 
            className="hover:text-brand underline underline-offset-4"
          >
            Don&apos;t have an account? Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}