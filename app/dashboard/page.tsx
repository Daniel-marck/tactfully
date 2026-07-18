import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DraftForm } from "./draft-form"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <DraftForm />
}
