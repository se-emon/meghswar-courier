import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { getPayrollList } from "./actions"
import { PayrollGenerator } from "./PayrollGenerator"
import { formatBDT, getMonthName } from "@/lib/utils"
import { CheckCircle, Clock } from "lucide-react"

export default async function PayrollPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const payrollList = await getPayrollList()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary-navy">Payroll Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PayrollGenerator />
        </div>

        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold text-primary-navy mb-4">Payroll History</h2>
            {payrollList.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No payroll records found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Month</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Employee</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Gross</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Adv. Ded.</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Net</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrollList.map((p) => (
                      <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">
                          {getMonthName(p.payrollMonth.getMonth())} {p.payrollMonth.getFullYear()}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div>
                            <p className="font-medium">{p.employee.fullName}</p>
                            <p className="text-xs text-gray-500">{p.employee.employeeCode}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">৳ {formatBDT(p.grossSalary)}</td>
                        <td className="py-3 px-4 text-sm">৳ {formatBDT(p.advanceDeduction)}</td>
                        <td className="py-3 px-4 text-sm font-medium">৳ {formatBDT(p.netSalary)}</td>
                        <td className="py-3 px-4 text-sm">
                          {p.isPaid ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                              <CheckCircle className="w-3 h-3" />
                              Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                              <Clock className="w-3 h-3" />
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
