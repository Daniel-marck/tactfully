"use client"

import React, { useState, useEffect, useRef } from 'react'
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

const supabase = createClient()

const SITUATIONS = [
  'Chasing a late payment',
  'Pushing back on scope creep',
  'Responding to a lowball offer',
  'Following up on no response',
  'Saying no / declining the ask',
  'A general difficult message',
]

const SITUATION_LABELS: Record<string, string> = {
  'Chasing a late payment': 'Late payment',
  'Pushing back on scope creep': 'Scope creep',
  'Responding to a lowball offer': 'Lowball offer',
  'Following up on no response': 'No response',
  'Saying no / declining the ask': 'Saying no',
  'A general difficult message': 'Something else',
}

const TONES = [
  { label: 'Diplomatic', value: 'Diplomatic and warm, but clear' },
  { label: 'Firm', value: 'Firm and direct, no fluff' },
  { label: 'Formal', value: 'Formal and businesslike' },
]

type SavedDraft = {
  id: string
  original_message: string
  situation: string
  tone: string
  generated_reply: string
  created_at: string
}

const OPTIONS_SEPARATOR = '\n\n---\n\n'
const STRATEGY_LABELS = ['Diplomatic', 'Firm & professional', 'Direct']

const QUICK_START_STEPS = [
  'Paste the client message',
  'Add your desired outcome',
  'Choose the situation and tone',
  'Generate 3 response strategies',
  'Refine, copy and send',
]

function SealIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path
        d="M12 2L14.5 8.5L21 9.5L16 14L17.5 21L12 17.5L6.5 21L8 14L3 9.5L9.5 8.5L12 2Z"
        fill="#F5EFE1"
        opacity="0.9"
      />
    </svg>
  )
}

function Postmark({ label }: { label: string }) {
  return (
    <div
      className="absolute -top-4 -right-3 w-16 h-16 rounded-full flex flex-col items-center justify-center rotate-[8deg] select-none"
      style={{
        border: '1.5px solid rgba(184,114,42,0.55)',
        background: 'rgba(245,239,225,0.9)',
        boxShadow: '0 4px 10px rgba(27,42,58,0.15)',
      }}
    >
      <span
        className="uppercase leading-none"
        style={{ fontFamily: "var(--font-plex-mono), monospace", fontSize: 7, letterSpacing: '0.1em', color: '#B8722A' }}
      >
        Tactfully
      </span>
      <span
        className="leading-none mt-0.5"
        style={{ fontFamily: "var(--font-plex-mono), monospace", fontSize: 9, color: '#1B2A3A' }}
      >
        {label}
      </span>
    </div>
  )
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 9v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="10" cy="6.3" r="1" fill="currentColor" />
    </svg>
  )
}

