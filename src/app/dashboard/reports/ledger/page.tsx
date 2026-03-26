import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { formatBDT, formatDateDisplay } from "@/lib/utils"

export default async function LedgerReportPage({ searchParams }: { searchParams: { accountId?: string } }) {
  const cookieStore = cookies()
  const token = cookieStore.get("auth-token")?.value
  
  if (!token) {
    redirect("/login")
  }

  const accountId = searchParams.accountId

  if (!accountId) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-primary-navy">Account Ledger</h1>
        <div className="card">
          <p className="text-gray-500 text-center py-8">Please select an account to view ledger</p>
        </div>
      </div>
    )
  }

  const account = await prisma.chartOfAccounts.findUnique({
    where: { id: accountId }
  })

  if (!account) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-primary-navy">Account Ledger</h1>
        <div className="card">
          <p className="text-gray-500 text-center py-8">Account not found</p>
        </div>
      </div>
    )
  }

  const ledgerEntries = await prisma.ledger.findMany({
    where: { accountId },
    orderBy: [{ voucherDate: 'asc' }, { createdAt: 'asc' }]
  })

  // Calculate running balance
  let runningBalance = Number(account.openingBalance)
  const entriesWithBalance = ledgerEntries.map(entry => {
    runningBalance = runningBalance + Number(entry.debit) - Number(entry.credit)
    return {
      ...entry,
      debit: Number(entry.debit),
      credit: Number(entry.credit),
      runningBalance
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-navy">Account Ledger</h1>
          <p className="text-gray-500">{account.accountCode} - {account.accountName}</p>
        </div>
        <a href="/dashboard/reports" className="btn-secondary">Back to Reports</a>
      </div>

      <div className="card">
        <div className="flex justify-between mb-4 pb-4 border-b border-gray-200">
          <div>
            <p className="text-sm text-gray-500">Opening Balance</p>
            <p className="text-lg font-semibold">৳ {formatBDT(account.openingBalance)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Current Balance</p>
            <p className="text-lg font-semibold">৳ {formatBDT(account.currentBalance)}</p>
          </div>
        </div>

        {entriesWithBalance.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No transactions found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">V.No</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Narration</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Debit</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Credit</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Balance</th>
                </tr>
              </thead>
              <tbody>
                {entriesWithBalance.map((entry) => (
                  <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{formatDateDisplay(entry.voucherDate)}</td>
                    <td className="py-3 px-4 text-sm font-mono">{entry.voucherNo}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        entry.voucherType === 'RV' ? 'bg-green-100 text-green-700' :
                        entry.voucherType === 'PV' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {entry.voucherType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm max-w-xs truncate">{entry.narration || '-'}</td>
                    <td className="py-3 px-4 text-sm text-right font-mono">
                      {entry.debit > 0 ? formatBDT(entry.debit) : '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-mono">
                      {entry.credit > 0 ? formatBDT(entry.credit) : '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-medium font-mono">
                      {formatBDT(entry.runningBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
