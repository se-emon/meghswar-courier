import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBDT(amount: number | string | unknown | undefined): string {
  if (amount === undefined || amount === null) return "0.00"
  let num: number
  if (typeof amount === 'string') {
    num = parseFloat(amount)
  } else if (typeof amount === 'object' && amount !== null) {
    const val = amount as { toNumber?: () => number }
    if (typeof val.toNumber === 'function') {
      num = val.toNumber()
    } else {
      num = Number(val)
    }
  } else {
    num = amount as number
  }
  if (isNaN(num)) return "0.00"
  
  const parts = num.toFixed(2).split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  
  return parts.join('.')
}

export function parseBDT(amount: string): number {
  if (!amount) return 0
  return parseFloat(amount.replace(/,/g, ''))
}

export function formatDateDisplay(date: Date | string | undefined): string {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

export function formatDateStore(date: Date | string | undefined): string {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()
  return `${year}-${month}-${day}`
}

export function generateVoucherNo(voucherType: string, lastVoucherNo?: string): string {
  const now = new Date()
  const yy = String(now.getFullYear()).slice(2)
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const datePart = `${yy}${mm}${dd}`

  if (!lastVoucherNo) {
    return `${voucherType}${datePart}001`
  }

  const prefix = voucherType
  const existingDatePart = lastVoucherNo.slice(prefix.length, prefix.length + 6)
  const existingSeq = lastVoucherNo.slice(-3)

  if (existingDatePart === datePart) {
    const newSeq = String(parseInt(existingSeq) + 1).padStart(3, '0')
    return `${voucherType}${datePart}${newSeq}`
  }

  return `${voucherType}${datePart}001`
}

export function generateEmployeeCode(lastCode?: string): string {
  if (!lastCode) return 'EMP0001'
  const num = parseInt(lastCode.slice(3)) + 1
  return `EMP${num.toString().padStart(4, '0')}`
}

export function getCurrentMonth(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

export function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return months[month]
}

export function calculatePayroll(
  basicSalary: number,
  houseRent: number,
  medical: number,
  transport: number,
  otherAllowance: number,
  advanceDeduction: number
): {
  basicSalary: number
  houseRent: number
  medical: number
  transport: number
  otherAllowance: number
  grossSalary: number
  advanceDeduction: number
  netSalary: number
} {
  const grossSalary = basicSalary + houseRent + medical + transport + otherAllowance
  const netSalary = grossSalary - advanceDeduction

  return {
    basicSalary,
    houseRent,
    medical,
    transport,
    otherAllowance,
    grossSalary,
    advanceDeduction,
    netSalary
  }
}

export const VOUCHER_TYPES = [
  { value: 'RV', label: 'Receive Voucher', description: 'Money received from customer' },
  { value: 'PV', label: 'Payment Voucher', description: 'Payment to supplier/staff' },
  { value: 'JV', label: 'Journal Voucher', description: 'Adjusting entries' },
  { value: 'TV', label: 'Transfer Voucher', description: 'Transfer between accounts' },
  { value: 'DI', label: 'Delivery Income', description: 'Income from delivery service' },
]

export const ACCOUNT_GROUPS = [
  { value: 'ASSETS', label: 'Assets' },
  { value: 'LIABILITIES', label: 'Liabilities' },
  { value: 'INCOME', label: 'Income' },
  { value: 'EXPENSES', label: 'Expenses' },
  { value: 'EQUITY', label: 'Equity' },
]

export const RELIGIONS = ['Islam', 'Hinduism', 'Buddhism', 'Christianity', 'Other']
export const GENDERS = ['Male', 'Female', 'Other']
export const MARITAL_STATUS = ['Single', 'Married', 'Divorced', 'Widowed']
export const EMPLOYMENT_STATUS = ['ACTIVE', 'INACTIVE', 'TERMINATED', 'RESIGNED']
export const MOBILE_BANKING_TYPES = ['bKash', 'Nagad', 'Rocket', 'Upay']
