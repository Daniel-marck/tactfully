import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const siteUrl = 'https://homepage-wireframe-for-tactfully.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Tactfully — Write client replies with confidence',
    template: '%s | Tactfully',
  },
  description:
    'Turn difficult client messages into clear, professional replies. Draft two options, choose your tone, and stay in control of every response.',
  applicationName: 'Tactfully',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-light-32x32.png', sizes: '32x32', type: 'image/png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', sizes: '32x32', type: 'image/png', media: '(prefers-color-scheme: dark)' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    siteName: 'Tactfully',
    title: 'Tactfully — Write client replies with confidence',
    description:
      'Turn difficult client messages into clear, professional replies. Draft two options, choose your tone, and stay in control of every response.',
    url: siteUrl,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Tactfully — a calm, professional workspace for drafting client replies',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tactfully — Write client replies with confidence',
    description:
      'Turn difficult client messages into clear, professional replies. Draft two options, choose your tone, and stay in control of every response.',
    images: ['/opengraph-image'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
