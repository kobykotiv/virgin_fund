import { Button } from "@/components/ui/button"

export function SocialButtons() {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Button variant="outline" className="w-full">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z" fill="#000"/>
          <path d="M9.75 18.75v-7.5H7.5v-3h2.25V6.75C9.75 4.5 11.25 3 13.5 3h2.25v3h-1.5c-.75 0-1.125.375-1.125 1.125V8.25h2.625l-.375 3h-2.25v7.5H9.75z" fill="#FFF"/>
        </svg>
      </Button>
      <Button variant="outline" className="w-full">
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path 
            fill="#EA4335"
            d="M12 5c1.6168 0 3.1013.5558 4.27 1.4847l3.3414-3.3414C17.7454 1.5284 14.9706 0 12 0 7.3924 0 3.3996 2.6839 1.3862 6.6192l3.8587 2.9844C6.4085 6.6058 8.9997 5 12 5z"
          />
          <path
            fill="#4285F4"
            d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96l-3.98 3.09C3.74 21.3 7.48 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
          />
        </svg>
      </Button>
      <Button variant="outline" className="w-full">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="black">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.25c5.376 0 9.75 4.374 9.75 9.75 0 5.376-4.374 9.75-9.75 9.75-5.376 0-9.75-4.374-9.75-9.75 0-5.376 4.374-9.75 9.75-9.75zM9 17.25h6v-6H9v6z"/>
        </svg>
      </Button>
    </div>
  )
}
    