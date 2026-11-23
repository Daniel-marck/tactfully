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
  desired_outcome: string
  avoid: string
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
        aria-expanded={open}
        title={text}
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
  const [deletingDraftId, setDeletingDraftId] = useState<string | null>(null)
  const [saveNotice, setSaveNotice] = useState<string | null>(null)
  const [showQuickStart, setShowQuickStart] = useState(true)
  const [messageExpanded, setMessageExpanded] = useState(false)
  const messageInputRef = useRef<HTMLTextAreaElement>(null)
  const userLoadSequence = useRef(0)

  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [showAuthPassword, setShowAuthPassword] = useState(false)
  const [isSignUpMode, setIsSignUpMode] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(false)
  const [authNotice, setAuthNotice] = useState<string | null>(null)

  async function handleUserChange(currentUser: User | null) {
    const requestId = ++userLoadSequence.current
    setUser(currentUser)
    if (currentUser) {
      const [profileResult, draftsResult] = await Promise.all([
        supabase.from('profiles').select('plan').eq('id', currentUser.id).single(),
        supabase.from('drafts').select('*').order('created_at', { ascending: false }).limit(20),
      ])
      if (requestId !== userLoadSequence.current) return
      setPlan(profileResult.data?.plan === 'pro' ? 'pro' : 'free')
      setDraftsList(draftsResult.data || [])
    } else {
      setPlan('free')
      setDraftsList([])
      setDraftsRemaining(null)
      setLimitReached(false)
    }
  }


  useEffect(() => {
    const textarea = messageInputRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    const maxHeight = 420
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden'
  }, [incomingMessage])

  useEffect(() => {
    if (!messageExpanded) return
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMessageExpanded(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [messageExpanded])

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
    setDesiredOutcome(draft.desired_outcome || '')
    setAvoid(draft.avoid || '')
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
        desired_outcome: desiredOutcome,
        avoid,
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
          desired_outcome: desiredOutcome,
          avoid,
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

  const handleDeleteDraft = async (draft: SavedDraft) => {
    if (!user || !window.confirm('Delete this saved draft? This cannot be undone.')) return
    setDeletingDraftId(draft.id)
    setError(null)
    try {
      const { error: deleteError } = await supabase
        .from('drafts')
        .delete()
        .eq('id', draft.id)
        .eq('user_id', user.id)
      if (deleteError) throw deleteError
      setDraftsList((current) => current.filter((item) => item.id !== draft.id))
      if (selectedDraftId === draft.id) handleNewDraft()
    } catch {
      setError('Could not delete that saved draft. Please try again.')
    } finally {
      setDeletingDraftId(null)
    }
  }

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setError(null)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex((current) => (current === index ? null : current)), 1800)
    } catch {
      setError('Clipboard access was blocked. Select the reply text and copy it manually.')
    }
  }

  const todayStamp = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' })

  return (
    <div
      className="tactfully-workspace min-h-screen w-full"
      style={{ background: '#F4F0E7', color: '#302F29' }}
    >
      <style jsx global>{`
        @keyframes stamp {
          from { transform: scale(0) rotate(-25deg); }
          to { transform: scale(1) rotate(8deg); }
        }
        @keyframes rise {
          from { opacity: 0; transform: transtoneY(8px); }
          to { opacity: 1; transform: transtoneY(0); }
        }
        .seal-anim { animation: stamp 0.5s cubic-bezier(.2,1.4,.4,1) forwards; }
        .rise-anim { animation: rise 0.4s ease forwards; }
        .paper-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .paper-scroll::-webkit-scrollbar-thumb { background: rgba(36,48,59,0.25); border-radius: 3px; }
      `}</style>

      <style jsx global>{`
        .tactfully-workspace, .tactfully-workspace * { font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif !important; letter-spacing:normal !important; }
        .tactfully-workspace { background:#F4F0E7 !important; color:#302F29 !important; font-size:15px; line-height:1.55; }
        .tactfully-workspace header { background:#FFFCF5 !important; border-color:#E5DDCE !important; box-shadow:0 1px 3px rgba(48,47,41,.05); }
        .tactfully-workspace header > span { color:#244A3A !important; font-size:18px !important; font-weight:800 !important; }
        .tactfully-workspace header div span { background:#E8EFE8 !important; color:#244A3A !important; border-radius:999px !important; font-size:12px !important; font-weight:700 !important; }
        .tactfully-workspace header button { color:#315D47 !important; font-size:13px !important; font-weight:650 !important; }
        .tactfully-workspace aside { background:#FFFCF5 !important; border:1px solid #E5DDCE !important; border-radius:14px !important; padding:14px !important; box-shadow:0 5px 18px rgba(48,47,41,.04) !important; }
        .tactfully-workspace aside > div:first-child > span { color:#77756D !important; font-size:11px !important; font-weight:750 !important; }
        .tactfully-workspace aside > div:first-child button { color:#315D47 !important; font-size:13px !important; font-weight:750 !important; }
        .tactfully-workspace aside button[style] { background:#FFFCF5 !important; border:1px solid #E5DDCE !important; border-radius:10px !important; }
        .tactfully-workspace aside button[aria-current="true"] { background:#E8EFE8 !important; border-color:#9BB5A1 !important; box-shadow:0 0 0 2px rgba(49,93,71,.12) !important; }
        .tactfully-workspace aside button span:first-child { color:#315D47 !important; }
        .tactfully-workspace aside button span:nth-child(2) { color:#302F29 !important; }
        .tactfully-workspace aside button span:last-child { color:#918A7D !important; }
        .tactfully-workspace .quick-start-banner { background:#E8EFE8 !important; border:1px solid #C8D8CB !important; border-radius:12px !important; color:#244A3A !important; }
        .tactfully-workspace .quick-start-title { color:#244A3A !important; font-size:14px !important; font-weight:800 !important; }
        .tactfully-workspace .quick-start-banner p { color:#496552 !important; }
        .tactfully-workspace .relative.rounded-md.p-5, .tactfully-workspace .relative.rounded-md.p-6, .tactfully-workspace .rise-anim, .tactfully-workspace .rounded-2xl.border { background:#FFFCF5 !important; color:#302F29 !important; border-color:#E5DDCE !important; box-shadow:0 6px 22px rgba(48,47,41,.06) !important; }
        .tactfully-workspace .relative.rounded-md.p-5 > span, .tactfully-workspace .relative.rounded-md.p-6 > span { color:#315D47 !important; font-size:13px !important; font-weight:750 !important; }
        .tactfully-workspace textarea, .tactfully-workspace input { background:#FFFEFA !important; color:#302F29 !important; border-color:#D9D0C1 !important; }
        .tactfully-workspace textarea { font-size:15px !important; line-height:1.65 !important; }
        .tactfully-workspace textarea::placeholder, .tactfully-workspace input::placeholder { color:#918A7D !important; }
        .tactfully-workspace textarea.message-input { min-height:220px !important; max-height:420px; height:auto; overflow-y:hidden; padding:14px 15px !important; line-height:1.6 !important; resize:vertical; }
        .tactfully-workspace .message-expand-button { border:1px solid #D8D2C6 !important; background:#FFFCF5 !important; color:#315D47 !important; border-radius:8px !important; padding:6px 10px !important; font-size:12px !important; font-weight:750 !important; }
        .tactfully-workspace .message-expand-button:hover { background:#E8EFE8 !important; }
        .tactfully-workspace button.rounded-full { font-size:13px !important; font-weight:650 !important; padding:8px 13px !important; border-radius:8px !important; border:1px solid #D9D0C1 !important; color:#514D43 !important; background:#FFFCF5 !important; cursor:pointer !important; }
        .tactfully-workspace button.option-chip[aria-pressed="true"] { background:#315D47 !important; color:#FFFFFF !important; border-color:#315D47 !important; box-shadow:0 0 0 2px rgba(49,93,71,.14) !important; }
        .tactfully-workspace button.option-chip[aria-pressed="false"] { background:#FFFCF5 !important; color:#514D43 !important; border-color:#D9D0C1 !important; }
        .tactfully-workspace button.mt-4.w-full { background:#244A3A !important; color:#FFFFFF !important; border:1px solid #244A3A !important; border-radius:10px !important; min-height:52px !important; font-size:15px !important; font-weight:800 !important; box-shadow:0 5px 12px rgba(36,74,58,.2) !important; }
        .tactfully-workspace button.mt-4.w-full:hover:not(:disabled) { background:#193A2C !important; }
        .tactfully-workspace button.mt-4.w-full:disabled { background:#A9B5A9 !important; border-color:#A9B5A9 !important; color:#FFFFFF !important; box-shadow:none !important; }
        .tactfully-workspace .rise-anim p { color:#403D34 !important; font-size:15px !important; line-height:1.7 !important; }
        .tactfully-workspace .rise-anim button, .tactfully-workspace .bg-forest-600 { background:#E8EFE8 !important; border:1px solid #C8D8CB !important; color:#244A3A !important; border-radius:8px !important; font-size:13px !important; font-weight:750 !important; padding:9px 13px !important; }
        .tactfully-workspace .bg-forest-100 { background:#E8EFE8 !important; }
        .tactfully-workspace .text-forest-700, .tactfully-workspace .text-forest-800 { color:#315D47 !important; }
        .tactfully-workspace .text-stone-900 { color:#302F29 !important; }
        .tactfully-workspace .text-stone-500, .tactfully-workspace .text-stone-600 { color:#77756D !important; }
        .tactfully-workspace .border-stone-200 { border-color:#E5DDCE !important; }
        .tactfully-workspace .fixed.inset-0 > div, .tactfully-workspace .fixed.inset-0 > section { background:#FFFCF5 !important; color:#302F29 !important; border-radius:16px !important; }
        .tactfully-workspace .fixed.inset-0 h2 { color:#244A3A !important; font-size:24px !important; font-style:normal !important; font-weight:750 !important; }
        .tactfully-workspace .fixed.inset-0 button[type="submit"] { background:#244A3A !important; color:#FFFFFF !important; border-radius:9px !important; min-height:46px !important; }
        .tactfully-workspace [style*="#1B2A3A"] { color:#244A3A !important; }
        .tactfully-workspace [style*="#F5EFE1"] { background-color:#FFFCF5 !important; color:#302F29 !important; }
        .tactfully-workspace button[style*="#B8722A"] { background:#244A3A !important; color:#FFFFFF !important; border-color:#244A3A !important; }
        .tactfully-workspace [style*="#B8722A"] { color:#A85F43 !important; }
        .tactfully-workspace .paper-scroll::-webkit-scrollbar { width:6px; height:6px; }
        .tactfully-workspace .paper-scroll::-webkit-scrollbar-thumb { background:rgba(49,93,71,.25); border-radius:3px; }
        @media(min-width:1024px) { .tactfully-workspace textarea.message-input { min-height:240px !important; } .tactfully-workspace .relative.rounded-md.p-5, .tactfully-workspace .relative.rounded-md.p-6 { padding:16px !important; } }
        @media(max-width:1023px) { .tactfully-workspace aside { padding:12px !important; } .tactfully-workspace .relative.rounded-md.p-5, .tactfully-workspace .relative.rounded-md.p-6 { transform:none !important; } }
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

      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[230px_minmax(0,1fr)_minmax(380px,1.05fr)] lg:items-start">
        <aside className="min-w-0 mb-5 lg:mb-0">
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
                  className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-forest-200"
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
                  <div key={draft.id} className="relative shrink-0 w-48 lg:w-full">
                    <button
                      type="button"
                      onClick={() => handleSelectDraft(draft)}
                      className="w-full text-left rounded-md px-3 py-2.5 pr-9 transition-colors"
                      aria-current={selectedDraftId === draft.id ? "true" : undefined}
                      style={{ background: selectedDraftId === draft.id ? "#E8EFE8" : "#FFFCF5", border: selectedDraftId === draft.id ? "1px solid #9BB5A1" : "1px solid #E5DDCE", boxShadow: selectedDraftId === draft.id ? "0 0 0 2px rgba(49,93,71,.10)" : "0 1px 2px rgba(48,47,41,.04)" }}
                    >
                      <span className="block uppercase mb-0.5" style={{ fontFamily: "var(--font-plex-mono), monospace", fontSize: 9, letterSpacing: '0.08em', color: '#315D47' }}>
                        {SITUATION_LABELS[draft.situation] || draft.situation}
                      </span>
                      <span className="block text-[12px] truncate" style={{ color: '#302F29', fontFamily: "var(--font-work-sans), sans-serif" }}>
                        {draft.original_message}
                      </span>
                      <span className="block text-[10px] mt-1" style={{ color: '#77756D', fontFamily: "var(--font-plex-mono), monospace" }}>
                        {new Date(draft.created_at).toLocaleDateString()}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDeleteDraft(draft)}
                      disabled={deletingDraftId === draft.id}
                      aria-label={`Delete saved draft from ${new Date(draft.created_at).toLocaleDateString()}`}
                      title="Delete saved draft"
                      className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-md text-sm font-semibold opacity-70 hover:opacity-100 disabled:opacity-40"
                      style={{ color: '#A85F43', background: '#FFF8F3' }}
                    >
                      {deletingDraftId === draft.id ? '…' : '×'}
                    </button>
                  </div>
                ))}
                {draftSearch.trim() && !draftsList.some((draft) => {
                  const query = draftSearch.trim().toLowerCase()
                  return draft.original_message.toLowerCase().includes(query) ||
                    draft.situation.toLowerCase().includes(query) ||
                    (SITUATION_LABELS[draft.situation] || '').toLowerCase().includes(query)
                }) && (
                  <p className="px-2 py-3 text-xs text-stone-500">No saved drafts match that search.</p>
                )}
              </div>
            </div>
          )}
        </aside>

        <div className="min-w-0 grid grid-cols-1 gap-4 lg:col-start-2 lg:grid-cols-2 lg:gap-5 xl:col-span-2 xl:col-start-2 xl:grid-cols-2 xl:gap-5">
          {showQuickStart ? (
          <div className="lg:col-span-2 mb-1">
            <div
              className="quick-start-banner rounded-md border px-4 py-2.5 text-sm"
              style={{
                background: 'rgba(184,114,42,0.08)',
                borderColor: 'rgba(184,114,42,0.35)',
                color: '#F5EFE1',
                fontFamily: "var(--font-work-sans), sans-serif",
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="quick-start-title mb-0 font-semibold">Quick start</div>
                <button type="button" onClick={() => setShowQuickStart(false)} aria-label="Dismiss quick start" className="rounded-md px-2 py-1 text-xs font-semibold text-forest-700 hover:bg-forest-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest-600">Hide</button>
              </div>
              <p className="mt-1 text-xs text-forest-800">Paste the client message, set the context, then generate three reply strategies.</p>
            </div>
          </div>
          ) : (
            <div className="lg:col-span-2 flex justify-end">
              <button type="button" onClick={() => setShowQuickStart(true)} className="rounded-lg border border-forest-200 bg-white px-3 py-1.5 text-xs font-semibold text-forest-700 hover:bg-forest-50">Show quick start</button>
            </div>
          )}

          <div
            className="relative rounded-md p-4 sm:p-5 shadow-2xl w-full lg:sticky lg:top-4"
            style={{ background: '#F5EFE1', color: '#24303B', transform: 'rotate(-0.4deg)' }}
          >
            <div
              className="absolute -top-2.5 left-6 w-11 h-5 -rotate-3"
              style={{ background: 'rgba(184,114,42,0.35)', border: '1px solid rgba(184,114,42,0.5)' }}
            />

            <div className="mb-2.5 flex items-center justify-between gap-3">
              <span className="block uppercase" style={{ fontFamily: "var(--font-plex-mono), monospace", fontSize: 10, letterSpacing: '0.14em', color: '#B8722A' }}>
                The message
              </span>
              <button type="button" className="message-expand-button" onClick={() => setMessageExpanded(true)} aria-haspopup="dialog" aria-label="Expand client message editor">
                Expand editor
              </button>
            </div>
            <textarea
              ref={messageInputRef}
              value={incomingMessage}
              onChange={(e) => setIncomingMessage(e.target.value)}
              placeholder={`Paste what the client actually said... e.g. "Hey, can you just knock the price down a bit?"`}
              className="message-input w-full bg-transparent border-none outline-none"
              aria-label="The message from the client"
              style={{ fontFamily: "var(--font-work-sans), sans-serif", fontSize: 15, lineHeight: 1.6, color: '#24303B' }}
            />

            <div className="mt-3 grid grid-cols-1 gap-3">
              <label className="block">
                <span className="block mb-1.5 text-xs font-semibold text-stone-600">What outcome do you want?</span>
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
                <span className="block mb-1.5 text-xs font-semibold text-stone-600">Anything the reply should avoid?</span>
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
              disabled={loading || !incomingMessage.trim()}
              aria-disabled={loading || !incomingMessage.trim()}
              className="mt-4 w-full py-[12px] rounded-md font-semibold text-[15px] text-white transition-all active:scale-[0.99] disabled:cursor-not-allowed"
              style={{ background: loading || !incomingMessage.trim() ? '#98A2B3' : '#B8722A', opacity: !incomingMessage.trim() && !loading ? 0.8 : 1, fontFamily: "var(--font-work-sans), sans-serif" }}
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

          <div className="min-w-0 mt-5 lg:mt-0 flex flex-col gap-4">
            {draftOptions.length === 0 && !limitReached && (
              <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-6 xl:sticky xl:top-5">
                <div className="text-sm font-semibold text-stone-900">Your response strategies will appear here</div>
                <p className="mt-2 text-sm leading-6 text-stone-500">Add the client’s message and context, then generate three distinct replies. You can edit and copy your preferred version here.</p>
                <div className="mt-5 grid grid-cols-3 gap-2" aria-hidden="true">
                  <div className="h-2 rounded-full bg-forest-100" />
                  <div className="h-2 rounded-full bg-stone-100" />
                  <div className="h-2 rounded-full bg-stone-100" />
                </div>
              </div>
            )}
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
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3">
                    <div>
                      <div className="text-sm font-semibold text-stone-900">Your reply options</div>
                      <div className="mt-0.5 text-xs text-stone-500">Edit any draft, save your changes, then copy the version you want to send.</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedDraftId && (
                        <button
                          type="button"
                          onClick={handleSaveDraft}
                          disabled={savingDraft || loading}
                          className="shrink-0 rounded-lg bg-forest-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
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
                          className="reply-editor w-full resize-y rounded-lg border p-3 outline-none focus:ring-2 focus:ring-forest-200"
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
        </div>
      </div>

      {messageExpanded && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6"
          style={{ background: 'rgba(28,35,30,0.68)' }}
          onMouseDown={(event) => { if (event.target === event.currentTarget) setMessageExpanded(false) }}
        >
          <section role="dialog" aria-modal="true" aria-labelledby="expanded-message-title" className="flex h-[92vh] w-full max-w-5xl flex-col rounded-2xl p-4 sm:p-6 shadow-2xl" style={{ background: '#FFFCF5', color: '#302F29' }}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 id="expanded-message-title" className="text-lg font-semibold" style={{ color: '#244A3A' }}>Review client message</h2>
                <p className="mt-1 text-xs" style={{ color: '#77756D' }}>Edit the message here. Your dashboard form and generated replies will be preserved.</p>
              </div>
              <button type="button" onClick={() => setMessageExpanded(false)} className="rounded-lg border px-3 py-2 text-sm font-semibold" style={{ borderColor: '#D8D2C6', color: '#315D47' }} aria-label="Close expanded message editor">Done</button>
            </div>
            <textarea
              autoFocus
              value={incomingMessage}
              onChange={(e) => setIncomingMessage(e.target.value)}
              aria-label="Expanded client message editor"
              placeholder="Paste or edit the full client message..."
              className="min-h-0 flex-1 resize-none rounded-xl border p-4 text-sm leading-7 outline-none focus:ring-2"
              style={{ borderColor: '#D8D2C6', background: '#fff', color: '#302F29', fontFamily: "var(--font-work-sans), sans-serif" }}
            />
            <div className="mt-3 flex justify-end">
              <button type="button" onClick={() => setMessageExpanded(false)} className="rounded-lg px-5 py-2.5 text-sm font-bold text-white" style={{ background: '#244A3A' }}>Done editing</button>
            </div>
          </section>
        </div>
      )}

      {showAuthModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.55)' }}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-dialog-title"
            className="rounded-md shadow-2xl p-6 max-w-sm w-full relative"
            style={{ background: '#F5EFE1', color: '#24303B' }}
          >
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              aria-label="Close sign-in dialog"
              className="absolute top-4 right-4 font-bold text-lg"
              style={{ color: '#6B7A8C' }}
            >
              ×
            </button>

            <div className="text-center mb-5">
              <h2 id="auth-dialog-title" style={{ fontFamily: "var(--font-newsreader), serif", fontStyle: 'italic', fontSize: 20, color: '#1B2A3A' }}>
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
                    className="absolute right-2.5 top-1/2 -transtone-y-1/2"
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