import { SideNavigation } from '@/components/ui/side-navigation'

export default function CalculatorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-6">
        <SideNavigation />
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
