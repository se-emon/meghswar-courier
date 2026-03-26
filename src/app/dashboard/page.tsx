import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { formatBDT, formatDateDisplay } from "@/lib/utils"
import { 
  Wallet, 
  Building2, 
  Smartphone, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import Link from "next/link"

async function getDashboardData() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  const cashAccounts = await prisma.chartOfAccounts.findMany({
    where: { isCashBank: true, accountCode: { startsWith: '10' } },
    select: { currentBalance: true, accountCode: true, accountName: true }
  })

  const cashInHand = cashAccounts.find(a => a.accountCode === '1001')?.currentBalance || 0
  const bankBalance = cashAccounts.find(a => a.accountCode === '1011')?.currentBalance || 0
  const bkashBalance = cashAccounts.find(a => a.accountCode === '1012')?.currentBalance || 0

  const todayReceive = await prisma.voucherMain.aggregate({
    where: {
      voucherDate: { gte: today, lt: tomorrow },
      voucherType: 'RV'
    },
    _sum: { amount: true }
  })

  const todayPayment = await prisma.voucherMain.aggregate({
    where: {
      voucherDate: { gte: today, lt: tomorrow },
      voucherType: 'PV'
    },
    _sum: { amount: true }
  })

  const monthlyIncome = await prisma.voucherMain.aggregate({
    where: {
      voucherDate: { gte: monthStart, lte: monthEnd },
      voucherType: { in: ['RV', 'DI'] }
    },
    _sum: { amount: true }
  })

  const monthlyExpense = await prisma.voucherMain.aggregate({
    where: {
      voucherDate: { gte: monthStart, lte: monthEnd },
      voucherType: 'PV'
    },
    _sum: { amount: true }
  })

  const recentTransactions = await prisma.voucherMain.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      drAccount: { select: { accountName: true } },
      crAccount: { select: { accountName: true } }
    }
  })

  return {
    cashInHand: Number(cashInHand),
    bankBalance: Number(bankBalance),
    bkashBalance: Number(bkashBalance),
    todayReceive: Number(todayReceive._sum.amount || 0),
    todayPayment: Number(todayPayment._sum.amount || 0),
    monthlyIncome: Number(monthlyIncome._sum.amount || 0),
    monthlyExpense: Number(monthlyExpense._sum.amount || 0),
    recentTransactions
  }
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const data = await getDashboardData()
  const profit = data.monthlyIncome - data.monthlyExpense

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-navy">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {session.user.name}</p>
        </div>
        <div className="text-sm text-gray-500">
          {formatDateDisplay(new Date())}
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Cash in Hand</p>
              <p className="text-2xl font-bold text-primary-navy">৳ {formatBDT(data.cashInHand)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Bank Balance</p>
              <p className="text-2xl font-bold text-primary-navy">৳ {formatBDT(data.bankBalance)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">bKash Balance</p>
              <p className="text-2xl font-bold text-primary-navy">৳ {formatBDT(data.bkashBalance)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Today Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today Receive</p>
              <p className="text-xl font-bold text-green-600">+৳ {formatBDT(data.todayReceive)}</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-green-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today Payment</p>
              <p className="text-xl font-bold text-red-600">-৳ {formatBDT(data.todayPayment)}</p>
            </div>
            <ArrowDownRight className="w-5 h-5 text-red-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Monthly Income</p>
              <p className="text-xl font-bold text-green-600">+৳ {formatBDT(data.monthlyIncome)}</p>
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Monthly Expense</p>
              <p className="text-xl font-bold text-red-600">-৳ {formatBDT(data.monthlyExpense)}</p>
            </div>
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
        </div>
      </div>

      {/* Profit Card */}
      <div className="card bg-primary-navy text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70">Monthly Profit</p>
            <p className="text-3xl font-bold">৳ {formatBDT(profit)}</p>
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${profit >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
            {profit >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-primary-navy">Recent Transactions</h2>
          <Link href="/voucher" className="text-sm text-primary-orange hover:underline">View All</Link>
        </div>
        
        {data.recentTransactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No transactions yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">V.No</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Type</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Debit</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Credit</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 text-sm">{formatDateDisplay(tx.voucherDate)}</td>
                    <td className="py-3 px-2 text-sm font-mono">{tx.voucherNo}</td>
                    <td className="py-3 px-2 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        tx.voucherType === 'RV' ? 'bg-green-100 text-green-700' :
                        tx.voucherType === 'PV' ? 'bg-red-100 text-red-700' :
                        tx.voucherType === 'DI' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {tx.voucherType}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm">{tx.drAccount.accountName}</td>
                    <td className="py-3 px-2 text-sm">{tx.crAccount.accountName}</td>
                    <td className="py-3 px-2 text-sm font-medium">৳ {formatBDT(tx.amount)}</td>
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
