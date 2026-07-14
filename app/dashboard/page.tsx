import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SignOutButton } from "./sign-out-button"
import { DraftForm } from "./draft-form"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/sign-in")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, draft_count")
    .eq("id", user.id)
    .single()

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-4">
      <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-muted-foreground">Signed in as {user.email}</p>

      <div className="mt-8">
        <DraftForm
          initialPlan={profile?.plan ?? "free"}
          initialDraftCount={profile?.draft_count ?? 0}
          userEmail={user.email ?? ""}
        />
      </div>

      <div className="mt-6">
        <SignOutButton />
      </div>
    </div>
  )
}
