import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      name: 'System Administrator',
      email: 'admin@meghswar.com',
      role: 'ADMIN',
      isActive: true,
    },
  })
  console.log('✅ Created admin user:', admin.username)

  // Create Manager User
  const managerPassword = await bcrypt.hash('manager123', 10)
  const manager = await prisma.user.upsert({
    where: { username: 'manager' },
    update: {},
    create: {
      username: 'manager',
      password: managerPassword,
      name: 'Store Manager',
      email: 'manager@meghswar.com',
      role: 'MANAGER',
      isActive: true,
    },
  })
  console.log('✅ Created manager user:', manager.username)

  // Chart of Accounts - Assets (1000-1999)
  const coaData = [
    // Assets - Cash & Bank (1000-1099)
    { code: '1001', name: 'Cash in Hand', group: 'ASSETS', isCashBank: true, isHeader: true },
    { code: '1011', name: 'Dutch Bangla Bank', group: 'ASSETS', isCashBank: true },
    { code: '1012', name: 'bKash', group: 'ASSETS', isCashBank: true },
    { code: '1013', name: 'Nagad', group: 'ASSETS', isCashBank: true },
    { code: '1020', name: 'Accounts Receivable', group: 'ASSETS', isHeader: true },
    { code: '1021', name: 'Merchant Receivable', group: 'ASSETS' },

    // Assets - Fixed (1100-1199)
    { code: '1101', name: 'Office Equipment', group: 'ASSETS' },
    { code: '1102', name: 'Motor Bike', group: 'ASSETS' },
    { code: '1103', name: 'Mobile Phone', group: 'ASSETS' },

    // Liabilities (2000-2999)
    { code: '2001', name: 'Merchant Payable', group: 'LIABILITIES', isHeader: true },
    { code: '2002', name: 'Salary Payable', group: 'LIABILITIES' },
    { code: '2003', name: 'Advance from Customer', group: 'LIABILITIES' },
    { code: '2010', name: 'Accounts Payable', group: 'LIABILITIES', isHeader: true },

    // Income (4000-4999)
    { code: '4001', name: 'Delivery Income', group: 'INCOME', isHeader: true },
    { code: '4002', name: 'COD Income', group: 'INCOME' },
    { code: '4003', name: 'Return Income', group: 'INCOME' },
    { code: '4099', name: 'Other Income', group: 'INCOME' },

    // Expenses (5000-5999)
    { code: '5001', name: 'Salary Expense', group: 'EXPENSES', isHeader: true },
    { code: '5002', name: 'Employee Allowance', group: 'EXPENSES' },
    { code: '5003', name: 'Employee Advance', group: 'EXPENSES' },
    { code: '5101', name: 'Rent Expense', group: 'EXPENSES' },
    { code: '5102', name: 'Utility Expense', group: 'EXPENSES' },
    { code: '5103', name: 'Internet Expense', group: 'EXPENSES' },
    { code: '5104', name: 'Transport Expense', group: 'EXPENSES' },
    { code: '5201', name: 'Maintenance Expense', group: 'EXPENSES' },
    { code: '5202', name: 'Office Supplies', group: 'EXPENSES' },
    { code: '5999', name: 'Miscellaneous Expense', group: 'EXPENSES' },

    // Equity (6000-6999)
    { code: '6001', name: 'Capital Account', group: 'EQUITY' },
    { code: '6002', name: 'Retained Earnings', group: 'EQUITY' },
  ]

  for (const coa of coaData) {
    await prisma.chartOfAccounts.upsert({
      where: { accountCode: coa.code },
      update: {},
      create: {
        accountCode: coa.code,
        accountName: coa.name,
        accountGroup: coa.group as any,
        isHeader: coa.isHeader || false,
        isCashBank: coa.isCashBank || false,
        isActive: true,
      },
    })
  }
  console.log('✅ Created Chart of Accounts')

  // Create Sample Employees (2 Riders)
  const employeeData = [
    {
      code: 'EMP0001',
      name: 'Rashid Ahmed',
      father: 'Md. Abdul Haque',
      mother: 'Salma Begum',
      dob: new Date('1995-03-15'),
      gender: 'Male',
      maritalStatus: 'Married',
      religion: 'Islam',
      phone: '01712345678',
      presentAddress: 'House #12, Road #5, Dhanmondi, Dhaka',
      permanentAddress: 'Village: Charigram, Post: Bhola Sadar, District: Bhola',
      nidNumber: '1234567890123',
      isRider: true,
      designation: 'Delivery Rider',
      department: 'Delivery',
      joinDate: new Date('2024-01-01'),
      basicSalary: 8000,
      houseRentAllowance: 4000,
      medicalAllowance: 1500,
      transportAllowance: 2000,
      otherAllowance: 500,
      mobileBankingType: 'bKash',
      mobileBankingNo: '01712345678',
      nomineeName: 'Fatema Begum',
      nomineeRelation: 'Wife',
      nomineePhone: '01787654321',
    },
    {
      code: 'EMP0002',
      name: 'Kamrul Hasan',
      father: 'Md. Ali Mia',
      mother: 'Amina Begum',
      dob: new Date('1998-07-22'),
      gender: 'Male',
      maritalStatus: 'Single',
      religion: 'Islam',
      phone: '01723456789',
      presentAddress: 'Flat #A2, House #45, Mirpur Road, Dhaka',
      permanentAddress: 'Village: Kallyanpur, Post: Kallyanpur, District: Sylhet',
      nidNumber: '2345678901234',
      isRider: true,
      designation: 'Delivery Rider',
      department: 'Delivery',
      joinDate: new Date('2024-02-15'),
      basicSalary: 8000,
      houseRentAllowance: 4000,
      medicalAllowance: 1500,
      transportAllowance: 2000,
      otherAllowance: 500,
      bankName: 'Dutch Bangla Bank',
      bankAccountNo: '1234567890',
      bankBranch: 'Gulshan Branch',
      nomineeName: 'Rahima Begum',
      nomineeRelation: 'Mother',
      nomineePhone: '01723456780',
    },
  ]

  for (const emp of employeeData) {
    const employee = await prisma.employee.upsert({
      where: { employeeCode: emp.code },
      update: {},
      create: {
        employeeCode: emp.code,
        fullName: emp.name,
        fatherName: emp.father,
        motherName: emp.mother,
        dateOfBirth: emp.dob,
        gender: emp.gender,
        maritalStatus: emp.maritalStatus,
        religion: emp.religion,
        phone: emp.phone,
        presentAddress: emp.presentAddress,
        permanentAddress: emp.permanentAddress,
        nidNumber: emp.nidNumber,
        isRider: emp.isRider,
        designation: emp.designation,
        department: emp.department,
        joinDate: emp.joinDate,
        basicSalary: emp.basicSalary,
        houseRentAllowance: emp.houseRentAllowance,
        medicalAllowance: emp.medicalAllowance,
        transportAllowance: emp.transportAllowance,
        otherAllowance: emp.otherAllowance,
        grossSalary: emp.basicSalary + emp.houseRentAllowance + emp.medicalAllowance + emp.transportAllowance + emp.otherAllowance,
        bankName: emp.bankName,
        bankAccountNo: emp.bankAccountNo,
        bankBranch: emp.bankBranch,
        mobileBankingType: emp.mobileBankingType,
        mobileBankingNo: emp.mobileBankingNo,
        nomineeName: emp.nomineeName,
        nomineeRelation: emp.nomineeRelation,
        nomineePhone: emp.nomineePhone,
      },
    })
    console.log('✅ Created employee:', employee.employeeCode, employee.fullName)
  }

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
