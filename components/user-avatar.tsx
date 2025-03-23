import { User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
  user?: {
    name?: string
    email?: string
    image?: string
  }
  className?: string
  size?: "sm" | "md" | "lg"
}

export function UserAvatar({ user, className, size = "md" }: UserAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  }

  // Get initials from name or email
  const getInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase()
    }
    return "U"
  }

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
      <AvatarFallback className="bg-primary text-primary-foreground">
        {user ? getInitials() : <User className="h-4 w-4" />}
      </AvatarFallback>
    </Avatar>
  )
}

