import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { getAccounts, getLastVoucherNo } from "./actions"
import { VoucherForm } from "./VoucherForm"

export default async function VoucherPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const accounts = await getAccounts()
  const lastRV = await getLastVoucherNo("RV")

  return <VoucherForm accounts={accounts} lastVoucherNo={lastRV} />
}
