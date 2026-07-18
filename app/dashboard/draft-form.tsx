"use client"

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import React, { useState, useEffect } from 'react'
import { createClient } from "@/lib/supabase/client"

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

export function DraftForm() {
  const [incomingMessage, setIncomingMessage] = useState('')
  const [situation, setSituation] = useState(SITUATIONS[0])
  const [tone, setTone] = useState(TONES[0].value)
  const [draftResult, setDraftResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [limitReached, setLimitReached] = useState(false)
  const [draftsRemaining, setDraftsRemaining] = useState<number | null>(null)
  const [paypalError, setPaypalError] = useState<string | null>(null)

  const [user, setUser] = useState<any | null>(null)
  const [plan, setPlan] = useState<'free' | 'pro'>('free')
  const [draftsList, setDraftsList] = useState<any[]>([])

  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [isSignUpMode, setIsSignUpMode] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(false)

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

  const handleUserChange = async (currentUser: any) => {
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

  const handleSelectDraft = (draft: any) => {
    setIncomingMessage(draft.original_message)
    setSituation(draft.situation)
    setTone(draft.tone)
    setDraftResult(draft.generated_reply)
    setLimitReached(false)
    setError(null)
  }

  const handleNewDraft = () => {
    setIncomingMessage('')
    setSituation(SITUATIONS[0])
    setTone(TONES[0].value)
    setDraftResult('')
    setLimitReached(false)
    setError(null)
  }

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)
    setAuthLoading(true)
    try {
      if (isSignUpMode) {
        const { error } = await supabase.auth.signUp({ email: authEmail, password: authPassword })
        if (error) throw error
        alert('Check your inbox to verify your email.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword })
        if (error) throw error
      }
      setShowAuthModal(false)
      setAuthEmail('')
      setAuthPassword('')
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed.')
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
    setDraftResult('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: incomingMessage, tone, situation }),
      })
      const data = await response.json()

      if (response.status === 403 && data.error === 'limit_reached') {
        setLimitReached(true)
        return
      }
      if (!response.ok) throw new Error(data.error || 'Server returned an error')

      setDraftResult(data.reply)
      setDraftsRemaining(typeof data.draftsRemaining === 'number' ? data.draftsRemaining : null)

      await supabase.from('drafts').insert({
        user_id: user.id,
        original_message: incomingMessage,
        situation,
        tone,
        generated_reply: data.reply,
      })

      const { data: updatedDrafts } = await supabase
        .from('drafts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)
      setDraftsList(updatedDrafts || [])
    } catch (err) {
      setError('Something went wrong drafting that. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const todayStamp = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' })

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: '#1B2A3A', color: '#F5EFE1' }}
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
              Sign in to keep a record of every reply you draft.
            </div>
          ) : draftsList.length === 0 ? (
            <div
              className="rounded-md p-4 text-[12px] italic"
              style={{ background: 'rgba(245,239,225,0.06)', color: '#8291A3', fontFamily: "var(--font-work-sans), sans-serif" }}
            >
              Nothing filed yet -- your first draft will land here.
            </div>
          ) : (
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible lg:max-h-[70vh] lg:overflow-y-auto paper-scroll pb-1">
              {draftsList.map((draft) => (
                <button
                  key={draft.id}
                  onClick={() => handleSelectDraft(draft)}
                  className="text-left rounded-md px-3 py-2.5 shrink-0 w-48 lg:w-full transition-colors"
                  style={{ background: 'rgba(245,239,225,0.06)' }}
                >
                  <span
                    className="block uppercase mb-0.5"
                    style={{ fontFamily: "var(--font-plex-mono), monospace", fontSize: 9, letterSpacing: '0.08em', color: '#B8722A' }}
                  >
                    {SITUATION_LABELS[draft.situation] || draft.situation}
                  </span>
                  <span className="block text-[12px] truncate" style={{ color: '#F5EFE1', fontFamily: "var(--font-work-sans), sans-serif" }}>
                    {draft.original_message}
                  </span>
                  <span className="block text-[10px] mt-1" style={{ color: '#6B7A8C', fontFamily: "var(--font-plex-mono), monospace" }}>
                    {new Date(draft.created_at).toLocaleDateString()}
                  </span>
                </button>
              ))}
            </div>
          )}
        </aside>

        <div className="flex-1 lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start">
          <div
            className="relative rounded-md p-5 sm:p-6 shadow-2xl w-full max-h-[70vh] lg:max-h-[80vh] overflow-y-auto paper-scroll lg:sticky lg:top-6"
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
              className="w-full min-h-[120px] sm:min-h-[150px] bg-transparent border-none outline-none resize-y"
              style={{ fontFamily: "var(--font-work-sans), sans-serif", fontSize: 15, lineHeight: 1.55, color: '#24303B' }}
            />

            <div className="mt-5">
              <span className="block mb-3.5 uppercase" style={{ fontFamily: "var(--font-plex-mono), monospace", fontSize: 10, letterSpacing: '0.14em', color: '#B8722A' }}>
                Situation
              </span>
              <div className="flex flex-wrap gap-2">
                {SITUATIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSituation(s)}
                    className="rounded-full px-3.5 py-1.5 text-[13px] transition-all"
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
              <span className="block mb-3.5 uppercase" style={{ fontFamily: "var(--font-plex-mono), monospace", fontSize: 10, letterSpacing: '0.14em', color: '#B8722A' }}>
                Tone
              </span>
              <div className="flex flex-wrap gap-2">
                {TONES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTone(t.value)}
                    className="rounded-full px-3.5 py-1.5 text-[13px] transition-all"
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
              className="mt-6 w-full py-[15px] rounded-md font-semibold text-[15px] text-white transition-all active:scale-[0.99] disabled:cursor-not-allowed"
              style={{ background: loading ? '#8a8a8a' : '#B8722A', fontFamily: "var(--font-work-sans), sans-serif" }}
            >
              {loading ? 'Drafting...' : user ? 'Draft my reply' : 'Sign in to draft a reply'}
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

          {(draftResult || limitReached) && (
            <div className="mt-5 lg:mt-0">
              {limitReached && plan !== 'pro' && (
                <div className="rise-anim relative rounded-md p-6 text-center lg:sticky lg:top-6" style={{ background: '#24303B', color: '#F5EFE1' }}>
                  <div className="mb-2 font-semibold" style={{ fontFamily: "var(--font-newsreader), serif", fontSize: 18 }}>
                    You've used your 3 free drafts
                  </div>
                  <p className="mb-5 text-[14px]" style={{ fontFamily: "var(--font-work-sans), sans-serif", color: '#B8C2CE' }}>
                    Upgrade to Pro for unlimited replies, every tone, every situation.
                  </p>

                  {paypalError && (
                    <p className="mb-3 text-[12px]" style={{ color: '#E08A6B' }}>{paypalError}</p>
                  )}

                  <div className="w-full max-w-xs mx-auto">
                    <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "", currency: "USD" }}>
                      <PayPalButtons
                        style={{ layout: "vertical", color: "gold", shape: "rect", tagline: false }}
                        createOrder={async () => {
                          setPaypalError(null)
                          const res = await fetch('/api/paypal/create-order', { method: 'POST' })
                          const data = await res.json()
                          if (!res.ok) {
                            setPaypalError(data.error || 'Could not start checkout.')
                            throw new Error(data.error)
                          }
                          return data.id
                        }}
                        onApprove={async (data) => {
                          const res = await fetch('/api/paypal/capture-order', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ orderID: data.orderID }),
                          })
                          const result = await res.json()
                          if (!res.ok) {
                            setPaypalError(result.error || 'Payment could not be verified.')
                            return
                          }
                          setPlan('pro')
                          setLimitReached(false)
                        }}
                        onError={(err) => {
                          console.error('PayPal error:', err)
                          setPaypalError('Something went wrong with checkout. Try again.')
                        }}
                      />
                    </PayPalScriptProvider>
                  </div>
                </div>
              )}

              {draftResult && (!limitReached || plan === 'pro') && (
                <div
                  className="rise-anim relative rounded-md p-5 sm:p-6 max-h-[70vh] lg:max-h-[80vh] overflow-y-auto paper-scroll lg:sticky lg:top-6"
                  style={{ background: '#F5EFE1', color: '#24303B' }}
                >
                  <div
                    className="seal-anim absolute -top-4 right-5 w-11 h-11 rounded-full flex items-center justify-center"
                    style={{ background: 'radial-gradient(circle at 32% 30%, #D98A3B, #B8722A 60%, #8a541f 100%)', boxShadow: '0 6px 14px rgba(0,0,0,0.4)' }}
                  >
                    <SealIcon />
                  </div>
                  <Postmark label={todayStamp} />
                  <div className="mb-3" style={{ fontFamily: "var(--font-newsreader), serif", fontStyle: 'italic', fontSize: 15, color: '#B8722A' }}>
                    Your reply
                  </div>
                  <p className="whitespace-pre-wrap" style={{ fontFamily: "var(--font-work-sans), sans-serif", fontSize: 15, lineHeight: 1.6 }}>
                    {draftResult}
                  </p>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(draftResult)}
                    className="sticky bottom-0 mt-4 uppercase text-[11px] px-3.5 py-2 rounded"
                    style={{ fontFamily: "var(--font-plex-mono), monospace", letterSpacing: '0.08em', border: '1px solid rgba(36,48,59,0.25)', color: '#24303B', background: '#F5EFE1' }}
                  >
                    Copy reply
                  </button>
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
            style={{ background: '#F5EFE1', color: '#24303B' }}
          >
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
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md p-2.5 outline-none text-sm"
                  style={{ border: '1px solid rgba(36,48,59,0.18)', background: '#fff' }}
                />
              </div>

              {authError && (
                <div className="text-[11px] text-center" style={{ color: '#B8722A' }}>{authError}</div>
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
                onClick={() => { setIsSignUpMode(!isSignUpMode); setAuthError(null) }}
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
