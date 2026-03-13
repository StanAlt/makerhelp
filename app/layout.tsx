import type { Metadata } from 'next'
import './globals.css'

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
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
