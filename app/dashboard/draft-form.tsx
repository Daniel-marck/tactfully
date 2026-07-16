"use client"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import React, { useState, useEffect } from 'react';
import { createClient } from "@supabase/supabase-js";

// Instantiate public Supabase client using env keys
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const SITUATIONS = [
  'Chasing a late payment',
  'Pushing back on scope creep',
  'Responding to a lowball offer',
  'Following up on no response',
  'Saying no / declining the ask',
  'A general difficult message',
]

const TONES = [
  { label: 'Diplomatic', value: 'Diplomatic and warm, but clear' },
  { label: 'Firm', value: 'Firm and direct, no fluff' },
  { label: 'Formal', value: 'Formal and businesslike' },
]

export function DraftForm() {
  // Input fields
  const [incomingMessage, setIncomingMessage] = useState('')
  const [situation, setSituation] = useState(SITUATIONS[0])
  const [tone, setTone] = useState(TONES[0].value)
  const [draftResult, setDraftResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [limitReached, setLimitReached] = useState(false)
  const [draftsRemaining, setDraftsRemaining] = useState<number | null>(null)

  // Auth & SaaS States
  const [user, setUser] = useState<any | null>(null)
  const [isPro, setIsPro] = useState(false)
  const [draftsList, setDraftsList] = useState<any[]>([])
  
  // Auth Modal (Popup) Trigger
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [isSignUpMode, setIsSignUpMode] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(false)

  // Track active navigation tab (just like MatDash sidebar clicks)
  const [activeTab, setActiveTab] = useState('dashboard')

  // Listen to Auth changes on mount
  useEffect(() => {
    async function initUser() {
      const { data: { session } } = await supabase.auth.getSession()
      handleUserChange(session?.user || null)
    }
    initUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUserChange(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleUserChange = async (currentUser: any) => {
    setUser(currentUser)
    if (currentUser) {
      // 1. Fetch current Pro status
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_pro')
        .eq('id', currentUser.id)
        .single()
      if (profile?.is_pro) {
        setIsPro(true)
      } else {
        setIsPro(false)
      }

      // 2. Fetch past activities
      const { data: drafts } = await supabase
        .from('drafts')
        .select('*')
        .order('created_at', { ascending: false })
      setDraftsList(drafts || [])
    } else {
      setIsPro(false)
      setDraftsList([])
      setDraftsRemaining(null)
      setLimitReached(false)
    }
  }

  // Action: Single Click to reload an old draft
  const handleSelectDraft = (draft: any) => {
    setIncomingMessage(draft.original_message)
    setSituation(draft.situation)
    setTone(draft.tone)
    setDraftResult(draft.generated_reply)
    setLimitReached(false)
    setError(null)
  }

  // Action: Clear Panel to start a fresh reply
  const handleNewDraft = () => {
    setIncomingMessage('')
    setSituation(SITUATIONS[0])
    setTone(TONES[0].value)
    setDraftResult('')
    setLimitReached(false)
    setError(null)
  }

  // Action: Authenticate inside page popup
  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)
    setAuthLoading(true)

    try {
      if (isSignUpMode) {
        const { error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
        })
        if (error) throw error
        alert('Verification email sent! Please check your inbox.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        })
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

    // 🚫 Gated Guest Protection: If they aren't signed in, trigger Auth Popup
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

      // Bypass paywall block on the UI if they are a database Pro user
      if (response.status === 403 && data.error === 'limit_reached' && !isPro) {
        setLimitReached(true)
        return
      }

      if (!response.ok) throw new Error(data.error || 'Server returned an error')

      setDraftResult(data.reply)
      setDraftsRemaining(typeof data.draftsRemaining === 'number' ? data.draftsRemaining : null)

      // Save to Supabase Cloud Draft Vault
      await supabase.from('drafts').insert({
        user_id: user.id,
        original_message: incomingMessage,
        situation,
        tone,
        generated_reply: data.reply,
      })

      // Auto-reload history inside the MatDash list
      const { data: updatedDrafts } = await supabase
        .from('drafts')
        .select('*')
        .order('created_at', { ascending: false })
      setDraftsList(updatedDrafts || [])

    } catch (err) {
      setError('Something went wrong drafting that. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex bg-[#F1F5F9] min-h-screen text-[#24303B] antialiased">
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .anim-fade { animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* 1. LEFT SIDEBAR (Match MatDash Navigation Side-Panel) */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#1B2A3A] text-[#F5EFE1] p-6 shrink-0 shadow-xl border-r border-gray-800">
        <div className="flex items-center gap-2 mb-8">
          <span className="text-xl font-bold tracking-widest text-[#B8722A]" style={{ fontFamily: "var(--font-plex-mono), monospace" }}>
            TACTFULLY
          </span>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left px-4 py-3 rounded-md transition-all text-[14px] font-medium flex items-center gap-3 ${activeTab === 'dashboard' ? 'bg-[#B8722A] text-white font-semibold' : 'hover:bg-[#24303B]'}`}
          >
            <span>🏠</span> Workspace Sandbox
          </button>
          
          <button
            onClick={() => {
              if (!user) { setShowAuthModal(true); return; }
              setActiveTab('history');
            }}
            className={`w-full text-left px-4 py-3 rounded-md transition-all text-[14px] font-medium flex items-center gap-3 ${activeTab === 'history' ? 'bg-[#B8722A] text-white font-semibold' : 'hover:bg-[#24303B]'}`}
          >
            <span>📜</span> Saved Activity Log
          </button>
        </nav>

        <div className="border-t border-gray-700 pt-4 mt-auto text-[11px] text-gray-400">
          <span className="uppercase text-[9px] tracking-widest text-[#B8722A] font-semibold block mb-1">Status</span>
          {user ? (
            <div className="flex flex-col gap-0.5">
              <span className="truncate max-w-[190px] font-medium">{user.email}</span>
              <span className="text-[10px] text-emerald-400 font-semibold">{isPro ? "★ PRO ACCESS UNLOCKED" : "● Free Member"}</span>
            </div>
          ) : (
            <span>Guest Sandbox Access</span>
          )}
        </div>
      </aside>

      {/* MAIN MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* 2. TOP HEADER (Search & Profile Actions) */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-[14px] text-gray-400 italic">Playground Sandbox Mode</span>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-[13px] text-gray-600 hidden md:block">Hello, <strong className="text-gray-800">{user.email.split('@')[0]}</strong></span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-1.5 rounded border border-gray-300 hover:border-[#1B2A3A] transition-all text-[13px] font-medium hover:bg-gray-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setIsSignUpMode(false); setShowAuthModal(true); }}
                className="px-5 py-2 rounded-md bg-[#1B2A3A] text-white hover:bg-[#B8722A] transition-all text-[13px] font-semibold"
              >
                Sign In / Sign Up
              </button>
            )}
          </div>
        </header>

        {/* WORKSPACE AREA */}
        <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 max-w-6xl w-full mx-auto">
          
          {/* 3. MATDASH HERO PROFILE BANNER CARD */}
          <div className="relative rounded-xl overflow-hidden bg-white shadow-md border border-gray-200 flex flex-col">
            {/* Visual Cover Abstract Purple/Gold wave background */}
            <div className="h-32 md:h-40 bg-gradient-to-r from-[#1B2A3A] via-[#2F4458] to-[#B8722A] relative">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400 via-pink-500 to-indigo-900" />
            </div>

            {/* Profile Bar */}
            <div className="px-6 pb-6 pt-16 relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Overlapping Rounded User Avatar */}
              <div className="absolute -top-12 left-6 w-24 h-24 rounded-full border-4 border-white bg-gradient-to-tr from-[#B8722A] to-amber-200 shadow-md flex items-center justify-center text-3xl font-bold text-[#1B2A3A]">
                {user ? user.email[0].toUpperCase() : "G"}
              </div>

              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  {user ? user.email.split('@')[0] : "Guest Workspace"}
                  {isPro && <span className="text-[10px] uppercase bg-gradient-to-r from-[#B8722A] to-amber-400 text-white font-bold px-2 py-0.5 rounded shadow">Pro ★</span>}
                </h1>
                <p className="text-sm text-gray-500">{user ? user.email : "Sign in to save activities & lift search restrictions"}</p>
              </div>

              {/* Status Pill Indicator */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase block">Account Plan</span>
                  <span className="text-[14px] font-bold text-[#1B2A3A]">
                    {!user ? "Guest Trial" : isPro ? "Tactfully Pro Member" : "Free Plan (3 Drafts)"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. TWO-COLUMN GRID LAYOUT (Left Activities / Right Input Forms) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* LEFT COLUMN: MatDash-Style Activity Log */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-md lg:col-span-1 flex flex-col gap-4 self-stretch min-h-[300px]">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="uppercase text-[11px] font-bold tracking-wider text-gray-400">
                  Recent Activities
                </span>
                <span className="text-[11px] bg-gray-100 text-[#1B2A3A] px-2 py-0.5 rounded font-bold">
                  {draftsList.length} items
                </span>
              </div>

              {user && (
                <button
                  onClick={handleNewDraft}
                  className="w-full py-2 border border-dashed border-[#B8722A] text-[#B8722A] text-[13px] rounded hover:bg-[#B8722A] hover:bg-opacity-5 font-semibold transition-all"
                >
                  + Create New Fresh Draft
                </button>
              )}

              <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[350px]">
                {!user ? (
                  /* Blurred Locked Guest Mode representation */
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-2">
                    <span className="text-2xl">🔒</span>
                    <span className="text-[13px] font-bold text-gray-700">Activities Locked</span>
                    <p className="text-[11px] text-gray-400">Sign in to automatically save and recall your drafted client responses.</p>
                    <button
                      onClick={() => { setIsSignUpMode(false); setShowAuthModal(true); }}
                      className="mt-3 text-[12px] text-white bg-[#B8722A] px-4 py-1.5 rounded hover:bg-[#1B2A3A] transition-all font-semibold"
                    >
                      Authenticate Account
                    </button>
                  </div>
                ) : draftsList.length === 0 ? (
                  <div className="text-[12px] text-gray-400 italic py-8 text-center">
                    No past activities yet. Draft a reply to start saving.
                  </div>
                ) : (
                  draftsList.map((draft) => (
                    <button
                      key={draft.id}
                      onClick={() => handleSelectDraft(draft)}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 flex flex-col gap-1 group"
                    >
                      <span className="text-[13px] font-bold text-[#1B2A3A] truncate group-hover:text-[#B8722A] transition-colors">
                        {draft.situation}
                      </span>
                      <span className="text-[11px] text-gray-500 truncate">
                        "{draft.original_message}"
                      </span>
                      <span className="text-[9px] text-gray-400 mt-1 self-end">
                        {new Date(draft.created_at).toLocaleDateString()}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: The Interactive Workspace Sandbox */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* Form Input Container */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md relative">
                <span className="block mb-3 uppercase text-[10px] tracking-widest text-[#B8722A] font-bold">
                  Messy Client Message
                </span>

                <textarea
                  value={incomingMessage}
                  onChange={(e) => setIncomingMessage(e.target.value)}
                  placeholder={`What did they actually say? e.g. "Hey can you finish this entire extra section by tonight without charging?"`}
                  className="w-full min-h-[140px] border border-gray-200 rounded-lg p-4 outline-none focus:border-[#B8722A] resize-y text-[14px]"
                  style={{ fontFamily: "var(--font-work-sans), sans-serif", lineHeight: 1.6 }}
                />

                {/* Situation pills */}
                <div className="mt-5">
                  <span className="block mb-2 uppercase text-[10px] tracking-widest text-[#B8722A] font-bold">
                    Select Situation context
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SITUATIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSituation(s)}
                        className="rounded-full px-3 py-1.5 text-[12px] transition-all border font-medium"
                        style={situation === s ? { background: '#1B2A3A', color: '#F5EFE1', borderColor: '#1B2A3A' } : { background: 'transparent', color: '#54667A', borderColor: '#E2E8F0' }}
                      >
                        {s === 'Chasing a late payment' ? 'Late payment' : s === 'Pushing back on scope creep' ? 'Scope creep' : s === 'Responding to a lowball offer' ? 'Lowball offer' : s === 'Following up on no response' ? 'No response' : s === 'Saying no / declining the ask' ? 'Saying no' : 'Something else'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tone select */}
                <div className="mt-5">
                  <span className="block mb-2 uppercase text-[10px] tracking-widest text-[#B8722A] font-bold">
                    Choose Tone direction
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {TONES.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setTone(t.value)}
                        className="rounded-full px-3 py-1.5 text-[12px] transition-all border font-medium"
                        style={tone === t.value ? { background: '#1B2A3A', color: '#F5EFE1', borderColor: '#1B2A3A' } : { background: 'transparent', color: '#54667A', borderColor: '#E2E8F0' }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action button */}
                <button
                  type="button"
                  onClick={handleDraftReply}
                  disabled={loading}
                  className="mt-6 w-full py-3.5 rounded-lg font-bold text-[14px] text-white transition-all active:scale-[0.99] disabled:cursor-not-allowed"
                  style={{ background: loading ? '#8a8a8a' : '#1B2A3A' }}
                  onMouseEnter={(e) => { if (!loading) (e.target as HTMLElement).style.background = '#B8722A' }}
                  onMouseLeave={(e) => { if (!loading) (e.target as HTMLElement).style.background = '#1B2A3A' }}
                >
                  {loading ? 'Processing draft generation...' : user ? 'Draft my reply' : 'Sign in to generate reply'}
                </button>

                {error && (
                  <div className="text-center mt-3 text-[12px] text-rose-500 font-medium">
                    {error}
                  </div>
                )}

                {draftsRemaining !== null && !limitReached && !isPro && (
                  <div className="text-center mt-3 text-[12px] text-gray-500">
                    {draftsRemaining} free drafts remaining
                  </div>
                )}
              </div>

              {/* Sandbox Paywall Lock Box */}
              {limitReached && !isPro && (
                <div className="bg-[#1B2A3A] text-[#F5EFE1] rounded-xl p-6 shadow-md border border-gray-800 text-center anim-fade">
                  <span className="text-2xl">⚡</span>
                  <h3 className="font-bold text-[16px] mt-2 text-white">Free Sandbox Limit Reached</h3>
                  <p className="text-[13px] text-gray-400 mt-1 max-w-sm mx-auto">
                    You have successfully run through your free dashboard sandbox trials. Unlock Tactfully Pro to clear limit blockades.
                  </p>

                  <div className="w-full max-w-xs mx-auto mt-5">
                    <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "", currency: "USD" }} >
                      <PayPalButtons
                        style={{ layout: "vertical", color: "gold", shape: "rect", tagLine: false }}
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            intent: "CAPTURE",
                            purchase_units: [{
                              amount: {
                                currency_code: "USD",
                                value: "12.00",
                              },
                            }],
                          });
                        }}
                        onApprove={async (data, actions) => {
                          if (actions.order) {
                            const details = await actions.order.capture();
                            
                            // Elevate user in Supabase profiles
                            await supabase
                              .from('profiles')
                              .update({ is_pro: true })
                              .eq('id', user.id)
                            
                            setIsPro(true)
                            setLimitReached(false)
                            alert(`Thank you ${details.payer?.name?.given_name}! Your dashboard profile is officially elevated to Pro.`);
                          }
                        }}
                        onError={(err) => {
                          console.error("PayPal Error: ", err);
                          alert("A sandbox payment interface issue occurred.");
                        }}
                      />
                    </PayPalScriptProvider>
                  </div>
                </div>
              )}

              {/* Output Result card */}
              {draftResult && (!limitReached || isPro) && (
                <div className="bg-[#F5EFE1] rounded-xl p-6 border border-gray-200 shadow-md relative anim-fade text-[#24303B]">
                  <div className="absolute -top-3 right-6 w-8 h-8 rounded-full flex items-center justify-center bg-[#B8722A] text-white shadow font-bold text-xs">
                    ★
                  </div>
                  <span className="block mb-2 uppercase text-[10px] tracking-widest text-[#B8722A] font-bold">
                    AI Output Result
                  </span>
                  <p className="whitespace-pre-wrap text-[15px] leading-relaxed font-medium">
                    {draftResult}
                  </p>
                  
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(draftResult)
                      alert("Draft response copied to clipboard!")
                    }}
                    className="mt-4 text-[11px] font-bold uppercase tracking-wider px-4 py-2 border border-gray-300 rounded hover:border-gray-500 transition-all hover:bg-gray-50"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              )}

            </div>
          </div>

        </main>
      </div>

      {/* 5. GATED AUTH MODAL POPUP (MatDash Style Modal overlay) */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-[#1B2A3A] bg-opacity-65 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full relative anim-fade border border-gray-100 text-[#24303B]">
            
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg"
            >
              ×
            </button>

            <div className="text-center mb-5">
              <span className="text-2xl">✨</span>
              <h2 className="text-lg font-bold mt-2 text-[#1B2A3A]">
                {isSignUpMode ? 'Create your SaaS Account' : 'Sign In to Tactfully'}
              </h2>
              <p className="text-[12px] text-gray-500 mt-1">
                {isSignUpMode ? 'Register to save history and unlock your sandbox' : 'Log in to sync drafts to your personal vault'}
              </p>
            </div>

            <form onSubmit={handleAuthAction} className="flex flex-col gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full border border-gray-200 rounded-md p-2.5 outline-none focus:border-[#B8722A] text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-md p-2.5 outline-none focus:border-[#B8722A] text-sm"
                />
              </div>

              {authError && (
                <div className="text-[11px] text-rose-500 font-medium text-center">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 rounded-md bg-[#1B2A3A] text-white hover:bg-[#B8722A] font-bold text-sm transition-all mt-2"
              >
                {authLoading ? 'Authorizing...' : isSignUpMode ? 'Register Account' : 'Sign In'}
              </button>
            </form>

            <div className="text-center mt-5 pt-3 border-t border-gray-100 text-[12px] text-gray-500">
              {isSignUpMode ? 'Already registered?' : "Don't have an account yet?"}{' '}
              <button
                onClick={() => { setIsSignUpMode(!isSignUpMode); setAuthError(null); }}
                className="text-[#B8722A] font-semibold hover:underline"
              >
                {isSignUpMode ? 'Sign In' : 'Sign Up Free'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
