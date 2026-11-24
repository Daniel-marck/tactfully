"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { BrandMark } from "@/components/brand-mark"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      })
      if (error) throw error
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send a reset email. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <Link href="/" className="mb-8 flex items-center gap-2" aria-label="Tactfully home">
        <BrandMark size={32} />
        <span className="text-lg font-semibold tracking-tight">Tactfully</span>
      </Link>
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8">
        {sent ? (
          <>
            <h1 className="text-xl font-semibold tracking-tight">Check your email</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              If an account exists for {email}, a password-reset link will be sent.
              Follow the link to choose a new password.
            </p>
            <Link href="/sign-in">
              <Button className="mt-6 h-10 w-full">Back to sign in</Button>
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold tracking-tight">Reset your password</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter the email address associated with your Tactfully account.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  placeholder="you@example.com"
                />
              </div>
              {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
              <Button type="submit" disabled={loading} className="h-10 w-full">
                {loading ? "Sending link…" : "Send reset link"}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Remembered your password?{" "}
              <Link href="/sign-in" className="font-medium text-primary hover:underline">Sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
