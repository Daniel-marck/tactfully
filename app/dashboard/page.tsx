import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SignOutButton } from "./sign-out-button"
import { DraftForm } from "./draft-form"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Clean Minimal Header (No user emails or greetings here!) */}
      <header className="h-14 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
        <span className="font-semibold text-base tracking-tight text-indigo-400">Tactfully</span>
        <SignOutButton />
      </header>

      {/* Top-aligned application canvas */}
      <main className="flex-1 flex items-start justify-center p-4 md:p-8 overflow-y-auto">
        <DraftForm />
      </main>
    </div>
  )
}
