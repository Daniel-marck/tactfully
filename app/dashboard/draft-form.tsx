'use client';

import { useState } from 'react';

const SITUATIONS = [
  { label: 'Late payment', val: 'Chasing a late payment' },
  { label: 'Scope creep', val: 'Pushing back on scope creep' },
  { label: 'Lowball offer', val: 'Responding to a lowball offer' },
  { label: 'No response', val: 'Following up on no response' },
  { label: 'Saying no', val: 'Saying no / declining the ask' },
  { label: 'Something else', val: 'A general difficult message' },
];

const TONES = [
  { label: 'Diplomatic', val: 'Diplomatic and warm, but clear' },
  { label: 'Firm', val: 'Firm and direct, no fluff' },
  { label: 'Formal', val: 'Formal and businesslike' },
];

interface Reply {
  label: string;
  reply: string;
  why: string;
}

export default function DraftForm() {
  const [message, setMessage] = useState('');
  const [situation, setSituation] = useState('Chasing a late payment');
  const [tone, setTone] = useState('Diplomatic and warm, but clear');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [replies, setReplies] = useState<Reply[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const sealSVG = () => (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12 2L14.5 8.5L21 9.5L16 14L17.5 21L12 17.5L6.5 21L8 14L3 9.5L9.5 8.5L12 2Z" fill="#F5EFE1" opacity="0.9"/>
    </svg>
  );

  const handleGenerate = async () => {
    if (!message.trim()) {
      setStatus('Paste the client message first.');
      return;
    }

    setLoading(true);
    setStatus('');
    setReplies([]);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, situation, tone }),
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const data = await response.json();
      if (data.replies) {
        setReplies(data.replies);
      } else {
        throw new Error('Invalid JSON shape returned');
      }
    } catch (err) {
      console.error(err);
      setStatus('Something went wrong drafting that. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    });
  };

  return (
    <div className="tactfully-theme">
      <div className="wrap">
        <header>
          <div className="eyebrow">For freelancers &amp; solo consultants</div>
          <h1>Tactfully</h1>
          <p className="sub">Paste the message that's stressing you out. Get a reply worth sending — sealed and ready.</p>
        </header>

        <div className="board">
          {/* Left Side: Interactive Note Card */}
          <div className="card note-card">
            <span className="card-label">The message</span>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Paste what the client actually said... e.g. "Hey, can you just knock the price down a bit? My budget is tighter than I thought."'
            />

            {/* Situation Selection */}
            <div className="fieldgroup">
              <span className="card-label">Situation</span>
              <div className="pillrow">
                {SITUATIONS.map((sit) => (
                  <button
                    key={sit.val}
                    type="button"
                    className={`pill ${situation === sit.val ? 'active' : ''}`}
                    onClick={() => setSituation(sit.val)}
                  >
                    {sit.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selection */}
            <div className="fieldgroup">
              <span className="card-label">Tone</span>
              <div className="pillrow">
                {TONES.map((t) => (
                  <button
                    key={t.val}
                    type="button"
                    className={`pill ${tone === t.val ? 'active' : ''}`}
                    onClick={() => setTone(t.val)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button 
              className="gen-btn" 
              onClick={handleGenerate} 
              disabled={loading}
            >
              {loading ? 'Drafting...' : 'Draft my reply'}
            </button>
            {status && <div className="status">{status}</div>}
          </div>

          {/* Right Side: Generated Replies */}
          <div className="output-col">
            {replies.length === 0 && !loading && (
              <div className="empty-state">
                Your two reply options will appear here, each with a quick note on why it works.
              </div>
            )}

            {loading && (
              <div className="empty-state">
                Claude is polishing up two smart, strategic replies for you...
              </div>
            )}

            {replies.map((r, idx) => (
              <div key={idx} className="reply-card">
                <div className="seal">{sealSVG()}</div>
                <div className="reply-label">{r.label}</div>
                <div className="reply-text">{r.reply}</div>
                <div className="why">{r.why}</div>
                <button 
                  className="copy-btn"
                  onClick={() => handleCopy(r.reply, idx)}
                >
                  {copiedIndex === idx ? 'Copied' : 'Copy reply'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
