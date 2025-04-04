import { DashboardSettings } from '../../components/dashboard-settings'
import { MockDataWarning } from '../../components/mock-data-warning'

/**
 * Settings page container
 * 
 * @page
 * @description
 * Dashboard settings page that allows users to configure API credentials
 * and other application settings.
 */
export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <MockDataWarning />
      <h1 className="text-3xl font-bold mb-8 text-center">Dashboard Settings</h1>
      <DashboardSettings />
    </div>
  )
}
