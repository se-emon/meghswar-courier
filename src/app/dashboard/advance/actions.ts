"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

interface CreateAdvanceData {
  employeeId: string
  amount: number
  installments: number
  purpose: string
  startMonth: string
}

export async function createAdvance(data: CreateAdvanceData) {
  const session = await auth()
  if (!session) {
    return { error: "Unauthorized" }
  }

  try {
    const { employeeId, amount, installments, purpose, startMonth } = data
    const monthlyDeduction = amount / installments

    // Create advance record
    const advance = await prisma.advance.create({
      data: {
        employeeId,
        amount,
        purpose,
        totalInstallments: installments,
        paidInstallments: 0,
        monthlyDeduction,
        remainingAmount: amount,
        status: 'PENDING',
        startMonth: new Date(startMonth + "-01")
      }
    })

    return { success: true, advance }
  } catch (error) {
    console.error("Create advance error:", error)
    return { error: "Failed to create advance" }
  }
}

export async function getActiveEmployees() {
  const employees = await prisma.employee.findMany({
    where: { isActive: true, employmentStatus: 'ACTIVE' },
    orderBy: [{ employeeCode: 'asc' }]
  })
  return employees.map(e => ({
    id: e.id,
    employeeCode: e.employeeCode,
    fullName: e.fullName,
    grossSalary: Number(e.grossSalary)
  }))
}

export async function getAdvances() {
  const advances = await prisma.advance.findMany({
    include: { employee: true },
    orderBy: [{ createdAt: 'desc' }]
  })
  return advances.map(a => ({
    ...a,
    amount: Number(a.amount),
    monthlyDeduction: Number(a.monthlyDeduction),
    remainingAmount: Number(a.remainingAmount)
  }))
}
