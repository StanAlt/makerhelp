import type { Metadata } from 'next'
import Link from 'next/link'
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
      <body className="font-sans antialiased">
        <nav className="border-b border-gray-200 bg-white">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg">
              MakerHelp
            </Link>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/teachers" className="text-gray-600 hover:text-gray-900">
                Find an Expert
              </Link>
              <Link href="/settings" className="text-gray-600 hover:text-gray-900">
                Settings Database
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
