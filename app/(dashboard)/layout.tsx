import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { SoundSettings } from "@/components/sound-settings";
import { ToastProvider } from "@/providers/toast-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const mainNav = [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Bots",
      href: "/bots",
    },
    {
      title: "Analytics",
      href: "/analytics",
    },
    {
      title: "Settings",
      href: "/settings",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav items={mainNav} />
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <SoundSettings triggerClassName="mr-2" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notification Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <ModeToggle />
            <UserNav
              user={{
                name: session.user.name,
                image: session.user.image,
                email: session.user.email,
              }}
            />
          </div>
        </div>
      </header>
      <div className="container">
        <main className="flex flex-col gap-4">
          {children}
        </main>
      </div>
      <ToastProvider />
    </div>
  );
}
