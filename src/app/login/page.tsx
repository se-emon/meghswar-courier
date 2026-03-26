import { login } from "@/app/login/actions"
import { Package, Lock, User } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-navy via-primary-dark to-primary-orange">
      <div className="w-full max-w-md p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-orange rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-primary-navy">Meghswar Courier</h1>
            <p className="text-gray-500 mt-1">HR & Accounting Management</p>
          </div>

          <form action={login} className="space-y-5">
            <div>
              <label htmlFor="username" className="label-field">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="input-field pl-10"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="label-field">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="input-field pl-10"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-3 text-lg font-semibold"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              Default credentials: <span className="font-medium">admin / admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
