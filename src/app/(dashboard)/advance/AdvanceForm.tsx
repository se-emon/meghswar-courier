"use client"

import { useState, useTransition } from "react"
import { createAdvance } from "./actions"
import { AlertTriangle, CheckCircle, Save } from "lucide-react"

interface Employee {
  id: string
  employeeCode: string
  fullName: string
  grossSalary: number
}

interface AdvanceFormProps {
  employees: Employee[]
}

export function AdvanceForm({ employees }: AdvanceFormProps) {
  const [employeeId, setEmployeeId] = useState("")
  const [amount, setAmount] = useState("")
  const [installments, setInstallments] = useState("1")
  const [purpose, setPurpose] = useState("")
  const [startMonth, setStartMonth] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isPending, startTransition] = useTransition()

  const selectedEmployee = employees.find(e => e.id === employeeId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!employeeId || !amount || !purpose || !startMonth) {
      setError("Please fill all required fields")
      return
    }

    if (parseFloat(amount) <= 0) {
      setError("Amount must be greater than 0")
      return
    }

    startTransition(async () => {
      const result = await createAdvance({
        employeeId,
        amount: parseFloat(amount),
        installments: parseInt(installments),
        purpose,
        startMonth
      })

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess("Advance created successfully!")
        setEmployeeId("")
        setAmount("")
        setInstallments("1")
        setPurpose("")
        setStartMonth("")
        setTimeout(() => setSuccess(""), 3000)
      }
    })
  }

  const monthlyDeduction = parseFloat(amount) / parseInt(installments || "1")

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2 className="text-lg font-semibold text-primary-navy">Advance Entry</h2>
      
      <div>
        <label className="label-field">Employee *</label>
        <select
          value={employeeId}
          onChange={e => setEmployeeId(e.target.value)}
          className="input-field"
          required
        >
          <option value="">Select Employee</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.employeeCode} - {emp.fullName}
            </option>
          ))}
        </select>
        {selectedEmployee && (
          <p className="text-sm text-gray-500 mt-1">Gross Salary: ৳ {selectedEmployee.grossSalary.toLocaleString()}</p>
        )}
      </div>

      <div>
        <label className="label-field">Amount (৳) *</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="input-field"
          placeholder="0.00"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div>
        <label className="label-field">Installments *</label>
        <input
          type="number"
          value={installments}
          onChange={e => setInstallments(e.target.value)}
          className="input-field"
          min="1"
          max="12"
          required
        />
      </div>

      <div>
        <label className="label-field">Start Month *</label>
        <input
          type="month"
          value={startMonth}
          onChange={e => setStartMonth(e.target.value)}
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="label-field">Purpose *</label>
        <textarea
          value={purpose}
          onChange={e => setPurpose(e.target.value)}
          className="input-field"
          rows={2}
          placeholder="Reason for advance"
          required
        />
      </div>

      {amount && installments && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">Monthly Deduction: ৳ {monthlyDeduction.toLocaleString()}</p>
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
        type="submit"
        disabled={isPending}
        className="w-full btn-primary py-3 flex items-center justify-center gap-2"
      >
        {isPending ? <span>Processing...</span> : <><Save className="w-5 h-5" /> Create Advance</>}
      </button>
    </form>
  )
}
