"use client"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import React, { useState, useEffect } from 'react';
import { createClient } from "@supabase/supabase-js";
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  
  // Input fields
  const [incomingMessage, setIncomingMessage] = useState('')
  const [situation, setSituation] = useState(SITUATIONS[0])
  const [tone, setTone] = useState(TONES[0].value)
  const [draftResult, setDraftResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [limitReached, setLimitReached] = useState(false)
  const [draftsRemaining, setDraftsRemaining] = useState<number | null>(null)

  // Auth & SaaS States (Using real database 'plan' column structure)
  const [user, setUser] = useState<any | null>(null)
  const [isPro, setIsPro] = useState(false)
  const [draftsList, setDraftsList] = useState<any[]>([])

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
      // Fetching your REAL database 'plan' column
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', currentUser.id)
        .single()
      
      if (profile?.plan === 'pro') {
        setIsPro(true)
      } else {
        setIsPro(false)
      }

      // Fetch past activities from the newly created drafts table
      const { data: drafts } = await supabase
        .from('drafts')
        .select('*')
        .order('created_at', { ascending: false })
      setDraftsList(drafts || [])
    } else {
      setIsPro(false)
      setDraftsList([])
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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    handleNewDraft()
  }

  const handleDraftReply = async () => {
    if (!incomingMessage.trim()) {
      setError('Paste the client message first.')
      return
    }

    // Redirect to your real dedicated sign-in page if not authenticated
    if (!user) {
      router.push('/sign-in');
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

      if (response.status === 403 && data.error === 'limit_reached' && !isPro) {
        setLimitReached(true)
        return
      }

      if (!response.ok) throw new Error(data.error || 'Server returned an error')

      setDraftResult(data.reply)
      setDraftsRemaining(typeof data.draftsRemaining === 'number' ? data.draftsRemaining : null)

      // Save to your clean secure drafts table
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
      setDraftsList(updatedDrafts || [])

    } catch (err) {
      setError('Something went wrong drafting that. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex bg-[#F1F5F9] min-h-screen text-[#24303B] antialiased">
      {/* LEFT SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#1B2A3A] text-[#F5EFE1] p-6 shrink-0 shadow-xl border-r border-gray-800">
        <div className="flex items-center gap-2 mb-8">
          <span className="text-xl font-bold tracking-widest text-[#B8722A]" style={{ fontFamily: "var(--font-plex-mono), monospace" }}>
            TACTFULLY
          </span>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          <div className="w-full text-left px-4 py-3 rounded-md bg-[#B8722A] text-white font-semibold flex items-center gap-3">
            <span>🏠</span> Workspace Sandbox
          </div>
        </nav>

        <div className="border-t border-gray-700 pt-4 mt-auto text-[11px] text-gray-400">
          <span className="uppercase text-[9px] tracking-widest text-[#B8722A] font-semibold block mb-1">Status</span>
          {user ? (
            <div className="flex flex-col gap-0.5">
              <span className="truncate max-w-[190px] font-medium">{user.email}</span>
              <span className="text-[10px] text-emerald-400 font-semibold">{isPro ? "★ PRO ACCESS" : "● Free Member"}</span>
            </div>
          ) : (
            <span>Guest Sandbox Access</span>
          )}
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm shrink-0">
          <span className="text-[14px] text-gray-400 italic">Playground Sandbox Mode</span>
          <div>
            {user ? (
              <button onClick={handleSignOut} className="px-4 py-1.5 rounded border border-gray-300 text-[13px] font-medium hover:bg-gray-50">
                Sign Out
              </button>
            ) : (
              <button onClick={() => router.push('/sign-in')} className="px-5 py-2 rounded-md bg-[#1B2A3A] text-white text-[13px] font-semibold">
                Sign In
              </button>
            )}
          </div>
        </header>

        {/* WORKSPACE AREA */}
        <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 max-w-6xl w-full mx-auto">
          {/* BANNER CARD */}
          <div className="relative rounded-xl overflow-hidden bg-white shadow-md border border-gray-200 flex flex-col">
            <div className="h-32 bg-gradient-to-r from-[#1B2A3A] via-[#2F4458] to-[#B8722A]" />
            <div className="px-6 pb-6 pt-12 relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="absolute -top-10 left-6 w-20 h-20 rounded-full border-4 border-white bg-gradient-to-tr from-[#B8722A] to-amber-200 shadow-md flex items-center justify-center text-2xl font-bold text-[#1B2A3A]">
                {user ? user.email[0].toUpperCase() : "G"}
              </div>
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  {user ? user.email.split('@')[0] : "Guest Workspace"}
                  {isPro && <span className="text-[10px] bg-gradient-to-r from-[#B8722A] to-amber-400 text-white font-bold px-2 py-0.5 rounded shadow">Pro ★</span>}
                </h1>
                <p className="text-sm text-gray-500">{user ? user.email : "Sign in to save activities & lift restrictions"}</p>
              </div>
            </div>
          </div>

          {/* TWO-COLUMN WORKSPACE */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* LEFT COLUMN: History */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-md lg:col-span-1 flex flex-col gap-4 min-h-[300px]">
              <span className="uppercase text-[11px] font-bold tracking-wider text-gray-400 border-b border-gray-100 pb-2">
                Recent Activities
              </span>
              {user && (
                <button onClick={handleNewDraft} className="w-full py-2 border border-dashed border-[#B8722A] text-[#B8722A] text-[13px] rounded font-semibold hover:bg-opacity-5">
                  + New Fresh Draft
                </button>
              )}
              <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[350px]">
                {!user ? (
                  <div className="text-center p-6 text-gray-400 text-[12px]">
                    🔒 Sign in to save and recall past drafts automatically.
                  </div>
                ) : draftsList.length === 0 ? (
                  <div className="text-[12px] text-gray-400 italic text-center py-4">No activities yet.</div>
                ) : (
                  draftsList.map((draft) => (
                    <button key={draft.id} onClick={() => handleSelectDraft(draft)} className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 flex flex-col gap-1 group">
                      <span className="text-[13px] font-bold text-[#1B2A3A] truncate group-hover:text-[#B8722A]">{draft.situation}</span>
                      <span className="text-[11px] text-gray-500 truncate">"{draft.original_message}"</span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Playground Form */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
                <span className="block mb-2 text-[10px] tracking-widest text-[#B8722A] font-bold uppercase">Messy Client Message</span>
                <textarea
                  value={incomingMessage}
                  onChange={(e) => setIncomingMessage(e.target.value)}
                  placeholder="What did the client say?"
                  className="w-full min-h-[120px] border border-gray-200 rounded-lg p-4 outline-none focus:border-[#B8722A] text-[14px]"
                />

                <div className="mt-4">
                  <span className="block mb-2 text-[10px] tracking-widest text-[#B8722A] font-bold uppercase">Situation context</span>
                  <div className="flex flex-wrap gap-1.5">
                    {SITUATIONS.map((s) => (
                      <button key={s} type="button" onClick={() => setSituation(s)} className="rounded-full px-3 py-1 text-[12px] border transition-all" style={situation === s ? { background: '#1B2A3A', color: '#F5EFE1', borderColor: '#1B2A3A' } : { background: 'transparent', color: '#54667A', borderColor: '#E2E8F0' }}>
                        {s.split(' ')[0]} {s.split(' ')[1] || ''}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <span className="block mb-2 text-[10px] tracking-widest text-[#B8722A] font-bold uppercase">Tone direction</span>
                  <div className="flex flex-wrap gap-1.5">
                    {TONES.map((t) => (
                      <button key={t.value} type="button" onClick={() => setTone(t.value)} className="rounded-full px-3 py-1 text-[12px] border transition-all" style={tone === t.value ? { background: '#1B2A3A', color: '#F5EFE1', borderColor: '#1B2A3A' } : { background: 'transparent', color: '#54667A', borderColor: '#E2E8F0' }}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="button" onClick={handleDraftReply} disabled={loading} className="mt-6 w-full py-3 rounded-lg font-bold text-[14px] text-white transition-all" style={{ background: '#1B2A3A' }}>
                  {loading ? 'Processing...' : user ? 'Draft my reply' : 'Sign in to generate'}
                </button>

                {error && <div className="text-center mt-3 text-[12px] text-rose-500 font-medium">{error}</div>}
              </div>

              {/* PAYWALL */}
              {limitReached && !isPro && (
                <div className="bg-[#1B2A3A] text-[#F5EFE1] rounded-xl p-6 text-center border border-gray-800">
                  <h3 className="font-bold text-[16px] text-white">Free Sandbox Limit Reached</h3>
                  <p className="text-[13px] text-gray-400 mt-1 max-w-sm mx-auto">Upgrade your account profile to Pro to clear limit blockades.</p>
                  <div className="w-full max-w-xs mx-auto mt-4">
                    <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "", currency: "USD" }} >
                      <PayPalButtons
                        style={{ layout: "vertical", color: "gold", shape: "rect", tagLine: false }}
                        createOrder={(data, actions) => actions.order.create({ intent: "CAPTURE", purchase_units: [{ amount: { currency_code: "USD", value: "12.00" } }] })}
                        onApprove={async (data, actions) => {
                          if (actions.order) {
                            await actions.order.capture();
                            // Update matching your real table 'plan' structure
                            await supabase.from('profiles').update({ plan: 'pro' }).eq('id', user.id);
                            setIsPro(true);
                            setLimitReached(false);
                            alert("Your account plan has been updated to Pro!");
                          }
                        }}
                      />
                    </PayPalScriptProvider>
                  </div>
                </div>
              )}

              {/* OUTPUT RESULT */}
              {draftResult && (!limitReached || isPro) && (
                <div className="bg-[#F5EFE1] rounded-xl p-6 border border-gray-200 shadow-md text-[#24303B]">
                  <span className="block mb-2 text-[10px] tracking-widest text-[#B8722A] font-bold uppercase">AI Output Result</span>
                  <p className="whitespace-pre-wrap text-[15px] leading-relaxed font-medium">{draftResult}</p>
                  <button type="button" onClick={() => { navigator.clipboard.writeText(draftResult); alert("Copied!"); }} className="mt-4 text-[11px] font-bold uppercase tracking-wider px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                    Copy to Clipboard
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
