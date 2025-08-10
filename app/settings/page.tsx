/**
 * SettingsPage - User settings for Virgin Fund dashboard
 * Includes Alpaca API key form and theme toggle.
 */
import AlpacaKeyForm from "@/components/alpaca-key-form"
import { useState } from "react"

export default function SettingsPage() {
  const [theme, setTheme] = useState("light")

  return (
    <div className="p-6 max-w-xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Theme</h2>
        <div className="flex items-center space-x-4">
          <button
            className={`px-4 py-2 rounded ${theme === "light" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setTheme("light")}
          >
            Light
          </button>
          <button
            className={`px-4 py-2 rounded ${theme === "dark" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setTheme("dark")}
          >
            Dark
          </button>
        </div>
      </section>
      <section>
        <AlpacaKeyForm />
      </section>
    </div>
  )
}
