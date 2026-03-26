"use server"

import { signIn } from "@/auth"
import { redirect } from "next/navigation"

export async function login(formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  const result = await signIn("credentials", {
    username,
    password,
    redirect: false,
  })

  if (result?.error) {
    throw new Error("Invalid username or password")
  }

  redirect("/")
}
