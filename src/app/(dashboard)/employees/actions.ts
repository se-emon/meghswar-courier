"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

interface EmployeeData {
  fullName: string
  fatherName: string
  motherName: string
  dateOfBirth: string
  gender: string
  maritalStatus: string
  religion: string
  phone: string
  email: string
  presentAddress: string
  permanentAddress: string
  nidNumber: string
  isRider: boolean
  designation: string
  department: string
  joinDate: string
  basicSalary: string
  houseRentAllowance: string
  medicalAllowance: string
  transportAllowance: string
  otherAllowance: string
  grossSalary: number
  bankName: string
  bankAccountNo: string
  bankBranch: string
  mobileBankingType: string
  mobileBankingNo: string
  nomineeName: string
  nomineeRelation: string
  nomineePhone: string
}

export async function createEmployee(data: EmployeeData) {
  const session = await auth()
  if (!session) {
    return { error: "Unauthorized" }
  }

  try {
    // Get the last employee code
    const lastEmployee = await prisma.employee.findFirst({
      orderBy: { employeeCode: 'desc' }
    })

    let employeeCode = "EMP0001"
    if (lastEmployee) {
      const num = parseInt(lastEmployee.employeeCode.slice(3)) + 1
      employeeCode = `EMP${num.toString().padStart(4, '0')}`
    }

    const employee = await prisma.employee.create({
      data: {
        employeeCode,
        fullName: data.fullName,
        fatherName: data.fatherName || null,
        motherName: data.motherName || null,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        gender: data.gender || null,
        maritalStatus: data.maritalStatus || null,
        religion: data.religion || null,
        phone: data.phone,
        email: data.email || null,
        presentAddress: data.presentAddress || null,
        permanentAddress: data.permanentAddress || null,
        nidNumber: data.nidNumber || null,
        isRider: data.isRider,
        designation: data.designation || null,
        department: data.department || null,
        joinDate: data.joinDate ? new Date(data.joinDate) : null,
        basicSalary: parseFloat(data.basicSalary) || 0,
        houseRentAllowance: parseFloat(data.houseRentAllowance) || 0,
        medicalAllowance: parseFloat(data.medicalAllowance) || 0,
        transportAllowance: parseFloat(data.transportAllowance) || 0,
        otherAllowance: parseFloat(data.otherAllowance) || 0,
        grossSalary: data.grossSalary,
        bankName: data.bankName || null,
        bankAccountNo: data.bankAccountNo || null,
        bankBranch: data.bankBranch || null,
        mobileBankingType: data.mobileBankingType || null,
        mobileBankingNo: data.mobileBankingNo || null,
        nomineeName: data.nomineeName || null,
        nomineeRelation: data.nomineeRelation || null,
        nomineePhone: data.nomineePhone || null,
        isActive: true
      }
    })

    return { success: true, employee }
  } catch (error) {
    console.error("Create employee error:", error)
    return { error: "Failed to create employee" }
  }
}

export async function updateEmployee(id: string, data: EmployeeData) {
  const session = await auth()
  if (!session) {
    return { error: "Unauthorized" }
  }

  try {
    const employee = await prisma.employee.update({
      where: { id },
      data: {
        fullName: data.fullName,
        fatherName: data.fatherName || null,
        motherName: data.motherName || null,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        gender: data.gender || null,
        maritalStatus: data.maritalStatus || null,
        religion: data.religion || null,
        phone: data.phone,
        email: data.email || null,
        presentAddress: data.presentAddress || null,
        permanentAddress: data.permanentAddress || null,
        nidNumber: data.nidNumber || null,
        isRider: data.isRider,
        designation: data.designation || null,
        department: data.department || null,
        joinDate: data.joinDate ? new Date(data.joinDate) : null,
        basicSalary: parseFloat(data.basicSalary) || 0,
        houseRentAllowance: parseFloat(data.houseRentAllowance) || 0,
        medicalAllowance: parseFloat(data.medicalAllowance) || 0,
        transportAllowance: parseFloat(data.transportAllowance) || 0,
        otherAllowance: parseFloat(data.otherAllowance) || 0,
        grossSalary: data.grossSalary,
        bankName: data.bankName || null,
        bankAccountNo: data.bankAccountNo || null,
        bankBranch: data.bankBranch || null,
        mobileBankingType: data.mobileBankingType || null,
        mobileBankingNo: data.mobileBankingNo || null,
        nomineeName: data.nomineeName || null,
        nomineeRelation: data.nomineeRelation || null,
        nomineePhone: data.nomineePhone || null
      }
    })

    return { success: true, employee }
  } catch (error) {
    console.error("Update employee error:", error)
    return { error: "Failed to update employee" }
  }
}

export async function getEmployees() {
  const employees = await prisma.employee.findMany({
    where: { isActive: true },
    orderBy: [{ employeeCode: 'desc' }]
  })
  return employees.map(e => ({
    id: e.id,
    employeeCode: e.employeeCode,
    fullName: e.fullName,
    fatherName: e.fatherName,
    motherName: e.motherName,
    dateOfBirth: e.dateOfBirth,
    gender: e.gender,
    maritalStatus: e.maritalStatus,
    religion: e.religion,
    phone: e.phone,
    email: e.email,
    presentAddress: e.presentAddress,
    permanentAddress: e.permanentAddress,
    nidNumber: e.nidNumber,
    isRider: e.isRider,
    designation: e.designation,
    department: e.department,
    joinDate: e.joinDate,
    employmentStatus: e.employmentStatus,
    basicSalary: Number(e.basicSalary),
    houseRentAllowance: Number(e.houseRentAllowance),
    medicalAllowance: Number(e.medicalAllowance),
    transportAllowance: Number(e.transportAllowance),
    otherAllowance: Number(e.otherAllowance),
    grossSalary: Number(e.grossSalary),
    bankName: e.bankName,
    bankAccountNo: e.bankAccountNo,
    bankBranch: e.bankBranch,
    mobileBankingType: e.mobileBankingType,
    mobileBankingNo: e.mobileBankingNo,
    nomineeName: e.nomineeName,
    nomineeRelation: e.nomineeRelation,
    nomineePhone: e.nomineePhone,
    isActive: e.isActive
  }))
}

export async function getEmployeeById(id: string) {
  const employee = await prisma.employee.findUnique({
    where: { id }
  })
  if (!employee) return null
  return {
    ...employee,
    basicSalary: Number(employee.basicSalary),
    houseRentAllowance: Number(employee.houseRentAllowance),
    medicalAllowance: Number(employee.medicalAllowance),
    transportAllowance: Number(employee.transportAllowance),
    otherAllowance: Number(employee.otherAllowance),
    grossSalary: Number(employee.grossSalary)
  }
}
