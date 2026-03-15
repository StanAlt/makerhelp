'use client'

interface BrandStats {
  models: number
  settings: number
  type: string
}

interface Props {
  brandStats: Record<string, BrandStats>
  onSelectBrand: (brand: string) => void
}

// Brand color accents — using brand-safe colors only
const BRAND_ACCENTS: Record<string, string> = {
  'xTool': '#2A5C3F',
  'Glowforge': '#2A5C3F',
  'OMTech': '#2A5C3F',
  'Sculpfun': '#2A5C3F',
  'Atomstack': '#2A5C3F',
  'Ortur': '#2A5C3F',
  'Rabbit Laser USA': '#2A5C3F',
  'Boss Laser': '#2A5C3F',
  'Thunder Laser': '#2A5C3F',
  'Creality': '#2A5C3F',
  'AP Lazer': '#2A5C3F',
  'Two Trees': '#2A5C3F',
  'Laguna Tools': '#2A5C3F',
  'EN Laser': '#2A5C3F',
  'Stealth Laser': '#2A5C3F',
  'OneLaser': '#2A5C3F',
}

function laserTypeLabel(type: string) {
  switch (type) {
    case 'diode': return 'Diode'
    case 'co2': return 'CO\u2082'
    case 'fiber': return 'Fiber'
    case 'galvo': return 'Galvo'
    default: return type
  }
}

export default function BrandGrid({ brandStats, onSelectBrand }: Props) {
  // Sort brands: most settings first
  const sorted = Object.entries(brandStats).sort(
    (a, b) => b[1].settings - a[1].settings
  )

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {sorted.map(([brand, stats]) => (
        <button
          key={brand}
          onClick={() => onSelectBrand(brand)}
          className="group bg-forest border border-steel rounded-card p-4 text-left hover:border-ember transition-all duration-200 flex flex-col gap-3"
        >
          {/* Logo placeholder — you'll drop real logos here */}
          <div
            className="w-full h-14 rounded-btn flex items-center justify-center border border-steel/50"
            style={{ backgroundColor: BRAND_ACCENTS[brand] ?? '#2A5C3F' }}
          >
            <span className="font-display text-xl font-medium text-ivory opacity-90 group-hover:opacity-100 transition-opacity">
              {brand.length <= 8
                ? brand
                : brand.split(' ').map(w => w[0]).join('')}
            </span>
          </div>

          {/* Brand name */}
          <div>
            <p className="font-ui text-sm font-bold text-ivory group-hover:text-ember transition-colors duration-200 truncate">
              {brand}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-sage">
                {stats.models} {stats.models === 1 ? 'model' : 'models'}
              </span>
              <span className="text-steel">·</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-sage">
                {stats.settings}
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
