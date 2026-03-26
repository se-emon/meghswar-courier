"use client"

import { useState } from "react"
import { generatePayroll, getEmployeesForPayroll } from "./actions"
import { AlertTriangle, CheckCircle, Calculator } from "lucide-react"

interface PayrollEmployee {
  id: string
  employeeCode: string
  fullName: string
  grossSalary: number
  netSalary: number
}

export function PayrollGenerator() {
  const [month, setMonth] = useState("")
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [preview, setPreview] = useState<PayrollEmployee[]>([])

  const handlePreview = async () => {
    if (!month) {
      setError("Please select a month")
      return
    }

    const result = await getEmployeesForPayroll(month)
    if (result.success && result.employees) {
      setPreview(result.employees)
      setSelectedEmployees(result.employees.map((e) => e.id))
    }
  }

  const handleGenerate = async () => {
    setError("")
    setSuccess("")

    if (!month || selectedEmployees.length === 0) {
      setError("Please select a month and employees")
      return
    }

    const result = await generatePayroll(month, selectedEmployees)
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(`Payroll generated for ${selectedEmployees.length} employees`)
      setPreview([])
      setSelectedEmployees([])
      setMonth("")
      setTimeout(() => setSuccess(""), 3000)
    }
  }

  const toggleEmployee = (id: string) => {
    setSelectedEmployees(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selectedEmployees.length === preview.length) {
      setSelectedEmployees([])
    } else {
      setSelectedEmployees(preview.map((e) => e.id))
    }
  }

  return (
    <div className="card space-y-4">
      <h2 className="text-lg font-semibold text-primary-navy">Generate Payroll</h2>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="label-field">Select Month</label>
          <input
            type="month"
            value={month}
            onChange={e => {
              setMonth(e.target.value)
              setPreview([])
            }}
            className="input-field"
          />
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={handlePreview}
            className="btn-secondary"
          >
            Preview
          </button>
        </div>
      </div>

      {preview.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{preview.length} employees found</p>
            <button
              type="button"
              onClick={toggleAll}
              className="text-sm text-primary-orange hover:underline"
            >
              {selectedEmployees.length === preview.length ? "Deselect All" : "Select All"}
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
            {preview.map((emp) => (
              <div
                key={emp.id}
                className={`flex items-center justify-between p-3 border-b border-gray-100 last:border-0 cursor-pointer ${
                  selectedEmployees.includes(emp.id) ? 'bg-orange-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => toggleEmployee(emp.id)}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedEmployees.includes(emp.id)}
                    onChange={() => {}}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium">{emp.fullName}</p>
                    <p className="text-xs text-gray-500">{emp.employeeCode}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">৳ {emp.grossSalary.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Net: ৳ {emp.netSalary.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertTriangle className="w-5 h-5" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}

      <button
        type="button"
        onClick={handleGenerate}
        disabled={selectedEmployees.length === 0}
        className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Calculator className="w-5 h-5" />
        Generate Payroll ({selectedEmployees.length})
      </button>
    </div>
  )
}
