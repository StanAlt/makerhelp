interface LogoMarkProps {
  variant?: 'dark' | 'forest' | 'light'
  size?: number
}

export function LogoMark({ variant = 'dark', size = 44 }: LogoMarkProps) {
  const leftStroke = variant === 'light' ? '#1B3D2A' : '#F5F0E8'
  const sparkFill = '#FF4D1A'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left stroke — the maker */}
      <path d="M8 36V8l14 18" stroke={leftStroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Right stroke — the help */}
      <path d="M36 36V8L22 26" stroke={sparkFill} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Spark dot at apex */}
      <circle cx="22" cy="8" r="2.5" fill={sparkFill} />
    </svg>
  )
}

export function Wordmark() {
  return (
    <span className="font-display text-2xl font-medium tracking-tight">
      <span className="text-ivory">Maker</span>
      <span className="text-ember italic">Help</span>
    </span>
  )
}

export function NavBrand() {
  return (
    <div className="flex items-center gap-2">
      <LogoMark variant="dark" size={32} />
      <Wordmark />
    </div>
  )
}
