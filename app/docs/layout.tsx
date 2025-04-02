import { DocsNav } from "@/components/docs/docs-nav"
import { DocsSidebar } from "@/components/docs/docs-sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Documentation - Virgin Fund",
  description: "Documentation for the Virgin Fund automated trading platform.",
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <DocsNav />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <ScrollArea className="h-full py-6 pr-6">
            <DocsSidebar />
          </ScrollArea>
        </aside>
        <main className="relative py-6 lg:gap-10 lg:py-8">
          <div className="mx-auto w-full min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
