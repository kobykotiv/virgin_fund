import { Metadata } from "next"
import Link from "next/link"
import { UserAuthForm } from "@/components/auth/user-auth-form"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Sign Up - Virgin Fund",
  description: "Create your Virgin Fund account",
}

export default function SignUpPage() {
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
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to create your account
          </p>
        </div>
        <UserAuthForm isSignUp />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link 
            href="/login" 
            className="hover:text-brand underline underline-offset-4"
          >
            Already have an account? Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}