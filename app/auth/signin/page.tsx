import SignInForm from "@/components/auth/SignInForm"

export const metadata = { title: "Sign in" }

export default function SignInPage() {
  return (
    <main className="container mx-auto py-12">
      <div className="max-w-lg mx-auto p-6 border rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Sign in</h1>
        <SignInForm />
      </div>
    </main>
  )
}
