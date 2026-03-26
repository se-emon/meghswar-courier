import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { formatBDT } from "@/lib/utils"

export default async function TrialBalancePage() {
  const session = await auth()
  if (!session) redirect("/login")

  const accounts = await prisma.chartOfAccounts.findMany({
    where: { isActive: true, isHeader: false },
    orderBy: [{ accountGroup: 'asc' }, { accountCode: 'asc' }]
  })

  let totalDebit = 0
  let totalCredit = 0

  const groupedAccounts = accounts.reduce<Record<string, { accounts: typeof accounts, totalDebit: number, totalCredit: number }>>((acc, account) => {
    const balance = Number(account.currentBalance)
    const group = account.accountGroup as string

    if (!acc[group]) {
      acc[group] = { accounts: [], totalDebit: 0, totalCredit: 0 }
    }

    let debit = 0
    let credit = 0

    if (group === 'ASSETS' || group === 'EXPENSES') {
      if (balance >= 0) {
        debit = balance
      } else {
        credit = Math.abs(balance)
      }
    } else {
      if (balance >= 0) {
        credit = balance
      } else {
        debit = Math.abs(balance)
      }
    }

    acc[group].accounts.push(account)
    acc[group].totalDebit += debit
    acc[group].totalCredit += credit

    return acc
  }, {})

  for (const group of Object.values(groupedAccounts)) {
    totalDebit += group.totalDebit
    totalCredit += group.totalCredit
  }

  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-navy">Trial Balance</h1>
          <p className="text-gray-500">As of {new Date().toLocaleDateString()}</p>
        </div>
        <a href="/reports" className="btn-secondary">Back to Reports</a>
      </div>

      {Object.entries(groupedAccounts).map(([group, data]) => (
        <div key={group} className="card">
          <h2 className="text-lg font-semibold text-primary-navy mb-4">{group}</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">Code</th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">Account Name</th>
                  <th className="text-right py-2 px-4 text-sm font-medium text-gray-500">Debit</th>
                  <th className="text-right py-2 px-4 text-sm font-medium text-gray-500">Credit</th>
                </tr>
              </thead>
              <tbody>
                {data.accounts.map(account => {
                  const balance = Number(account.currentBalance)
                  let debit = 0
                  let credit = 0
                  const group = account.accountGroup as string
                  if (group === 'ASSETS' || group === 'EXPENSES') {
                    debit = balance >= 0 ? balance : 0
                    credit = balance < 0 ? Math.abs(balance) : 0
                  } else {
                    credit = balance >= 0 ? balance : 0
                    debit = balance < 0 ? Math.abs(balance) : 0
                  }
                  return (
                    <tr key={account.id} className="border-b border-gray-100">
                      <td className="py-2 px-4 text-sm font-mono">{account.accountCode}</td>
                      <td className="py-2 px-4 text-sm">{account.accountName}</td>
                      <td className="py-2 px-4 text-sm text-right font-mono">
                        {debit > 0 ? formatBDT(debit) : '-'}
                      </td>
                      <td className="py-2 px-4 text-sm text-right font-mono">
                        {credit > 0 ? formatBDT(credit) : '-'}
                      </td>
                    </tr>
                  )
                })}
                <tr className="bg-gray-50 font-semibold">
                  <td className="py-2 px-4 text-sm" colSpan={2}>Total</td>
                  <td className="py-2 px-4 text-sm text-right font-mono">{formatBDT(data.totalDebit)}</td>
                  <td className="py-2 px-4 text-sm text-right font-mono">{formatBDT(data.totalCredit)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div className="card bg-primary-navy text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70">Total Debit</p>
            <p className="text-2xl font-bold">৳ {formatBDT(totalDebit)}</p>
          </div>
          <div className="text-center px-8">
            {isBalanced ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg">
                ✓ Balanced
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg">
                ✗ Not Balanced
              </span>
            )}
          </div>
          <div className="text-right">
            <p className="text-white/70">Total Credit</p>
            <p className="text-2xl font-bold">৳ {formatBDT(totalCredit)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
