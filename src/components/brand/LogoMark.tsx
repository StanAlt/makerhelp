interface LogoMarkProps {
  /** Visual background context — controls which color variant to use */
  variant?: 'dark' | 'forest' | 'light'
  /** Size in px (renders as a square) */
  size?: number
  className?: string
}

/**
 * MakerHelp logo mark — the split M with ember spark.
 *
 * The M is split: left stroke (ivory/forest) = the maker.
 * Right stroke (ember) = the help.
 * Spark dot at apex = the moment of connection.
 *
 * Usage:
 *   <LogoMark variant="dark" size={44} />
 *   <LogoMark variant="light" size={32} />
 */
export function LogoMark({ variant = 'dark', size = 44, className }: LogoMarkProps) {
  const bg = {
    dark:   '#1B3D2A',
    forest: '#2A5C3F',
    light:  '#F5F0E8',
  }[variant]

  const leftStroke = variant === 'light' ? '#1B3D2A' : '#F5F0E8'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="MakerHelp"
      role="img"
    >
      {/* Rounded square background */}
      <rect x="4" y="4" width="112" height="112" rx="22" fill={bg} />

      {/* Left half of M — the maker (ivory on dark, forest on light) */}
      <path
        d="M28 90 L28 30 L60 60"
        stroke={leftStroke}
        strokeWidth="8.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Right half of M — the help (always ember) */}
      <path
        d="M60 60 L92 30 L92 90"
        stroke="#FF4D1A"
        strokeWidth="8.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Spark dot — the moment of connection */}
      <circle cx="60" cy="60" r="5" fill="#FF4D1A" />
      <circle cx="60" cy="60" r="9" fill="#FF4D1A" opacity="0.2" />
    </svg>
  )
}

interface WordmarkProps {
  /** Scale in px relative to 22px base */
  size?: number
  /** Background context — controls left-side text color */
  variant?: 'dark' | 'light'
  className?: string
}

/**
 * MakerHelp wordmark — "Maker" + italic ember "Help"
 *
 * Requires Cormorant Garamond loaded via next/font/google.
 * Use className to pass font-family if needed in non-app contexts.
 *
 * Usage:
 *   <Wordmark size={22} />
 *   <Wordmark size={36} variant="light" />
 */
export function Wordmark({ size = 22, variant = 'dark', className }: WordmarkProps) {
  const makerColor = variant === 'light' ? '#1B3D2A' : '#F5F0E8'

  return (
    <span
      style={{
        fontFamily: 'var(--font-cormorant), Georgia, serif',
        fontSize: `${size}px`,
        fontWeight: 500,
        letterSpacing: '-0.01em',
        lineHeight: 1,
      }}
      className={className}
    >
      <span style={{ color: makerColor }}>Maker</span>
      <span style={{ color: '#FF4D1A', fontStyle: 'italic' }}>Help</span>
    </span>
  )
}

interface NavBrandProps {
  className?: string
}

/**
 * Nav-ready brand lockup: icon + wordmark side by side.
 * Pre-sized for a 60px nav bar.
 */
export function NavBrand({ className }: NavBrandProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className={className}>
      <LogoMark variant="dark" size={32} />
      <Wordmark size={22} variant="dark" />
    </div>
  )
}
