"use client"

import { useState, useTransition } from "react"
import { cn } from "@/lib/utils"
import { createEmployee, updateEmployee } from "./actions"
import { 
  Save, 
  AlertTriangle, 
  CheckCircle,
  User,
  Briefcase,
  DollarSign,
  Banknote,
  Users
} from "lucide-react"

interface Employee {
  id: string
  employeeCode: string
  fullName: string
  fatherName: string | null
  motherName: string | null
  dateOfBirth: Date | null
  gender: string | null
  maritalStatus: string | null
  religion: string | null
  phone: string | null
  email: string | null
  presentAddress: string | null
  permanentAddress: string | null
  nidNumber: string | null
  isRider: boolean
  designation: string | null
  department: string | null
  joinDate: Date | null
  employmentStatus: string
  basicSalary: number
  houseRentAllowance: number
  medicalAllowance: number
  transportAllowance: number
  otherAllowance: number
  grossSalary: number
  bankName: string | null
  bankAccountNo: string | null
  bankBranch: string | null
  mobileBankingType: string | null
  mobileBankingNo: string | null
  nomineeName: string | null
  nomineeRelation: string | null
  nomineePhone: string | null
  isActive: boolean
}

interface EmployeeFormProps {
  employee?: Employee | null
}

type TabType = 'personal' | 'employment' | 'salary' | 'bank' | 'nominee'