function InfoPopover({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)



  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <span className="relative inline-flex items-center" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="More information"
        className="inline-flex items-center justify-center rounded-full"
        style={{ color: '#B8722A', opacity: 0.75 }}
      >
        <InfoIcon />
      </button>
      {open && (
        <div
          className="absolute z-20 top-full left-0 mt-2 w-56 rounded-md p-3 text-[12px] leading-relaxed shadow-lg"
          style={{ background: '#1B2A3A', color: '#F5EFE1', fontFamily: "var(--font-work-sans), sans-serif" }}
        >
          {text}
        </div>
      )}
    </span>
  )
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
      <path
        d="M1 10s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
      <path
        d="M2.5 2.5l15 15M8.3 8.4a2.5 2.5 0 0 0 3.4 3.4M5.6 5.7C3.3 7 1 10 1 10s3 6 9 6c1.6 0 3-.4 4.2-1M15 14c1.9-1.3 3-3 3-3s-3-6-9-6c-.7 0-1.4.1-2 .3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function DraftForm() {
  const [incomingMessage, setIncomingMessage] = useState('')
  const [desiredOutcome, setDesiredOutcome] = useState('')
  const [avoid, setAvoid] = useState('')
  const [situation, setSituation] = useState(SITUATIONS[0])
  const [tone, setTone] = useState(TONES[0].value)
  const [draftOptions, setDraftOptions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [limitReached, setLimitReached] = useState(false)
  const [draftsRemaining, setDraftsRemaining] = useState<number | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const [user, setUser] = useState<User | null>(null)
  const [plan, setPlan] = useState<'free' | 'pro'>('free')
  const [draftsList, setDraftsList] = useState<SavedDraft[]>([])
  const [draftSearch, setDraftSearch] = useState('')
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null)
  const [savingDraft, setSavingDraft] = useState(false)
  const [saveNotice, setSaveNotice] = useState<string | null>(null)

  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [showAuthPassword, setShowAuthPassword] = useState(false)
  const [isSignUpMode, setIsSignUpMode] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(false)
  const [authNotice, setAuthNotice] = useState<string | null>(null)

  async function handleUserChange(currentUser: User | null) {
    setUser(currentUser)
    if (currentUser) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', currentUser.id)
        .single()
      setPlan(profile?.plan === 'pro' ? 'pro' : 'free')

      const { data: drafts } = await supabase
        .from('drafts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)
      setDraftsList(drafts || [])
    } else {
      setPlan('free')
      setDraftsList([])
      setDraftsRemaining(null)
      setLimitReached(false)
    }
  }


  useEffect(() => {
    async function initUser() {
      const { data: { session } } = await supabase.auth.getSession()
      handleUserChange(session?.user || null)
    }
    initUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUserChange(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSelectDraft = (draft: SavedDraft) => {
    setSelectedDraftId(draft.id)
    setSaveNotice(null)
    setIncomingMessage(draft.original_message)
    setDesiredOutcome('')
    setAvoid('')
    setSituation(draft.situation)
    setTone(draft.tone)
    setDraftOptions(
      draft.generated_reply.includes(OPTIONS_SEPARATOR)
        ? draft.generated_reply.split(OPTIONS_SEPARATOR)
        : [draft.generated_reply]
    )
    setLimitReached(false)
    setError(null)
  }

  const handleNewDraft = () => {
    setSelectedDraftId(null)
    setSaveNotice(null)
    setIncomingMessage('')
    setDesiredOutcome('')
    setAvoid('')
    setSituation(SITUATIONS[0])
    setTone(TONES[0].value)
    setDraftOptions([])
    setLimitReached(false)
    setError(null)
  }

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)
    setAuthLoading(true)
    try {
      if (isSignUpMode) {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
          },
        })
        if (error) throw error

        if (!data.session) {
          setAuthNotice('Account created. Check your inbox and confirm your email before signing in.')
          return
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword })
        if (error) throw error
      }
      setShowAuthModal(false)
      setAuthEmail('')
      setAuthPassword('')
      setShowAuthPassword(false)
      setAuthNotice(null)
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Authentication failed.')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    handleNewDraft()
  }

  const handleDraftReply = async () => {
    if (!incomingMessage.trim()) {
      setError('Paste the client message first.')
      return
    }
    if (!user) {
      setShowAuthModal(true)
      return
    }

    setLoading(true)
    setError(null)
    setLimitReached(false)
    setDraftOptions([])

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: incomingMessage, tone, situation, desiredOutcome, avoid }),
        signal: AbortSignal.timeout(45000),
      })
      const data = await response.json()

      if (response.status === 403 && data.error === 'limit_reached') {
        setLimitReached(true)
        return
      }
      if (!response.ok) throw new Error(data.error || 'Server returned an error')

      const replies: string[] = Array.isArray(data.replies) && data.replies.length > 0
        ? data.replies
        : [data.reply]

      setDraftOptions(replies)
      setDraftsRemaining(typeof data.draftsRemaining === 'number' ? data.draftsRemaining : null)

      const { data: savedDraft, error: saveError } = await supabase.from('drafts').insert({
        user_id: user.id,
        original_message: incomingMessage,
        situation,
        tone,
        generated_reply: replies.join(OPTIONS_SEPARATOR),
      }).select().single()
      if (saveError) throw new Error("Your replies were generated, but could not be saved to history. Please try saving again.")
      if (savedDraft) setSelectedDraftId(savedDraft.id)
      setSaveNotice(null)

      const { data: updatedDrafts } = await supabase
        .from('drafts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)
      setDraftsList(updatedDrafts || [])
    } catch (err) {
      if (err instanceof DOMException && err.name === 'TimeoutError') {
        setError('The AI service is taking too long to respond. Please try again in a moment.')
      } else if (err instanceof Error && err.message) {
        setError(err.message)
      } else {
        setError('Something went wrong drafting that. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    if (!user || !selectedDraftId || draftOptions.length === 0) return

    setSavingDraft(true)
    setSaveNotice(null)
    setError(null)
    try {
      const { data, error: saveError } = await supabase
        .from('drafts')
        .update({
          original_message: incomingMessage,
          situation,
          tone,
          generated_reply: draftOptions.join(OPTIONS_SEPARATOR),
        })
        .eq('id', selectedDraftId)
        .eq('user_id', user.id)
        .select()
        .single()

      if (saveError || !data) {
        throw new Error("Couldn't save these edits. Please try again.")
      }

      setDraftsList((current) => current.map((draft) => draft.id === data.id ? data : draft))
      setSaveNotice('Changes saved to your draft history.')
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save these edits. Please try again.")
    } finally {
      setSavingDraft(false)
    }
  }

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex((current) => (current === index ? null : current)), 1800)
  }

  const todayStamp = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' })

  return (
    <div
      className="tactfully-workspace min-h-screen w-full"
      style={{ background: '#F5F7FC', color: '#101828' }}
    >
      <style jsx global>{`
        @keyframes stamp {
          from { transform: scale(0) rotate(-25deg); }
          to { transform: scale(1) rotate(8deg); }
        }
        @keyframes rise {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .seal-anim { animation: stamp 0.5s cubic-bezier(.2,1.4,.4,1) forwards; }
        .rise-anim { animation: rise 0.4s ease forwards; }
        .paper-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .paper-scroll::-webkit-scrollbar-thumb { background: rgba(36,48,59,0.25); border-radius: 3px; }
      `}</style>

      <style jsx global>{`
        /* Clean, typography-led workspace */
        .tactfully-workspace, .tactfully-workspace * {
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
          letter-spacing: normal !important;
        }
        .tactfully-workspace { background:#f7f8fc !important; color:#172033 !important; font-size:15px; line-height:1.55; }
        .tactfully-workspace header { background:#fff !important; border-color:#e6eaf0 !important; height:68px; }
        .tactfully-workspace header > span { color:#263b83 !important; font-size:18px !important; font-weight:800 !important; letter-spacing:-.04em !important; }
        .tactfully-workspace header div span { background:#eef2ff !important; color:#34469a !important; border-radius:999px !important; font-size:12px !important; font-weight:700 !important; padding:5px 11px !important; }
        .tactfully-workspace header button { color:#475467 !important; font-size:13px !important; font-weight:600 !important; }
        .tactfully-workspace aside > div:first-child > span { color:#667085 !important; font-size:12px !important; font-weight:700 !important; text-transform:none !important; }
        .tactfully-workspace aside > div:first-child button { color:#34469a !important; font-size:13px !important; font-weight:700 !important; }
        .tactfully-workspace aside button[style] { background:#fff !important; border:1px solid #e6e9f0 !important; border-radius:10px !important; box-shadow:0 1px 2px rgba(16,24,40,.04); }
        .tactfully-workspace aside button span:first-child { color:#475467 !important; font-size:12px !important; font-weight:700 !important; }
        .tactfully-workspace aside button span:nth-child(2) { color:#172033 !important; font-size:13px !important; line-height:1.45 !important; }
        .tactfully-workspace aside button span:last-child { color:#98a2b3 !important; font-size:11px !important; }
        .tactfully-workspace .quick-start-banner { background:#eef2ff !important; border:1px solid #c7d2fe !important; border-radius:12px !important; color:#263b83 !important; padding:13px 16px !important; }
        .tactfully-workspace .quick-start-title { color:#1e2f78 !important; font-size:14px !important; font-weight:800 !important; margin-bottom:9px !important; }
        .tactfully-workspace .quick-start-step { display:inline-flex !important; align-items:center !important; gap:7px !important; color:#263b83 !important; background:#fff !important; border:1px solid #c7d2fe !important; border-radius:999px !important; font-size:12px !important; font-weight:650 !important; padding:5px 10px 5px 6px !important; }
        .tactfully-workspace .quick-start-number { display:inline-flex !important; align-items:center !important; justify-content:center !important; width:21px !important; height:21px !important; flex:0 0 21px !important; border-radius:999px !important; background:#34469a !important; color:#fff !important; font-size:11px !important; font-weight:800 !important; }
        .tactfully-workspace .relative.rounded-md.p-5, .tactfully-workspace .relative.rounded-md.p-6 { background:#fff !important; color:#172033 !important; border:1px solid #e6e9f0 !important; border-radius:16px !important; box-shadow:0 8px 24px rgba(16,24,40,.06) !important; transform:none !important; }
        .tactfully-workspace textarea { color:#172033 !important; font-size:16px !important; line-height:1.65 !important; min-height:180px !important; padding:14px 15px !important; border:1px solid #d0d5dd !important; border-radius:10px !important; background:#fff !important; }        .tactfully-workspace textarea::placeholder { color:#98a2b3 !important; }
        .tactfully-workspace textarea.message-input { min-height:104px !important; height:104px; padding:10px 12px !important; line-height:1.5 !important; }
        @media(min-width:1024px) {
          .tactfully-workspace textarea.message-input { height:104px; }
          .tactfully-workspace .relative.rounded-md.p-5, .tactfully-workspace .relative.rounded-md.p-6 { padding:16px !important; }
        }
        .tactfully-workspace .relative.rounded-md.p-5 > span, .tactfully-workspace .relative.rounded-md.p-6 > span { color:#34469a !important; font-size:13px !important; font-weight:700 !important; }
        .tactfully-workspace button.rounded-full { font-size:13px !important; font-weight:600 !important; padding:8px 13px !important; border-radius:8px !important; border:1px solid #d0d5dd !important; color:#344054 !important; background:#fff !important; cursor:pointer !important; pointer-events:auto !important; position:relative; z-index:2; }
        .tactfully-workspace button.option-chip[aria-pressed="true"] { background:#34469a !important; color:#fff !important; border-color:#34469a !important; box-shadow:0 0 0 2px rgba(52,70,154,.14) !important; }
        .tactfully-workspace button.option-chip[aria-pressed="false"] { background:#fff !important; color:#344054 !important; border-color:#d0d5dd !important; }
        .tactfully-workspace .option-group { position:relative; z-index:1; pointer-events:auto; }
        .tactfully-workspace button.mt-6 { background:#34469a !important; color:#fff !important; border-radius:10px !important; min-height:52px !important; font-size:15px !important; font-weight:700 !important; }
        .tactfully-workspace .rise-anim { background:#fff !important; color:#172033 !important; border:1px solid #e6e9f0 !important; border-radius:14px !important; box-shadow:0 8px 24px rgba(16,24,40,.06) !important; }
        .tactfully-workspace .rise-anim p { color:#344054 !important; font-size:15px !important; line-height:1.7 !important; }
        .tactfully-workspace .rise-anim button { background:#eef2ff !important; color:#34469a !important; border:1px solid #dbe3ff !important; border-radius:8px !important; font-size:13px !important; font-weight:700 !important; padding:9px 13px !important; }
        .tactfully-workspace .fixed.inset-0 > div { background:#fff !important; color:#172033 !important; border-radius:16px !important; }
        .tactfully-workspace .fixed.inset-0 h2 { color:#172033 !important; font-size:24px !important; font-style:normal !important; font-weight:750 !important; letter-spacing:-.03em !important; }
        .tactfully-workspace .fixed.inset-0 input { color:#172033 !important; border-radius:9px !important; min-height:44px !important; }
        .tactfully-workspace .fixed.inset-0 button[type="submit"] { background:#34469a !important; color:#fff !important; border-radius:9px !important; min-height:46px !important; }
        @media(max-width:1023px) { .tactfully-workspace .relative.rounded-md.p-5, .tactfully-workspace .relative.rounded-md.p-6 { transform:none !important; } }
      `}</style>


      <header
        className="h-14 px-5 sm:px-6 flex items-center justify-between shrink-0 border-b"
        style={{ borderColor: 'rgba(245,239,225,0.1)', background: 'rgba(0,0,0,0.15)' }}
      >
        <span
          className="font-bold tracking-widest"
          style={{ fontFamily: "var(--font-plex-mono), monospace", color: '#B8722A', fontSize: 15, letterSpacing: '0.12em' }}
        >
          TACTFULLY
        </span>
        <div className="flex items-center gap-3">
          <span
            className="uppercase px-2 py-1 rounded"
            style={{
              fontFamily: "var(--font-plex-mono), monospace",
              fontSize: 9,
              letterSpacing: '0.1em',
              color: plan === 'pro' ? '#1B2A3A' : '#B8C2CE',
              background: plan === 'pro' ? '#B8722A' : 'rgba(245,239,225,0.08)',
            }}
          >
            {plan === 'pro' ? 'Pro' : 'Free'}
          </span>
          {user ? (
            <button
              onClick={handleSignOut}
              className="text-[13px] hover:underline"
              style={{ color: '#B8C2CE', fontFamily: "var(--font-work-sans), sans-serif" }}
            >
              Sign out
            </button>
          ) : (
            <button
              onClick={() => { setIsSignUpMode(false); setShowAuthModal(true) }}
              className="text-[13px] px-3 py-1.5 rounded-md font-semibold"
              style={{ background: '#B8722A', color: '#fff', fontFamily: "var(--font-work-sans), sans-serif" }}
            >
              Sign in
            </button>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:flex lg:gap-6 lg:items-start">
        <aside className="lg:w-56 lg:shrink-0 mb-5 lg:mb-0">
          <div className="flex items-center justify-between mb-2.5">
            <span
              className="uppercase"
              style={{ fontFamily: "var(--font-plex-mono), monospace", fontSize: 10, letterSpacing: '0.12em', color: '#B8C2CE' }}
            >
              Filed letters
            </span>
            {user && (
              <button
                onClick={handleNewDraft}
                className="text-[11px] font-semibold"
                style={{ color: '#B8722A', fontFamily: "var(--font-work-sans), sans-serif" }}
              >
                + New
              </button>
            )}
          </div>

          {!user ? (
            <div
              className="rounded-md p-4 text-[12px]"
              style={{ background: 'rgba(245,239,225,0.06)', color: '#B8C2CE', fontFamily: "var(--font-work-sans), sans-serif" }}
            >
              Sign in to start drafting. Paste a client message, choose the situation, and Tactfully will suggest replies in seconds.
            </div>
          ) : draftsList.length === 0 ? (
            <div
              className="rounded-md p-4 text-[12px]"
              style={{ background: 'rgba(245,239,225,0.06)', color: '#B8C2CE', fontFamily: "var(--font-work-sans), sans-serif" }}
            >
              Your first draft will appear here. Paste the message, select the scenario, and click “Draft my reply.”
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block">
                <span className="sr-only">Search saved drafts</span>
                <input
                  type="search"
                  value={draftSearch}
                  onChange={(event) => setDraftSearch(event.target.value)}
                  placeholder="Search saved drafts..."
                  aria-label="Search saved drafts"
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                  style={{ borderColor: '#D0D5DD', background: '#fff', color: '#172033' }}
                />
              </label>
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible lg:max-h-[65vh] lg:overflow-y-auto paper-scroll pb-1">
                {draftsList.filter((draft) => {
                  const query = draftSearch.trim().toLowerCase()
                  return !query ||
                    draft.original_message.toLowerCase().includes(query) ||
                    draft.situation.toLowerCase().includes(query) ||
                    (SITUATION_LABELS[draft.situation] || '').toLowerCase().includes(query)
                }).map((draft) => (
                  <button
                    key={draft.id}
                    onClick={() => handleSelectDraft(draft)}
                    className="text-left rounded-md px-3 py-2.5 shrink-0 w-48 lg:w-full transition-colors"
                    style={{ background: '#fff', border: '1px solid #E6E9F0', boxShadow: '0 1px 2px rgba(16,24,40,.04)' }}
                  >
                    <span
                      className="block uppercase mb-0.5"
                      style={{ fontFamily: "var(--font-plex-mono), monospace", fontSize: 9, letterSpacing: '0.08em', color: '#34469A' }}
                    >
                      {SITUATION_LABELS[draft.situation] || draft.situation}
                    </span>
                    <span className="block text-[12px] truncate" style={{ color: '#172033', fontFamily: "var(--font-work-sans), sans-serif" }}>
                      {draft.original_message}
                    </span>
                    <span className="block text-[10px] mt-1" style={{ color: '#667085', fontFamily: "var(--font-plex-mono), monospace" }}>
                      {new Date(draft.created_at).toLocaleDateString()}
                    </span>
                  </button>
                ))}
                {draftSearch.trim() && !draftsList.some((draft) => {
                  const query = draftSearch.trim().toLowerCase()
                  return draft.original_message.toLowerCase().includes(query) ||
                    draft.situation.toLowerCase().includes(query) ||
                    (SITUATION_LABELS[draft.situation] || '').toLowerCase().includes(query)
                }) && (
                  <p className="px-2 py-3 text-xs text-slate-500">No saved drafts match that search.</p>
                )}
              </div>
            </div>
          )}
        </aside>

        <div className="flex-1 lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start">
          <div className="lg:col-span-2 mb-3">
            <div
              className="quick-start-banner rounded-md border px-4 py-3 text-sm"
              style={{
                background: 'rgba(184,114,42,0.08)',
                borderColor: 'rgba(184,114,42,0.35)',
                color: '#F5EFE1',
                fontFamily: "var(--font-work-sans), sans-serif",
              }}
            >
              <div className="quick-start-title mb-2 font-semibold">
                Quick start
              </div>
              <div className="flex flex-wrap gap-2">
                {QUICK_START_STEPS.map((step, index) => (
                  <span
                    key={step}
                    className="quick-start-step rounded-full border px-2.5 py-1 text-[11px]"
                  >
                    <span className="quick-start-number">{index + 1}</span>
                    <span>{step}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div
            className="relative rounded-md p-4 sm:p-5 shadow-2xl w-full lg:sticky lg:top-4"
            style={{ background: '#F5EFE1', color: '#24303B', transform: 'rotate(-0.4deg)' }}
          >
            <div
              className="absolute -top-2.5 left-6 w-11 h-5 -rotate-3"
              style={{ background: 'rgba(184,114,42,0.35)', border: '1px solid rgba(184,114,42,0.5)' }}
            />

            <span className="block mb-3.5 uppercase" style={{ fontFamily: "var(--font-plex-mono), monospace", fontSize: 10, letterSpacing: '0.14em', color: '#B8722A' }}>
              The message
            </span>
            <textarea
              value={incomingMessage}
              onChange={(e) => setIncomingMessage(e.target.value)}
              placeholder={`Paste what the client actually said... e.g. "Hey, can you just knock the price down a bit?"`}
              className="message-input w-full min-h-[104px] sm:min-h-[112px] bg-transparent border-none outline-none resize-y"
              style={{ fontFamily: "var(--font-work-sans), sans-serif", fontSize: 15, lineHeight: 1.55, color: '#24303B' }}            />

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="block mb-1.5 text-xs font-semibold text-slate-600">What outcome do you want?</span>
                <input
                  type="text"
                  value={desiredOutcome}
                  onChange={(e) => setDesiredOutcome(e.target.value)}
                  placeholder="e.g. Get the overdue invoice paid"
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                  style={{ borderColor: '#D0D5DD', background: '#fff', color: '#172033' }}
                />
              </label>
              <label className="block">
                <span className="block mb-1.5 text-xs font-semibold text-slate-600">Anything the reply should avoid?</span>
                <input
                  type="text"
                  value={avoid}
                  onChange={(e) => setAvoid(e.target.value)}
                  placeholder="e.g. Don't offer a discount"
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                  style={{ borderColor: '#D0D5DD', background: '#fff', color: '#172033' }}
                />
              </label>
            </div>

            <div className="mt-3">
              <div className="flex items-center gap-1.5 mb-2.5">
                <span className="uppercase" style={{ fontFamily: "var(--font-plex-mono), monospace", fontSize: 10, letterSpacing: '0.14em', color: '#B8722A' }}>
                  Situation
                </span>
                <InfoPopover text="Situation tells the AI what kind of conversation this is -- a late payment, a lowball offer, and so on -- so it can shape the reply around the right context." />
              </div>
              <div className="option-group flex flex-wrap gap-2">
                {SITUATIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={situation === s}
                    onClick={() => setSituation(s)}
                    className="option-chip rounded-full px-3.5 py-1.5 text-[13px] transition-all"
                    style={situation === s
                      ? { background: '#1B2A3A', color: '#F5EFE1', border: '1px solid #1B2A3A' }
                      : { background: 'transparent', color: '#24303B', border: '1px solid rgba(36,48,59,0.18)' }}
                  >
                    {SITUATION_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center gap-1.5 mb-3.5">
                <span className="uppercase" style={{ fontFamily: "var(--font-plex-mono), monospace", fontSize: 10, letterSpacing: '0.14em', color: '#B8722A' }}>
                  Tone
                </span>
                <InfoPopover text="Tone sets how the reply should sound -- Diplomatic keeps it warm, Firm is direct with no fluff, Formal keeps it strictly businesslike." />
              </div>
              <div className="option-group flex flex-wrap gap-2">
                {TONES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    aria-pressed={tone === t.value}
                    onClick={() => setTone(t.value)}
                    className="option-chip rounded-full px-3.5 py-1.5 text-[13px] transition-all"
                    style={tone === t.value
                      ? { background: '#1B2A3A', color: '#F5EFE1', border: '1px solid #1B2A3A' }
                      : { background: 'transparent', color: '#24303B', border: '1px solid rgba(36,48,59,0.18)' }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleDraftReply}
              disabled={loading}
              className="mt-4 w-full py-[12px] rounded-md font-semibold text-[15px] text-white transition-all active:scale-[0.99] disabled:cursor-not-allowed"
              style={{ background: loading ? '#8a8a8a' : '#B8722A', fontFamily: "var(--font-work-sans), sans-serif" }}
            >
              {loading ? 'Building your 3 response strategies...' : user ? 'Generate 3 response strategies' : 'Sign in to draft a reply'}
            </button>

            {error && (
              <div className="text-center mt-4 text-[13px]" style={{ color: '#6B7A8C', fontFamily: "var(--font-work-sans), sans-serif" }}>
                {error}
              </div>
            )}

            {draftsRemaining !== null && !limitReached && plan !== 'pro' && (
              <div className="text-center mt-3 text-[12px]" style={{ color: '#6B7A8C', fontFamily: "var(--font-work-sans), sans-serif" }}>
                {draftsRemaining} free {draftsRemaining === 1 ? 'draft' : 'drafts'} remaining
              </div>
            )}
          </div>

          {(draftOptions.length > 0 || limitReached) && (
            <div className="mt-5 lg:mt-0 flex flex-col gap-4">
              {limitReached && plan !== 'pro' && (
                <div className="rise-anim relative rounded-md p-6 text-center lg:sticky lg:top-6" style={{ background: '#24303B', color: '#F5EFE1' }}>
                  <div className="mb-2 font-semibold" style={{ fontFamily: "var(--font-newsreader), serif", fontSize: 18 }}>
                    You've used your 3 free drafts
                  </div>
                  <p className="mb-5 text-[14px]" style={{ fontFamily: "var(--font-work-sans), sans-serif", color: '#B8C2CE' }}>
                    Pro subscriptions are not open yet. Your free drafts reset tomorrow.
                  </p>

                  <p className="mx-auto max-w-sm text-[13px] leading-6" style={{ color: '#B8C2CE', fontFamily: "var(--font-work-sans), sans-serif" }}>
                    The planned Pro price is <strong style={{ color: '#F5EFE1' }}>$12 USD per month</strong>. Checkout will open only after recurring billing has been verified.
                  </p>
                </div>
              )}

              {draftOptions.length > 0 && (!limitReached || plan === 'pro') && (
                <div className="flex flex-col gap-4 lg:sticky lg:top-6 lg:max-h-[80vh] lg:overflow-y-auto paper-scroll pr-0.5">
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Your reply options</div>
                      <div className="mt-0.5 text-xs text-slate-500">Edit any draft, save your changes, then copy the version you want to send.</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedDraftId && (
                        <button
                          type="button"
                          onClick={handleSaveDraft}
                          disabled={savingDraft || loading}
                          className="shrink-0 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                        >
                          {savingDraft ? 'Saving...' : 'Save changes'}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleDraftReply}
                        disabled={loading || savingDraft}
                        className="shrink-0 rounded-lg border px-3 py-2 text-xs font-semibold disabled:opacity-50"
                        style={{ borderColor: '#D0D5DD', color: '#34469A', background: '#fff' }}
                      >
                        {loading ? 'Regenerating...' : 'Regenerate'}
                      </button>
                    </div>
                    {saveNotice && <p role="status" className="w-full text-xs text-emerald-700">{saveNotice}</p>}
                  </div>
                  {draftOptions.map((option, index) => (
                    <div
                      key={index}
                      className="rise-anim relative rounded-md p-5 sm:p-6"
                      style={{ background: '#F5EFE1', color: '#24303B' }}
                    >
                      {index === 0 && (
                        <div
                          className="seal-anim absolute -top-4 right-5 w-11 h-11 rounded-full flex items-center justify-center"
                          style={{ background: 'radial-gradient(circle at 32% 30%, #D98A3B, #B8722A 60%, #8a541f 100%)', boxShadow: '0 6px 14px rgba(0,0,0,0.4)' }}
                        >
                          <SealIcon />
                        </div>
                      )}
                      {index === 0 && <Postmark label={todayStamp} />}

                      <div className="flex items-center justify-between mb-3">
                        <span style={{ fontFamily: "var(--font-newsreader), serif", fontStyle: 'italic', fontSize: 15, color: '#B8722A' }}>
                          {STRATEGY_LABELS[index] || `Option ${index + 1}`}
                        </span>
                      </div>
                      <label className="block">
                        <span className="sr-only">Edit {STRATEGY_LABELS[index] || `option ${index + 1}`} reply</span>
                        <textarea
                          value={option}
                          onChange={(event) => setDraftOptions((current) => current.map((value, optionIndex) => optionIndex === index ? event.target.value : value))}
                          aria-label={`Edit ${STRATEGY_LABELS[index] || `option ${index + 1}`} reply`}
                          className="reply-editor w-full resize-y rounded-lg border p-3 outline-none focus:ring-2 focus:ring-indigo-200"
                          style={{ minHeight: 140, borderColor: '#E6E9F0', background: '#fff', color: '#344054', fontFamily: "var(--font-work-sans), sans-serif", fontSize: 15, lineHeight: 1.7 }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => handleCopy(option, index)}
                        className="mt-4 uppercase text-[11px] px-3.5 py-2 rounded"
                        style={{ fontFamily: "var(--font-plex-mono), monospace", letterSpacing: '0.08em', border: '1px solid rgba(36,48,59,0.25)', color: '#24303B', background: '#F5EFE1' }}
                      >
                        {copiedIndex === index ? 'Copied!' : 'Copy reply'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.55)' }}>
          <div
            className="rounded-md shadow-2xl p-6 max-w-sm w-full relative"
            style={{ background: '#F5EFE1', color: '#24303B' }}          >
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 font-bold text-lg"
              style={{ color: '#6B7A8C' }}
            >
              ×
            </button>

            <div className="text-center mb-5">
              <h2 style={{ fontFamily: "var(--font-newsreader), serif", fontStyle: 'italic', fontSize: 20, color: '#1B2A3A' }}>
                {isSignUpMode ? 'Open an account' : 'Welcome back'}
              </h2>
              <p className="text-[12px] mt-1" style={{ color: '#6B7A8C', fontFamily: "var(--font-work-sans), sans-serif" }}>
                {isSignUpMode ? 'Save every letter you draft.' : 'Sign in to pick up where you left off.'}
              </p>
            </div>

            <form onSubmit={handleAuthAction} className="flex flex-col gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: '#6B7A8C', fontFamily: "var(--font-plex-mono), monospace" }}>Email</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-md p-2.5 outline-none text-sm"
                  style={{ border: '1px solid rgba(36,48,59,0.18)', background: '#fff' }}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: '#6B7A8C', fontFamily: "var(--font-plex-mono), monospace" }}>Password</label>
                <div className="relative">
                  <input
                    type={showAuthPassword ? 'text' : 'password'}
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-md p-2.5 pr-10 outline-none text-sm"
                    style={{ border: '1px solid rgba(36,48,59,0.18)', background: '#fff' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowAuthPassword((v) => !v)}
                    aria-label={showAuthPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2"
                    style={{ color: '#6B7A8C' }}
                  >
                    <EyeIcon open={showAuthPassword} />
                  </button>
                </div>
              </div>

              {authError && (
                <div role="alert" className="text-[11px] text-center" style={{ color: '#B8722A' }}>{authError}</div>
              )}
              {authNotice && (
                <div role="status" className="rounded-md border px-3 py-2 text-[11px] text-center" style={{ borderColor: 'rgba(52,70,154,0.2)', background: 'rgba(52,70,154,0.06)', color: '#34469A' }}>
                  {authNotice}
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 rounded-md font-bold text-sm mt-2"
                style={{ background: '#1B2A3A', color: '#F5EFE1' }}
              >
                {authLoading ? 'One moment...' : isSignUpMode ? 'Create account' : 'Sign in'}
              </button>
            </form>

            <div className="text-center mt-5 pt-3 text-[12px]" style={{ borderTop: '1px solid rgba(36,48,59,0.1)', color: '#6B7A8C' }}>
              {isSignUpMode ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => { setIsSignUpMode(!isSignUpMode); setAuthError(null); setAuthNotice(null) }}
                className="font-semibold"
                style={{ color: '#B8722A' }}
              >
                {isSignUpMode ? 'Sign in' : 'Sign up free'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}