import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#234B3B',
          borderRadius: 42,
          position: 'relative',
        }}
      >
        <div
          style={{
            width: 95,
            height: 84,
            background: '#F5F0E6',
            borderRadius: 19,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#234B3B',
            fontSize: 78,
            fontWeight: 700,
            lineHeight: 1,
            position: 'relative',
          }}
        >
          T
        </div>
        <div
          style={{
            position: 'absolute',
            left: 49,
            bottom: 31,
            width: 29,
            height: 24,
            background: '#F5F0E6',
            transform: 'skewY(-38deg)',
            borderBottomLeftRadius: 5,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 43,
            bottom: 34,
            width: 14,
            height: 14,
            borderRadius: 7,
            background: '#C58A61',
          }}
        />
      </div>
    ),
    { ...size },
  )
}