export function EmployeeForm({ employee }: EmployeeFormProps) {
  const [activeTab, setActiveTab] = useState<TabType>('personal')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const [formData, setFormData] = useState({
    fullName: employee?.fullName || "",
    fatherName: employee?.fatherName || "",
    motherName: employee?.motherName || "",
    dateOfBirth: employee?.dateOfBirth ? new Date(employee.dateOfBirth).toISOString().split('T')[0] : "",
    gender: employee?.gender || "",
    maritalStatus: employee?.maritalStatus || "",
    religion: employee?.religion || "",
    phone: employee?.phone || "",
    email: employee?.email || "",
    presentAddress: employee?.presentAddress || "",
    permanentAddress: employee?.permanentAddress || "",
    nidNumber: employee?.nidNumber || "",
    isRider: employee?.isRider || false,
    designation: employee?.designation || "",
    department: employee?.department || "",
    joinDate: employee?.joinDate ? new Date(employee.joinDate).toISOString().split('T')[0] : "",
    basicSalary: employee?.basicSalary?.toString() || "0",
    houseRentAllowance: employee?.houseRentAllowance?.toString() || "0",
    medicalAllowance: employee?.medicalAllowance?.toString() || "0",
    transportAllowance: employee?.transportAllowance?.toString() || "0",
    otherAllowance: employee?.otherAllowance?.toString() || "0",
    bankName: employee?.bankName || "",
    bankAccountNo: employee?.bankAccountNo || "",
    bankBranch: employee?.bankBranch || "",
    mobileBankingType: employee?.mobileBankingType || "",
    mobileBankingNo: employee?.mobileBankingNo || "",
    nomineeName: employee?.nomineeName || "",
    nomineeRelation: employee?.nomineeRelation || "",
    nomineePhone: employee?.nomineePhone || "",
  })

  const tabs = [
    { id: 'personal' as TabType, label: 'Personal', icon: User },
    { id: 'employment' as TabType, label: 'Employment', icon: Briefcase },
    { id: 'salary' as TabType, label: 'Salary', icon: DollarSign },
    { id: 'bank' as TabType, label: 'Bank', icon: Banknote },
    { id: 'nominee' as TabType, label: 'Nominee', icon: Users },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!formData.fullName || !formData.phone) {
      setError("Name and Phone are required")
      return
    }

    const grossSalary = 
      parseFloat(formData.basicSalary || "0") +
      parseFloat(formData.houseRentAllowance || "0") +
      parseFloat(formData.medicalAllowance || "0") +
      parseFloat(formData.transportAllowance || "0") +
      parseFloat(formData.otherAllowance || "0")

    startTransition(async () => {
      const result = employee 
        ? await updateEmployee(employee.id, { ...formData, grossSalary })
        : await createEmployee({ ...formData, grossSalary })

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(employee ? "Employee updated successfully!" : "Employee created successfully!")
        if (!employee) {
          setFormData({
            fullName: "", fatherName: "", motherName: "", dateOfBirth: "",
            gender: "", maritalStatus: "", religion: "", phone: "", email: "",
            presentAddress: "", permanentAddress: "", nidNumber: "",
            isRider: false, designation: "", department: "", joinDate: "",
            basicSalary: "0", houseRentAllowance: "0", medicalAllowance: "0",
            transportAllowance: "0", otherAllowance: "0", bankName: "", bankAccountNo: "",
            bankBranch: "", mobileBankingType: "", mobileBankingNo: "",
            nomineeName: "", nomineeRelation: "", nomineePhone: ""
          })
          setActiveTab('personal')
        }
        setTimeout(() => setSuccess(""), 3000)
      }
    })
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Full Name *</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label-field">Father&apos;s Name</label>
              <input
                type="text"
                value={formData.fatherName}
                onChange={e => setFormData({ ...formData, fatherName: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">Mother&apos;s Name</label>
              <input
                type="text"
                value={formData.motherName}
                onChange={e => setFormData({ ...formData, motherName: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">Gender</label>
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
                className="input-field"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="label-field">Marital Status</label>
              <select
                value={formData.maritalStatus}
                onChange={e => setFormData({ ...formData, maritalStatus: e.target.value })}
                className="input-field"
              >
                <option value="">Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
            <div>
              <label className="label-field">Religion</label>
              <select
                value={formData.religion}
                onChange={e => setFormData({ ...formData, religion: e.target.value })}
                className="input-field"
              >
                <option value="">Select Religion</option>
                <option value="Islam">Islam</option>
                <option value="Hinduism">Hinduism</option>
                <option value="Buddhism">Buddhism</option>
                <option value="Christianity">Christianity</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="label-field">Phone *</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label-field">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">NID Number</label>
              <input
                type="text"
                value={formData.nidNumber}
                onChange={e => setFormData({ ...formData, nidNumber: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="col-span-2">
              <label className="label-field">Present Address</label>
              <textarea
                value={formData.presentAddress}
                onChange={e => setFormData({ ...formData, presentAddress: e.target.value })}
                className="input-field"
                rows={2}
              />
            </div>
            <div className="col-span-2">
              <label className="label-field">Permanent Address</label>
              <textarea
                value={formData.permanentAddress}
                onChange={e => setFormData({ ...formData, permanentAddress: e.target.value })}
                className="input-field"
                rows={2}
              />
            </div>
          </div>
        )
      case 'employment':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="isRider"
                checked={formData.isRider}
                onChange={e => setFormData({ ...formData, isRider: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="isRider" className="text-sm font-medium">Is Rider</label>
            </div>
            <div>
              <label className="label-field">Designation</label>
              <input
                type="text"
                value={formData.designation}
                onChange={e => setFormData({ ...formData, designation: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">Join Date</label>
              <input
                type="date"
                value={formData.joinDate}
                onChange={e => setFormData({ ...formData, joinDate: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        )
      case 'salary':
        const gross = 
          parseFloat(formData.basicSalary || "0") +
          parseFloat(formData.houseRentAllowance || "0") +
          parseFloat(formData.medicalAllowance || "0") +
          parseFloat(formData.transportAllowance || "0") +
          parseFloat(formData.otherAllowance || "0")
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-field">Basic Salary</label>
                <input
                  type="number"
                  value={formData.basicSalary}
                  onChange={e => setFormData({ ...formData, basicSalary: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-field">House Rent Allowance</label>
                <input
                  type="number"
                  value={formData.houseRentAllowance}
                  onChange={e => setFormData({ ...formData, houseRentAllowance: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-field">Medical Allowance</label>
                <input
                  type="number"
                  value={formData.medicalAllowance}
                  onChange={e => setFormData({ ...formData, medicalAllowance: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-field">Transport Allowance</label>
                <input
                  type="number"
                  value={formData.transportAllowance}
                  onChange={e => setFormData({ ...formData, transportAllowance: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-field">Other Allowance</label>
                <input
                  type="number"
                  value={formData.otherAllowance}
                  onChange={e => setFormData({ ...formData, otherAllowance: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            <div className="p-4 bg-primary-navy text-white rounded-lg">
              <p className="text-sm opacity-70">Gross Salary</p>
              <p className="text-2xl font-bold">৳ {gross.toLocaleString()}</p>
            </div>
          </div>
        )
      case 'bank':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label-field">Bank Name</label>
              <input
                type="text"
                value={formData.bankName}
                onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">Account Number</label>
              <input
                type="text"
                value={formData.bankAccountNo}
                onChange={e => setFormData({ ...formData, bankAccountNo: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">Branch</label>
              <input
                type="text"
                value={formData.bankBranch}
                onChange={e => setFormData({ ...formData, bankBranch: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">Mobile Banking Type</label>
              <select
                value={formData.mobileBankingType}
                onChange={e => setFormData({ ...formData, mobileBankingType: e.target.value })}
                className="input-field"
              >
                <option value="">Select</option>
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
                <option value="Rocket">Rocket</option>
                <option value="Upay">Upay</option>
              </select>
            </div>
            <div>
              <label className="label-field">Mobile Banking Number</label>
              <input
                type="text"
                value={formData.mobileBankingNo}
                onChange={e => setFormData({ ...formData, mobileBankingNo: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        )
      case 'nominee':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Nominee Name</label>
              <input
                type="text"
                value={formData.nomineeName}
                onChange={e => setFormData({ ...formData, nomineeName: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">Relation</label>
              <input
                type="text"
                value={formData.nomineeRelation}
                onChange={e => setFormData({ ...formData, nomineeRelation: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">Nominee Phone</label>
              <input
                type="text"
                value={formData.nomineePhone}
                onChange={e => setFormData({ ...formData, nomineePhone: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
              activeTab === tab.id
                ? "border-primary-orange text-primary-orange"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}

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
        {isPending ? (
          <span>Processing...</span>
        ) : (
          <>
            <Save className="w-5 h-5" />
            {employee ? "Update Employee" : "Create Employee"}
          </>
        )}
      </button>
    </form>
  )
}
