"use client"

import { LogOut } from "lucide-react"

export function Topbar() {
  const handleLogout = () => {
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    window.location.href = "/login"
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-primary-navy">
          HR & Accounting Management
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
          <div className="w-8 h-8 bg-primary-orange/10 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-primary-orange"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900">System Administrator</p>
            <p className="text-gray-500 text-xs">ADMIN</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}