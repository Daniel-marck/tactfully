"use client"

import { useState } from "react"

const FREE_LIMIT = 3
const GUMROAD_URL = "https://smartoolkit.gumroad.com/l/dzlkij"

export function DraftForm({
  initialPlan,
  initialDraftCount,
  userEmail,
}: {
  initialPlan: string
  initialDraftCount: number
  userEmail: string
}) {
  const [clientMessage, setClientMessage] = useState("")
  const [draft, setDraft] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [plan, setPlan] = useState(initialPlan)
  const [draftCount, setDraftCount] = useState(initialDraftCount)

  const atLimit = plan === "free" && draftCount >= FREE_LIMIT

  async function handleSubmit() {
    if (!clientMessage.trim() || atLimit) return
    setLoading(true)
    setError("")
    setDraft("")

    try {
      const res = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientMessage }),
      })

      const data = await res.json()

      if (res.status === 402) {
        setPlan("free")
        setDraftCount(FREE_LIMIT)
        setError(data.message ?? "Upgrade to Pro for unlimited drafts")
        return
      }

      if (!res.ok) {
        setError(data.message ?? "Something went wrong. Try again.")
        return
      }

      setDraft(data.draft)
      setDraftCount(data.draftCount)
      setPlan(data.plan)
    } catch {
      setError("Network error. Check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const upgradeUrl = `${GUMROAD_URL}?email=${encodeURIComponent(userEmail)}`

  return (
    <div className="flex flex-col gap-4">
      {plan === "free" && (
        <p className="text-sm text-muted-foreground">
          {draftCount}/{FREE_LIMIT} free drafts used
        </p>
      )}

      <textarea
        className="min-h-32 w-full rounded-lg border border-border bg-background p-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        placeholder="Paste the awkward client message here..."
        value={clientMessage}
        onChange={(e) => setClientMessage(e.target.value)}
        disabled={atLimit}
      />

      <button
        onClick={handleSubmit}
        disabled={loading || atLimit || !clientMessage.trim()}
        className="h-10 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground disabled:pointer-events-none disabled:opacity-50"
      >
        {loading ? "Drafting..." : "Generate reply"}
      </button>

      {error && (
        <div className="rounded-lg border border-border bg-card p-4 text-sm">
          <p>{error}</p>
          {atLimit && (
            
              href={upgradeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Upgrade to Pro — $12/mo
            </a>
          )}
        </div>
      )}

      {draft && (
        <div className="rounded-lg border border-border bg-card p-4 text-sm whitespace-pre-wrap">
          {draft}
        </div>
      )}
    </div>
  )
}
