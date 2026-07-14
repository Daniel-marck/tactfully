"use client"

import React, { useState } from 'react'
import { MessageSquare } from 'lucide-react'

export function DraftForm() {
  const [incomingMessage, setIncomingMessage] = useState('what is your name?')
  const [selectedTone, setSelectedTone] = useState('Formal')
  const [draftResult, setDraftResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleDraftReply = async () => {
    setLoading(true)
    setError(null)
    try {
      // Points to root API to avoid 404
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: incomingMessage, tone: selectedTone }),
      })

      if (!response.ok) throw new Error('Server returned an error')
      const data = await response.json()
      setDraftResult(data.reply)
    } catch (err) {
      setError('Something went wrong drafting that. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-xl bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-2xl flex flex-col gap-5 backdrop-blur-sm">
      
      {/* Workspace Header */}
      <div className="border-b border-slate-800/60 pb-3">
        <h1 className="text-lg font-semibold text-slate-100">Reply Generator</h1>
        <p className="text-xs text-slate-400 mt-0.5">Draft polished professional messages instantly.</p>
      </div>

      {/* Incoming Message Input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Incoming Message
        </label>
        <textarea
          value={incomingMessage}
          onChange={(e) => setIncomingMessage(e.target.value)}
          className="w-full h-24 bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none font-normal leading-relaxed"
          placeholder="Paste the message you received here..."
        />
      </div>

      {/* Tone Selection Buttons */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Select Desired Tone
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['Formal', 'Casual', 'Diplomatic'].map((tone) => (
            <button
              key={tone}
              onClick={() => setSelectedTone(tone)}
              type="button"
              className={`py-2 px-3 rounded-lg text-xs font-medium transition-all duration-150 ${
                selectedTone === tone
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {tone}
            </button>
          ))}
        </div>
      </div>

      {/* Draft Trigger Button */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleDraftReply}
          disabled={loading}
          type="button"
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 active:scale-[0.98]"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <MessageSquare className="w-3.5 h-3.5" />
              Draft my reply
            </>
          )}
        </button>

        {/* Error Feedback */}
        {error && (
          <div className="text-xs text-rose-400 font-medium text-center bg-rose-500/5 border border-rose-500/10 py-2 rounded-lg">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Draft Generation Output */}
      {draftResult && (
        <div className="border-t border-slate-800 pt-4 flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
            Suggested Response
          </label>
          <div className="bg-slate-950 border border-indigo-500/10 rounded-lg p-3.5 text-sm text-slate-200 leading-relaxed font-normal">
            <p className="whitespace-pre-wrap">{draftResult}</p>
          </div>
        </div>
      )}

    </div>
  )
}
