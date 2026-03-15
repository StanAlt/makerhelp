'use client'

import { useMemo } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { Machine, Material, Setting } from '@/types'
import SettingCard from './SettingCard'
import BrandGrid from './BrandGrid'
import Button from '@/components/ui/Button'
import Link from 'next/link'

interface Props {
  machines: Machine[]
  materials: Material[]
  settings: Setting[]
  brandStats: Record<string, { models: number; settings: number; type: string }>
  voteCounts: Record<string, { helpful: number; not_helpful: number }>
  userVotes: Record<string, string>
  userId?: string
  currentParams: Record<string, string | undefined>
}

export default function SettingsPageClient({
  machines,
  materials,
  settings,
  brandStats,
  voteCounts,
  userVotes,
  userId,
  currentParams,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    if (key === 'brand') { params.delete('model') }
    if (key === 'category') { params.delete('material') }
    router.push(`${pathname}?${params.toString()}`)
  }

  function clearAll() {
    router.push(pathname)
  }

  const hasFilters = Object.values(currentParams).some(Boolean)

  // Get models for selected brand
  const modelsForBrand = useMemo(
    () => currentParams.brand
      ? machines.filter((m) => m.brand === currentParams.brand).sort((a, b) => a.model.localeCompare(b.model))
      : [],
    [machines, currentParams.brand]
  )

  // Get categories and materials for filters
  const categories = useMemo(
    () => Array.from(new Set(materials.map((m) => m.category))).sort(),
    [materials]
  )
  const materialsForCat = useMemo(
    () => currentParams.category
      ? materials.filter((m) => m.category === currentParams.category).sort((a, b) => a.name.localeCompare(b.name))
      : materials.sort((a, b) => a.name.localeCompare(b.name)),
    [materials, currentParams.category]
  )

  const selectClass =
    'bg-charcoal border border-steel rounded-btn px-3 py-2.5 font-ui text-sm text-ivory focus:outline-none focus:border-ember transition-colors duration-200 cursor-pointer min-w-[140px]'

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* ─── Header ─── */}
      <div className="text-center mb-16">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ember block mb-3">
          Community-Sourced Reference
        </span>
        <h1 className="font-display text-[56px] font-medium leading-[1.0] tracking-[-0.02em] text-ivory">
          Settings <em className="text-ember">Database</em>
        </h1>
        <p className="font-ui text-lg font-light text-sage mt-4 max-w-xl mx-auto">
          Find tested laser settings for your exact machine and material.
          Every entry sourced from real makers.
        </p>
      </div>

      {/* ─── Brand Grid (when no brand is selected) ─── */}
      {!currentParams.brand && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-ui text-lg font-bold text-ivory">
              Browse by Machine Brand
            </h2>
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage">
              {Object.keys(brandStats).length} brands
            </span>
          </div>
          <BrandGrid
            brandStats={brandStats}
            onSelectBrand={(brand) => updateParam('brand', brand)}
          />
        </section>
      )}

      {/* ─── Active Brand Header ─── */}
      {currentParams.brand && (
        <section className="mb-8">
          <div className="bg-forest border border-steel rounded-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Brand logo placeholder */}
                <div className="w-16 h-16 bg-charcoal border border-steel rounded-card flex items-center justify-center">
                  <span className="font-display text-2xl font-medium text-ember">
                    {currentParams.brand.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="font-ui text-xl font-bold text-ivory">
                    {currentParams.brand}
                  </h2>
                  <p className="font-ui text-sm text-sage">
                    {brandStats[currentParams.brand]?.models ?? 0} models ·{' '}
                    {brandStats[currentParams.brand]?.settings ?? 0} settings
                  </p>
                </div>
              </div>
              <button
                onClick={clearAll}
                className="font-ui text-sm text-sage hover:text-ivory transition-colors duration-200"
              >
                &larr; All Brands
              </button>
            </div>

            {/* Model pills */}
            {modelsForBrand.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => updateParam('model', '')}
                  className={`px-3 py-1.5 rounded-btn font-ui text-xs font-medium transition-colors duration-200 ${
                    !currentParams.model
                      ? 'bg-ember text-ivory'
                      : 'bg-charcoal border border-steel text-sage hover:text-ivory hover:border-ivory'
                  }`}
                >
                  All Models
                </button>
                {modelsForBrand.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => updateParam('model', m.model)}
                    className={`px-3 py-1.5 rounded-btn font-ui text-xs font-medium transition-colors duration-200 ${
                      currentParams.model === m.model
                        ? 'bg-ember text-ivory'
                        : 'bg-charcoal border border-steel text-sage hover:text-ivory hover:border-ivory'
                    }`}
                  >
                    {m.model}
                    {m.wattage && (
                      <span className="ml-1 text-sage opacity-70">{m.wattage}W</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── Filter Bar ─── */}
      <section className="mb-8">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Material category */}
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage">
              Category
            </label>
            <select
              value={currentParams.category ?? ''}
              onChange={(e) => updateParam('category', e.target.value)}
              className={selectClass}
            >
              <option value="">All Materials</option>
              {categories.map((c) => (
                <option key={c} value={c} className="capitalize">{c}</option>
              ))}
            </select>
          </div>

          {/* Material name */}
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage">
              Material
            </label>
            <select
              value={currentParams.material ?? ''}
              onChange={(e) => updateParam('material', e.target.value)}
              className={selectClass}
            >
              <option value="">All</option>
              {materialsForCat.map((m) => (
                <option key={m.id} value={m.name}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Operation */}
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage">
              Operation
            </label>
            <select
              value={currentParams.operation ?? ''}
              onChange={(e) => updateParam('operation', e.target.value)}
              className={selectClass}
            >
              <option value="">All</option>
              <option value="engrave">Engrave</option>
              <option value="cut">Cut</option>
              <option value="score">Score</option>
              <option value="mark">Mark</option>
            </select>
          </div>

          {hasFilters && (
            <button
              onClick={clearAll}
              className="font-ui text-xs text-sage hover:text-ember transition-colors duration-200 pb-2.5"
            >
              Clear all
            </button>
          )}
        </div>
      </section>

      {/* ─── Results Count ─── */}
      {settings.length > 0 && (
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage">
            {settings.length} settings found
          </span>
          <Link href="/settings/submit">
            <Button size="sm" variant="ghost">+ Submit Your Settings</Button>
          </Link>
        </div>
      )}

      {/* ─── Settings Grid ─── */}
      {!settings.length ? (
        <div className="text-center py-24 bg-forest border border-steel rounded-card">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-charcoal border border-steel flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" stroke="#7BA893" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="font-ui text-lg text-ivory mb-2">No settings found</p>
          <p className="font-ui text-sm text-sage mb-6">
            Be the first to submit settings for this combination
          </p>
          <Link href="/settings/submit">
            <Button>Submit Your Settings</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {settings.map((s) => (
            <SettingCard
              key={s.id}
              setting={s}
              voteCounts={voteCounts[s.id] ?? { helpful: 0, not_helpful: 0 }}
              userVote={userVotes[s.id]}
              userId={userId}
            />
          ))}
        </div>
      )}

      {/* ─── Bottom CTA ─── */}
      <div className="text-center mt-20 mb-8">
        <div className="bg-forest border border-steel rounded-card p-12">
          <h2 className="font-display text-3xl font-medium text-ivory tracking-tight">
            Know a setting that <em className="text-ember">works</em>?
          </h2>
          <p className="font-ui text-base font-light text-sage mt-3 max-w-lg mx-auto">
            Help the community. Submit your tested settings and save
            someone else from burning their material.
          </p>
          <Link href="/settings/submit" className="inline-block mt-6">
            <Button>Submit Your Settings</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
