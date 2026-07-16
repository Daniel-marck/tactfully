"use client"

import React, { useState } from 'react'

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
      <path
        d="M12 2L14.5 8.5L21 9.5L16 14L17.5 21L12 17.5L6.5 21L8 14L3 9.5L9.5 8.5L12 2Z"
        fill="#F5EFE1"
        opacity="0.9"
      />
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

      if (response.status === 403 && data.error === 'limit_reached') {
        setLimitReached(true)
        if (data.upgradeUrl) setUpgradeUrl(data.upgradeUrl)
        return
      }

      if (!response.ok) throw new Error(data.error || 'Server returned an error')

      setDraftResult(data.reply)
      setDraftsRemaining(typeof data.draftsRemaining === 'number' ? data.draftsRemaining : null)
    } catch (err) {
      setError('Something went wrong drafting that. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-xl">
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

      <div
        className="relative rounded-md p-6 shadow-2xl"
        style={{ background: '#F5EFE1', color: '#24303B', transform: 'rotate(-0.6deg)' }}
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
                style={situation === s
                  ? { background: '#1B2A3A', color: '#F5EFE1', border: '1px solid #1B2A3A' }
                  : { background: 'transparent', color: '#24303B', border: '1px solid rgba(36,48,59,0.18)' }}
              >
                {s === 'Chasing a late payment' ? 'Late payment'
                  : s === 'Pushing back on scope creep' ? 'Scope creep'
                  : s === 'Responding to a lowball offer' ? 'Lowball offer'
                  : s === 'Following up on no response' ? 'No response'
                  : s === 'Saying no / declining the ask' ? 'Saying no'
                  : 'Something else'}
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

        {draftsRemaining !== null && !limitReached && (
          <div className="text-center mt-3 text-[12px]" style={{ color: '#6B7A8C', fontFamily: "var(--font-work-sans), sans-serif" }}>
            {draftsRemaining} free {draftsRemaining === 1 ? 'draft' : 'drafts'} remaining
          </div>
        )}
      </div>

      {limitReached && (
        <div className="rise-anim relative rounded-md p-6 mt-5 text-center" style={{ background: '#1B2A3A', color: '#F5EFE1' }}>
          <div className="mb-2 font-semibold" style={{ fontFamily: "var(--font-newsreader), serif", fontSize: 18 }}>
            You've used your 3 free drafts
          </div>
          <p className="mb-5 text-[14px]" style={{ fontFamily: "var(--font-work-sans), sans-serif", color: '#B8C2CE' }}>
            Upgrade to Pro for unlimited replies, every tone, every situation.
          </p>
          
            href={upgradeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-md font-semibold text-[15px]"
            style={{ background: '#B8722A', color: '#fff', fontFamily: "var(--font-work-sans), sans-serif" }}
          >
            Upgrade to Pro — $12/mo
          </a>
        </div>
      )}

      {draftResult && !limitReached && (
        <div className="rise-anim relative rounded-md p-6 mt-5" style={{ background: '#F5EFE1', color: '#24303B' }}>
          <div
            className="seal-anim absolute -top-4 right-5 w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: 'radial-gradient(circle at 32% 30%, #D98A3B, #B8722A 60%, #8a541f 100%)', boxShadow: '0 6px 14px rgba(0,0,0,0.4)' }}
          >
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
  )
}
