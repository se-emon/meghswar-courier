"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

type VoucherType = 'RV' | 'PV' | 'JV' | 'TV' | 'DI'

interface CreateVoucherData {
  voucherNo: string
  voucherType: VoucherType
  amount: number
  drAccountId: string
  crAccountId: string
  transactionWith: string
  narration: string
}

export async function createVoucher(data: CreateVoucherData) {
  const session = await auth()
  if (!session) {
    return { error: "Unauthorized" }
  }

  try {
    const { voucherNo, voucherType, amount, drAccountId, crAccountId, transactionWith, narration } = data

    // Check balance for PV
    if (voucherType === "PV") {
      const crAccount = await prisma.chartOfAccounts.findUnique({
        where: { id: crAccountId }
      })
      if (crAccount) {
        const currentBalance = Number(crAccount.currentBalance)
        if (amount > currentBalance) {
          return { error: `Insufficient balance! Available: ৳ ${currentBalance.toLocaleString()}` }
        }
      }
    }

    // Create VoucherMain and Ledger entries in a transaction
    await prisma.$transaction(async (tx) => {
      // Create VoucherMain
      const voucher = await tx.voucherMain.create({
        data: {
          voucherNo,
          voucherType,
          voucherDate: new Date(),
          amount,
          drAccountId,
          crAccountId,
          narration: narration || null,
          transactionWith: transactionWith || null,
          createdBy: session.user.username,
          isPosted: true
        }
      })

      // Create two Ledger entries (Double Entry)
      // 1. Debit entry
      await tx.ledger.create({
        data: {
          voucherMainId: voucher.id,
          accountId: drAccountId,
          voucherNo,
          voucherType,
          voucherDate: new Date(),
          debit: amount,
          credit: 0,
          narration: narration || null
        }
      })

      // 2. Credit entry
      await tx.ledger.create({
        data: {
          voucherMainId: voucher.id,
          accountId: crAccountId,
          voucherNo,
          voucherType,
          voucherDate: new Date(),
          debit: 0,
          credit: amount,
          narration: narration || null
        }
      })

      // Update account balances based on voucher type
      if (voucherType === "RV" || voucherType === "DI") {
        await tx.chartOfAccounts.update({
          where: { id: drAccountId },
          data: { currentBalance: { increment: amount } }
        })
        await tx.chartOfAccounts.update({
          where: { id: crAccountId },
          data: { currentBalance: { increment: amount } }
        })
      } else if (voucherType === "PV") {
        await tx.chartOfAccounts.update({
          where: { id: crAccountId },
          data: { currentBalance: { decrement: amount } }
        })
        await tx.chartOfAccounts.update({
          where: { id: drAccountId },
          data: { currentBalance: { increment: amount } }
        })
      } else if (voucherType === "JV" || voucherType === "TV") {
        const drAccount = await tx.chartOfAccounts.findUnique({ where: { id: drAccountId } })
        const crAccount = await tx.chartOfAccounts.findUnique({ where: { id: crAccountId } })
        
        if (drAccount?.isCashBank && !crAccount?.isCashBank) {
          await tx.chartOfAccounts.update({
            where: { id: drAccountId },
            data: { currentBalance: { decrement: amount } }
          })
          await tx.chartOfAccounts.update({
            where: { id: crAccountId },
            data: { currentBalance: { increment: amount } }
          })
        } else if (!drAccount?.isCashBank && crAccount?.isCashBank) {
          await tx.chartOfAccounts.update({
            where: { id: crAccountId },
            data: { currentBalance: { increment: amount } }
          })
          await tx.chartOfAccounts.update({
            where: { id: drAccountId },
            data: { currentBalance: { decrement: amount } }
          })
        }
      }
    })

    return { success: true, voucherNo }
  } catch (error) {
    console.error("Voucher creation error:", error)
    return { error: "Failed to create voucher" }
  }
}

export async function getAccounts() {
  const accounts = await prisma.chartOfAccounts.findMany({
    where: { isActive: true, isHeader: false },
    orderBy: [{ accountCode: 'asc' }]
  })
  return accounts.map(a => ({
    id: a.id,
    accountCode: a.accountCode,
    accountName: a.accountName,
    currentBalance: Number(a.currentBalance),
    isCashBank: a.isCashBank,
    isHeader: a.isHeader
  }))
}

export async function getLastVoucherNo(voucherType: string) {
  const lastVoucher = await prisma.voucherMain.findFirst({
    where: { voucherType: voucherType as VoucherType },
    orderBy: { voucherNo: 'desc' }
  })
  return lastVoucher?.voucherNo
}
