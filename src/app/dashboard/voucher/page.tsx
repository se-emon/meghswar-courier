import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getAccounts, getLastVoucherNo } from "./actions"
import { VoucherForm } from "./VoucherForm"

export default async function VoucherPage() {
  const cookieStore = cookies()
  const token = cookieStore.get("auth-token")?.value
  
  if (!token) {
    redirect("/login")
  }

  const accounts = await getAccounts()
  const lastRV = await getLastVoucherNo("RV")

  return <VoucherForm accounts={accounts} lastVoucherNo={lastRV} />
}
