import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SignOutButton } from "./sign-out-button"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-4">
      <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-muted-foreground">Signed in as {user.email}</p>
      <div className="mt-6">
        <SignOutButton />
      </div>
    </div>
  )
}
