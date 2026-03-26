"use client"

import { useSession, signOut } from "next-auth/react"
import { User, LogOut } from "lucide-react"

export function Topbar() {
  const { data: session } = useSession()

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
            <User className="w-4 h-4 text-primary-orange" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900">{session?.user?.name}</p>
            <p className="text-gray-500 text-xs">{session?.user?.role}</p>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
