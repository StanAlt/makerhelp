'use client'

import Link from 'next/link'
import { NavBrand } from '@/components/brand/LogoMark'
import Button from './Button'

export default function Nav() {
  return (
    <nav className="h-[60px] bg-charcoal border-b border-steel">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" aria-label="MakerHelp home">
          <NavBrand />
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/teachers"
            className="font-ui text-sm text-sage hover:text-ivory transition-colors duration-200"
          >
            Find an Expert
          </Link>
          <Link
            href="/settings"
            className="font-ui text-sm text-sage hover:text-ivory transition-colors duration-200"
          >
            Settings Database
          </Link>
          <Link
            href="/dashboard"
            className="font-ui text-sm text-sage hover:text-ivory transition-colors duration-200"
          >
            Dashboard
          </Link>
          <Link href="/book">
            <Button size="sm">Book a Call</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
