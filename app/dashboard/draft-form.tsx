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

function SealIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M12 2L14.5 8.5L21 9.5L16 14L17.5 21L12 17.5L6.5 21L8 14L3 9.5L9.5 8.5L12 2Z" fill="#F5EFE1" opacity="0.9" />
    </svg>
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
  const [upgradeUrl, setUpgradeUrl] = useState('https://smartoolkit.gumroad.com/l/dzlkij')
  const [draftsRemaining, setDraftsRemaining] = useState<number | null>(null)
  
  // Integrated SaaS States
  const [draftsList, setDraftsList] = useState<any[]>([])
  const [isPro, setIsPro] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Load drafts and user details on mount
  useEffect(() => {
    async function loadUserData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || null)
        
        // 1. Fetch current Pro Status
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_pro')
          .eq('id', user.id)
          .single()
        if (profile?.is_pro) {
          setIsPro(true)
        }

        // 2. Fetch Past Activities List
        const { data: drafts } = await supabase
          .from('drafts')
          .select('*')
          .order('created_at', { ascending: false })
        setDraftsList(drafts || [])
      }
    }
    loadUserData()
  }, [])

  // Action: Single Click to reload an old draft
  const handleSelectDraft = (draft: any) => {
    setIncomingMessage(draft.original_message)
    setSituation(draft.situation)
    setTone(draft.tone)
    setDraftResult(draft.generated_reply)
    setLimitReached(false)
    setError(null)
  }

  // Action: Reset panel to start clean
  const handleNewDraft = () => {
    setIncomingMessage('')
    setSituation(SITUATIONS[0])
    setTone(TONES[0].value)
    setDraftResult('')
    setLimitReached(false)
    setError(null)
  }

  const handleDraftReply = async () => {
    if (!incomingMessage.trim()) {
      setError('Paste the client message first.')
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

      if (response.status === 401) {
        setError('Please sign in to draft a reply.')
        return
      }

      // Bypass paywall block on the UI if they are a database Pro user
      if (response.status === 403 && data.error === 'limit_reached' && !isPro) {
        setLimitReached(true)
        if (data.upgradeUrl) setUpgradeUrl(data.upgradeUrl)
        return
      }

      if (!response.ok) throw new Error(data.error || 'Server returned an error')

      setDraftResult(data.reply)
      setDraftsRemaining(typeof data.draftsRemaining === 'number' ? data.draftsRemaining : null)

      // SAVE DRAFT TO SUPABASE DB
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('drafts').insert({
          user_id: user.id,
          original_message: incomingMessage,
          situation,
          tone,
          generated_reply: data.reply,
        })

        // Instantly reload history in UI
        const { data: updatedDrafts } = await supabase
          .from('drafts')
          .select('*')
          .order('created_at', { ascending: false })
        setDraftsList(updatedDrafts || [])
      }

    } catch (err) {
      setError('Something went wrong drafting that. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-start px-4">
      <style jsx>{`
        @keyframes stamp {
          from { transform: scale(0) rotate(-25deg); }
          to { transform: scale(1) rotate(0deg); }
        }
        @keyframes rise {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .seal-anim { animation: stamp 0.5s cubic-bezier(.2,1.4,.4,1) forwards; }
        .rise-anim { animation: rise 0.5s ease forwards; }
      `}</style>

      {/* SIDEBAR: Past Activities Panel */}
      <div className="w-full lg:w-72 bg-[#1B2A3A] text-[#F5EFE1] rounded-md p-5 flex flex-col gap-4 self-stretch min-h-[400px] lg:min-h-[600px] shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-700 pb-3">
          <span className="uppercase text-[11px]" style={{ fontFamily: "var(--font-plex-mono), monospace", letterSpacing: '0.12em', color: '#B8722A' }}>
            Your Workspace
          </span>
          {isPro ? (
            <span className="text-[10px] bg-[#B8722A] text-white px-2 py-0.5 rounded font-semibold uppercase">
              Pro
            </span>
          ) : (
            <span className="text-[10px] bg-gray-600 text-[#F5EFE1] px-2 py-0.5 rounded font-semibold uppercase">
              Free
            </span>
          )}
        </div>

        {/* Action: Clear Panel to start a fresh reply */}
        <button
          type="button"
          onClick={handleNewDraft}
          className="w-full py-2.5 rounded border border-dashed border-[#B8722A] text-[#F5EFE1] text-[13px] hover:bg-[#B8722A] hover:bg-opacity-10 transition-all font-semibold"
          style={{ fontFamily: "var(--font-work-sans), sans-serif" }}
        >
          + New Draft
        </button>

        {/* Scrollable activity stack */}
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[350px] lg:max-h-[450px] pr-1">
          <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider mb-1">
            Past Activities
          </span>
          
          {draftsList.length === 0 ? (
            <div className="text-[12px] text-gray-400 italic py-4 text-center">
              Your generated history will appear here.
            </div>
          ) : (
            draftsList.map((draft) => (
              <button
                key={draft.id}
                onClick={() => handleSelectDraft(draft)}
                className="w-full text-left p-2.5 rounded hover:bg-[#24303B] transition-all flex flex-col gap-1 border border-transparent hover:border-gray-700 group"
              >
                <span className="text-[13px] font-medium text-[#F5EFE1] truncate group-hover:text-[#B8722A] transition-colors" style={{ fontFamily: "var(--font-work-sans), sans-serif" }}>
                  {draft.situation}
                </span>
                <span className="text-[10px] text-gray-400 truncate">
                  "{draft.original_message}"
                </span>
                <span className="text-[9px] text-gray-500 self-end mt-1">
                  {new Date(draft.created_at).toLocaleDateString()}
                </span>
              </button>
            ))
          )}
        </div>

        {userEmail && (
          <div className="border-t border-gray-700 pt-3 mt-auto text-[11px] text-gray-400 flex items-center justify-between">
            <span className="truncate max-w-[140px]">{userEmail}</span>
            <span className="text-[9px] uppercase tracking-widest text-[#B8722A]">Tactfully</span>
          </div>
        )}
      </div>

      {/* WORKSPACE: Form and Output Side-by-side */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 w-full items-start">
        
        {/* Left Column: Input Form */}
        <div className="w-full md:flex-1">
          <div className="relative rounded-md p-6 shadow-2xl" style={{ background: '#F5EFE1', color: '#24303B', transform: 'rotate(-0.6deg)' }}>
            <div className="absolute -top-2.5 left-6 w-11 h-5 -rotate-3" style={{ background: 'rgba(184,114,42,0.35)', border: '1px solid rgba(184,114,42,0.5)' }} />
            
            <span className="block mb-3.5 uppercase" style={{ fontFamily: "var(--font-plex-mono), monospace", fontSize: 10, letterSpacing: '0.14em', color: '#B8722A' }}>
              The message
            </span>
            
            <textarea
              value={incomingMessage}
              onChange={(e) => setIncomingMessage(e.target.value)}
              placeholder={`Paste what the client actually said... e.g. "Hey, can you just knock the price down a bit?"`}
              className="w-full min-h-[150px] bg-transparent border-none outline-none resize-y"
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
                    style={situation === s ? { background: '#1B2A3A', color: '#F5EFE1', border: '1px solid #1B2A3A' } : { background: 'transparent', color: '#24303B', border: '1px solid rgba(36,48,59,0.18)' }}
                  >
                    {s === 'Chasing a late payment' ? 'Late payment' : s === 'Pushing back on scope creep' ? 'Scope creep' : s === 'Responding to a lowball offer' ? 'Lowball offer' : s === 'Following up on no response' ? 'No response' : s === 'Saying no / declining the ask' ? 'Saying no' : 'Something else'}
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
                    style={tone === t.value ? { background: '#1B2A3A', color: '#F5EFE1', border: '1px solid #1B2A3A' } : { background: 'transparent', color: '#24303B', border: '1px solid rgba(36,48,59,0.18)' }}
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
              onMouseEnter={(e) => { if (!loading) (e.target as HTMLElement).style.background = '#D98A3B' }}
              onMouseLeave={(e) => { if (!loading) (e.target as HTMLElement).style.background = '#B8722A' }}
            >
              {loading ? 'Drafting...' : 'Draft my reply'}
            </button>

            {error && (
              <div className="text-center mt-4 text-[13px]" style={{ color: '#6B7A8C', fontFamily: "var(--font-work-sans), sans-serif" }}>
                {error}
              </div>
            )}

            {draftsRemaining !== null && !limitReached && !isPro && (
              <div className="text-center mt-3 text-[12px]" style={{ color: '#6B7A8C', fontFamily: "var(--font-work-sans), sans-serif" }}>
                {draftsRemaining} free {draftsRemaining === 1 ? 'draft' : 'drafts'} remaining
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Result / Paywall Toggle */}
        <div className="w-full md:flex-1">
          {limitReached && !isPro && (
            <div className="rise-anim relative rounded-md p-6 text-center" style={{ background: '#1B2A3A', color: '#F5EFE1' }}>
              <div className="mb-2 font-semibold" style={{ fontFamily: "var(--font-newsreader), serif", fontSize: 18 }}>
                You've used your 3 free drafts
              </div>
              <p className="mb-5 text-[14px]" style={{ fontFamily: "var(--font-work-sans), sans-serif", color: '#B8C2CE' }}>
                Upgrade to Pro for unlimited replies, every tone, every situation.
              </p>
              
              <div className="w-full max-w-xs mx-auto mt-2">
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
                        
                        // Action: Set Pro in database table profile
                        const { data: { user } } = await supabase.auth.getUser()
                        if (user) {
                          await supabase
                            .from('profiles')
                            .update({ is_pro: true })
                            .eq('id', user.id)
                          setIsPro(true)
                          setLimitReached(false)
                        }
                        
                        alert(`Thank you ${details.payer?.name?.given_name}! Your Pro upgrade was successful.`);
                      }
                    }}
                    onError={(err) => {
                      console.error("PayPal Error: ", err);
                      alert("Something went wrong with the payment window.");
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            </div>
          )}

          {draftResult && (!limitReached || isPro) && (
            <div className="rise-anim relative rounded-md p-6 shadow-2xl" style={{ background: '#F5EFE1', color: '#24303B' }}>
              <div className="seal-anim absolute -top-4 right-5 w-11 h-11 rounded-full flex items-center justify-center" style={{ background: 'radial-gradient(circle at 32% 30%, #D98A3B, #B8722A 60%, #8a541f 100%)', boxShadow: '0 6px 14px rgba(0,0,0,0.4)' }}>
                <SealIcon />
              </div>
              <div className="mb-3" style={{ fontFamily: "var(--font-newsreader), serif", fontStyle: 'italic', fontSize: 15, color: '#B8722A' }}>
                Your reply
              </div>
              <p className="whitespace-pre-wrap" style={{ fontFamily: "var(--font-work-sans), sans-serif", fontSize: 15, lineHeight: 1.6 }}>
                {draftResult}
              </p>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(draftResult)}
                className="mt-4 uppercase text-[11px] px-3.5 py-2 rounded"
                style={{ fontFamily: "var(--font-plex-mono), monospace", letterSpacing: '0.08em', border: '1px solid rgba(36,48,59,0.25)', color: '#24303B' }}
              >
                Copy reply
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
