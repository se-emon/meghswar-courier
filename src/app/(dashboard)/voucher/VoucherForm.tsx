"use client"

import { useState, useEffect, useTransition } from "react"
import { cn } from "@/lib/utils"
import { VOUCHER_TYPES } from "@/lib/utils"
import { createVoucher } from "./actions"
import { 
  Save, 
  AlertTriangle, 
  Wallet,
  Building2,
  Smartphone,
  CheckCircle
} from "lucide-react"

interface Account {
  id: string
  accountCode: string
  accountName: string
  currentBalance: number
  isCashBank: boolean
  isHeader: boolean
}

interface VoucherFormProps {
  accounts: Account[]
  lastVoucherNo?: string
}

export function VoucherForm({ accounts, lastVoucherNo }: VoucherFormProps) {
  const [selectedType, setSelectedType] = useState<string>("RV")
  const [voucherNo, setVoucherNo] = useState<string>("")
  const [amount, setAmount] = useState<string>("")
  const [drAccountId, setDrAccountId] = useState<string>("")
  const [crAccountId, setCrAccountId] = useState<string>("")
  const [transactionWith, setTransactionWith] = useState<string>("")
  const [narration, setNarration] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [isPending, startTransition] = useTransition()

  const cashBankAccounts = accounts.filter(a => a.isCashBank)
  const otherAccounts = accounts.filter(a => !a.isHeader && !a.isCashBank)
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const type = selectedType
    const now = new Date()
    const yy = String(now.getFullYear()).slice(2)
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    const datePart = `${yy}${mm}${dd}`

    if (lastVoucherNo && lastVoucherNo.startsWith(type)) {
      const existingSeq = lastVoucherNo.slice(-3)
      const newSeq = String(parseInt(existingSeq) + 1).padStart(3, '0')
      setVoucherNo(`${type}${datePart}${newSeq}`)
    } else {
      setVoucherNo(`${type}${datePart}001`)
    }

    // Reset form when type changes
    setDrAccountId("")
    setCrAccountId("")
    setAmount("")
    setTransactionWith("")
    setNarration("")
    setError("")
    setSuccess("")
  }, [selectedType, lastVoucherNo])

  // Set default CR account for DI
  useEffect(() => {
    if (selectedType === "DI") {
      const deliveryIncome = accounts.find(a => a.accountCode === "4001")
      if (deliveryIncome) {
        setCrAccountId(deliveryIncome.id)
      }
    }
  }, [selectedType, accounts])

  const getAccountBalance = (accId: string) => {
    const acc = accounts.find(a => a.id === accId)
    return acc?.currentBalance || 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    if (!drAccountId || !crAccountId) {
      setError("Please select both Debit and Credit accounts")
      return
    }

    if (drAccountId === crAccountId) {
      setError("Debit and Credit accounts cannot be the same")
      return
    }

    // Check balance for PV
    if (selectedType === "PV") {
      const balance = getAccountBalance(crAccountId)
      if (parseFloat(amount) > balance) {
        setError(`Insufficient balance! Available: ৳ ${balance.toLocaleString()}`)
        return
      }
    }

    startTransition(async () => {
      const result = await createVoucher({
        voucherNo,
        voucherType: selectedType as 'RV' | 'PV' | 'JV' | 'TV' | 'DI',
        amount: parseFloat(amount),
        drAccountId,
        crAccountId,
        transactionWith,
        narration
      })

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess("Voucher saved successfully!")
        setAmount("")
        setDrAccountId("")
        setCrAccountId("")
        setTransactionWith("")
        setNarration("")
        setTimeout(() => setSuccess(""), 3000)
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary-navy">Voucher Entry</h1>
        <div className="text-sm text-gray-500">Date: {today}</div>
      </div>

      {/* Voucher Type Buttons */}
      <div className="grid grid-cols-5 gap-3">
        {VOUCHER_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => setSelectedType(type.value)}
            className={cn(
              "p-4 rounded-xl border-2 transition-all text-center",
              selectedType === type.value
                ? "border-primary-orange bg-primary-orange text-white shadow-lg"
                : "border-gray-200 bg-white hover:border-primary-orange/50"
            )}
          >
            <div className="font-bold text-lg">{type.value}</div>
            <div className="text-xs mt-1 opacity-80">{type.label}</div>
          </button>
        ))}
      </div>

      {/* Balance Display */}
      <div className="grid grid-cols-3 gap-4">
        {cashBankAccounts.map((acc) => (
          <div key={acc.id} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{acc.accountName}</p>
                <p className="text-xl font-bold text-primary-navy">
                  ৳ {acc.currentBalance.toLocaleString()}
                </p>
              </div>
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                acc.accountCode === "1001" ? "bg-green-100" :
                acc.accountCode === "1011" ? "bg-blue-100" :
                "bg-purple-100"
              )}>
                {acc.accountCode === "1001" ? <Wallet className="w-5 h-5 text-green-600" /> :
                 acc.accountCode === "1011" ? <Building2 className="w-5 h-5 text-blue-600" /> :
                 <Smartphone className="w-5 h-5 text-purple-600" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Voucher Form */}
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">Voucher No</label>
            <input
              type="text"
              value={voucherNo}
              className="input-field bg-gray-50 font-mono"
              readOnly
            />
          </div>
          <div>
            <label className="label-field">Voucher Type</label>
            <input
              type="text"
              value={VOUCHER_TYPES.find(t => t.value === selectedType)?.label || ""}
              className="input-field bg-gray-50"
              readOnly
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">
              {selectedType === "PV" || selectedType === "TV" ? "Pay From (Debit Account)" : "Receive From (Debit Account)"}
            </label>
            <select
              value={drAccountId}
              onChange={(e) => setDrAccountId(e.target.value)}
              className="input-field"
              required
            >
              <option value="">Select Account</option>
              {selectedType === "DI" ? (
                <option value="2001">2001 - Merchant Payable</option>
              ) : (
                <>
                  <optgroup label="Cash & Bank">
                    {cashBankAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.accountCode} - {acc.accountName} (Bal: ৳ {acc.currentBalance.toLocaleString()})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Other Accounts">
                    {otherAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.accountCode} - {acc.accountName}
                      </option>
                    ))}
                  </optgroup>
                </>
              )}
            </select>
          </div>
          <div>
            <label className="label-field">
              {selectedType === "RV" || selectedType === "DI" ? "Deposit To (Credit Account)" : "Pay To (Credit Account)"}
            </label>
            <select
              value={crAccountId}
              onChange={(e) => setCrAccountId(e.target.value)}
              className="input-field"
              required
              disabled={selectedType === "DI"}
            >
              <option value="">Select Account</option>
              {selectedType === "DI" ? (
                <option value="4001">4001 - Delivery Income</option>
              ) : (
                <>
                  <optgroup label="Cash & Bank">
                    {cashBankAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.accountCode} - {acc.accountName}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Other Accounts">
                    {otherAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.accountCode} - {acc.accountName}
                      </option>
                    ))}
                  </optgroup>
                </>
              )}
            </select>
          </div>
        </div>

        <div>
          <label className="label-field">Amount (৳)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input-field text-lg font-semibold"
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="label-field">Transaction With</label>
          <input
            type="text"
            value={transactionWith}
            onChange={(e) => setTransactionWith(e.target.value)}
            className="input-field"
            placeholder="Enter customer/supplier name"
          />
        </div>

        <div>
          <label className="label-field">Narration</label>
          <textarea
            value={narration}
            onChange={(e) => setNarration(e.target.value)}
            className="input-field"
            rows={3}
            placeholder="Enter description"
          />
        </div>

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
              Save Voucher
            </>
          )}
        </button>
      </form>
    </div>
  )
}
