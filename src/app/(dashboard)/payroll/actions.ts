"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function getEmployeesForPayroll(month: string) {
  const session = await auth()
  if (!session) {
    return { error: "Unauthorized" }
  }

  try {
    const monthStart = new Date(month + "-01")
    const monthEnd = new Date(monthStart)
    monthEnd.setMonth(monthEnd.getMonth() + 1)

    const employees = await prisma.employee.findMany({
      where: { 
        isActive: true, 
        employmentStatus: 'ACTIVE' 
      }
    })

    const employeesWithAdvances = await Promise.all(
      employees.map(async (emp) => {
        const advanceDeduction = await prisma.advance.aggregate({
          where: {
            employeeId: emp.id,
            status: { in: ['PENDING', 'PARTIAL'] },
            startMonth: { lte: monthEnd }
          },
          _sum: { monthlyDeduction: true }
        })

        const monthlyDeduction = Number(advanceDeduction._sum.monthlyDeduction || 0)
        const grossSalary = Number(emp.grossSalary)
        const netSalary = grossSalary - monthlyDeduction

        return {
          id: emp.id,
          employeeCode: emp.employeeCode,
          fullName: emp.fullName,
          basicSalary: Number(emp.basicSalary),
          houseRentAllowance: Number(emp.houseRentAllowance),
          medicalAllowance: Number(emp.medicalAllowance),
          transportAllowance: Number(emp.transportAllowance),
          otherAllowance: Number(emp.otherAllowance),
          grossSalary,
          advanceDeduction: monthlyDeduction,
          netSalary
        }
      })
    )

    return { success: true, employees: employeesWithAdvances }
  } catch (error) {
    console.error("Get payroll error:", error)
    return { error: "Failed to get employees for payroll" }
  }
}

export async function generatePayroll(month: string, employeeIds: string[]) {
  const session = await auth()
  if (!session) {
    return { error: "Unauthorized" }
  }

  try {
    const monthStart = new Date(month + "-01")
    const monthEnd = new Date(monthStart)
    monthEnd.setMonth(monthEnd.getMonth() + 1)

    for (const employeeId of employeeIds) {
      const employee = await prisma.employee.findUnique({
        where: { id: employeeId }
      })

      if (!employee) continue

      const advanceDeduction = await prisma.advance.aggregate({
        where: {
          employeeId,
          status: { in: ['PENDING', 'PARTIAL'] },
          startMonth: { lte: monthEnd }
        },
        _sum: { monthlyDeduction: true }
      })

      const monthlyDeduction = Number(advanceDeduction._sum.monthlyDeduction || 0)
      const netSalary = Number(employee.grossSalary) - monthlyDeduction

      await prisma.payrollMain.create({
        data: {
          employeeId,
          payrollMonth: monthStart,
          basicSalary: employee.basicSalary,
          houseRent: employee.houseRentAllowance,
          medical: employee.medicalAllowance,
          transport: employee.transportAllowance,
          otherAllowance: employee.otherAllowance,
          grossSalary: employee.grossSalary,
          advanceDeduction: monthlyDeduction,
          netSalary,
          isPaid: false
        }
      })
    }

    return { success: true }
  } catch (error) {
    console.error("Generate payroll error:", error)
    return { error: "Failed to generate payroll" }
  }
}

export async function getPayrollList() {
  const payroll = await prisma.payrollMain.findMany({
    include: { employee: true },
    orderBy: [{ payrollMonth: 'desc' }, { createdAt: 'desc' }]
  })
  return payroll.map(p => ({
    ...p,
    basicSalary: Number(p.basicSalary),
    houseRent: Number(p.houseRent),
    medical: Number(p.medical),
    transport: Number(p.transport),
    otherAllowance: Number(p.otherAllowance),
    grossSalary: Number(p.grossSalary),
    advanceDeduction: Number(p.advanceDeduction),
    netSalary: Number(p.netSalary)
  }))
}

export async function markPayrollAsPaid(id: string) {
  const session = await auth()
  if (!session) {
    return { error: "Unauthorized" }
  }

  try {
    await prisma.payrollMain.update({
      where: { id },
      data: {
        isPaid: true,
        paidDate: new Date()
      }
    })

    return { success: true }
  } catch (error) {
    console.error("Mark paid error:", error)
    return { error: "Failed to mark as paid" }
  }
}
