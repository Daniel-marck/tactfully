import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Tactfully — professional client reply drafting workspace'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', backgroundColor: '#F6F4EC',
        padding: '64px 72px', color: '#243B30', fontFamily: 'Arial, sans-serif',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 54, height: 54, borderRadius: 15, background: '#315D47',
            color: '#FFFFFF', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 34, fontWeight: 700,
          }}>T</div>
          <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: -1 }}>
            tactfully<span style={{ color: '#78947D' }}>.</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: 620 }}>
            <div style={{ color: '#66816E', fontSize: 17, fontWeight: 700, letterSpacing: 3, marginBottom: 22 }}>
              YOUR CLIENT COMMUNICATION ASSISTANT
            </div>
            <div style={{ fontSize: 58, lineHeight: 1.08, fontWeight: 700, letterSpacing: -2 }}>
              Respond with clarity. Keep your confidence.
            </div>
            <div style={{ fontSize: 23, lineHeight: 1.5, color: '#65736A', marginTop: 24 }}>
              Turn difficult client messages into thoughtful, professional replies.
            </div>
          </div>
          <div style={{
            width: 350, borderRadius: 22, background: '#FFFFFF', padding: 25,
            border: '1px solid #E3E7DE', display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ color: '#8B958C', fontSize: 13, fontWeight: 700, letterSpacing: 2, marginBottom: 16 }}>
              YOUR REPLY
            </div>
            <div style={{ fontSize: 21, lineHeight: 1.45, color: '#34483B' }}>
              “Those additions sit outside our original scope. I can send an updated estimate before we proceed.”
            </div>
            <div style={{
              marginTop: 24, padding: '12px 16px', borderRadius: 10,
              background: '#315D47', color: '#FFFFFF', fontSize: 15, fontWeight: 700,
              textAlign: 'center',
            }}>Two thoughtful options · Your choice</div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#839087', fontSize: 15 }}>
          <div>Draft thoughtfully. Send confidently.</div>
          <div>tactfully.app</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
