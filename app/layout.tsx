import type { Metadata } from 'next'
import '@/styles/brand.css'
import './globals.css'
import Nav from '@/components/ui/Nav'

/*
  Font loading — Google Fonts via next/font/google.
  Uncomment the block below when building with network access:

  import { Cormorant_Garamond, Outfit, JetBrains_Mono } from 'next/font/google'

  const cormorant = Cormorant_Garamond({
    subsets: ['latin'], weight: ['500'], style: ['normal', 'italic'],
    variable: '--font-cormorant', display: 'swap',
  })
  const outfit = Outfit({
    subsets: ['latin'], weight: ['300', '400', '500', '700'],
    variable: '--font-outfit', display: 'swap',
  })
  const jetbrains = JetBrains_Mono({
    subsets: ['latin'], weight: ['400', '500'],
    variable: '--font-jetbrains', display: 'swap',
  })

  Then add to <html>:
    className={`${cormorant.variable} ${outfit.variable} ${jetbrains.variable}`}

  The CSS variables --font-cormorant, --font-outfit, --font-jetbrains are
  defined with fallback stacks in styles/brand.css for offline builds.
*/

export const metadata: Metadata = {
  title: 'MakerHelp — Expert Laser Help, Live',
  description:
    'Book a live video call with a vetted laser engraving and CNC expert. Get help with LightBurn, xTool, Glowforge, and more.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-ui antialiased bg-charcoal text-ivory">
        <Nav />
        {children}
      </body>
    </html>
  )
}
