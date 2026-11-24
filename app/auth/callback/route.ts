import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const requestedNext = url.searchParams.get("next") || "/dashboard"

  let destination: URL
  try {
    const candidate = new URL(requestedNext, url.origin)
    destination = candidate.origin === url.origin
      ? candidate
      : new URL("/dashboard", url.origin)
  } catch {
    destination = new URL("/dashboard", url.origin)
  }

  if (!code) {
    return NextResponse.redirect(new URL("/sign-in?error=auth_callback", url.origin))
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error("Supabase auth callback failed:", error.message)
    return NextResponse.redirect(new URL("/sign-in?error=auth_callback", url.origin))
  }

  return NextResponse.redirect(destination)
}
