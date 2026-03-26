import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { FileText, BarChart3, ArrowRight } from "lucide-react"

export default async function ReportsPage() {
  const cookieStore = cookies()
  const token = cookieStore.get("auth-token")?.value
  
  if (!token) {
    redirect("/login")
  }

  const accounts = await prisma.chartOfAccounts.findMany({
    where: { isActive: true, isHeader: false },
    orderBy: [{ accountCode: 'asc' }]
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary-navy">Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Ledger Report */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary-navy">Account Ledger</h2>
              <p className="text-sm text-gray-500">View transactions by account</p>
            </div>
          </div>

          <form action="/dashboard/reports/ledger" method="GET" className="space-y-3">
            <div>
              <label className="label-field">Select Account</label>
              <select name="accountId" className="input-field" required>
                <option value="">Choose an account</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.accountCode} - {acc.accountName}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2">
              View Ledger <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Trial Balance */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary-navy">Trial Balance</h2>
              <p className="text-sm text-gray-500">Verify debits equal credits</p>
            </div>
          </div>

          <Link href="/dashboard/reports/trial-balance">
            <button className="w-full btn-primary flex items-center justify-center gap-2">
              View Trial Balance <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
