import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getEmployees } from "./actions"
import { EmployeeForm } from "./EmployeeForm"
import { formatBDT } from "@/lib/utils"
import { Search, Filter, Bike } from "lucide-react"

export default async function EmployeesPage() {
  const cookieStore = cookies()
  const token = cookieStore.get("auth-token")?.value
  
  if (!token) {
    redirect("/login")
  }

  const employees = await getEmployees()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary-navy">Employees</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search & Filters */}
          <div className="card">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, code or phone..."
                  className="input-field pl-10"
                />
              </div>
              <button className="btn-secondary flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>

          {/* Employee Table */}
          <div className="card overflow-hidden">
            {employees.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No employees found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Code</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Designation</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Phone</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Gross Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-mono">{emp.employeeCode}</td>
                        <td className="py-3 px-4 text-sm">{emp.fullName}</td>
                        <td className="py-3 px-4 text-sm">{emp.designation || '-'}</td>
                        <td className="py-3 px-4 text-sm">
                          {emp.isRider ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                              <Bike className="w-3 h-3" />
                              Rider
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Staff</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm">{emp.phone || '-'}</td>
                        <td className="py-3 px-4 text-sm font-medium">৳ {formatBDT(emp.grossSalary)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Add Employee Form */}
        <div>
          <EmployeeForm />
        </div>
      </div>
    </div>
  )
}
