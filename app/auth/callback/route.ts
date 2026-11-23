import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const requestedNext = url.searchParams.get("next") || "/dashboard"
  const next = requestedNext.startsWith("/") && !requestedNext.startsWith("//")
    ? requestedNext
    : "/dashboard"

  if (!code) {
    return NextResponse.redirect(new URL("/sign-in?error=auth_callback", url.origin))
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error("Supabase auth callback failed:", error.message)
    return NextResponse.redirect(new URL("/sign-in?error=auth_callback", url.origin))
  }

  return NextResponse.redirect(new URL(next, url.origin))
}
