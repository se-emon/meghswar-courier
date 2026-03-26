import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { getActiveEmployees, getAdvances } from "./actions"
import { AdvanceForm } from "./AdvanceForm"
import { formatBDT } from "@/lib/utils"

export default async function AdvancePage() {
  const session = await auth()
  if (!session) redirect("/login")

  const employees = await getActiveEmployees()
  const advances = await getAdvances()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary-navy">Advance Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AdvanceForm employees={employees} />
        </div>

        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold text-primary-navy mb-4">Advance List</h2>
            {advances.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No advances found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Employee</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Installments</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Monthly Ded.</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Remaining</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {advances.map((adv) => (
                      <tr key={adv.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">
                          <div>
                            <p className="font-medium">{adv.employee.fullName}</p>
                            <p className="text-xs text-gray-500">{adv.employee.employeeCode}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium">৳ {formatBDT(adv.amount)}</td>
                        <td className="py-3 px-4 text-sm">{adv.paidInstallments}/{adv.totalInstallments}</td>
                        <td className="py-3 px-4 text-sm">৳ {formatBDT(adv.monthlyDeduction)}</td>
                        <td className="py-3 px-4 text-sm">৳ {formatBDT(adv.remainingAmount)}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            adv.status === 'PAID' ? 'bg-green-100 text-green-700' :
                            adv.status === 'PARTIAL' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {adv.status}
                          </span>
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
