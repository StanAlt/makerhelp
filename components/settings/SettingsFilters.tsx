'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import type { Machine, Material } from '@/types'

interface Props {
  machines: Machine[]
  materials: Material[]
  currentParams: Record<string, string | undefined>
}

export default function SettingsFilters({ machines, materials, currentParams }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      // Clear dependent params
      if (key === 'brand') params.delete('model')
      if (key === 'category') params.delete('material')
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const brands = useMemo(
    () => Array.from(new Set(machines.map((m) => m.brand))).sort(),
    [machines]
  )

  const modelsForBrand = useMemo(
    () =>
      currentParams.brand
        ? machines
            .filter((m) => m.brand === currentParams.brand)
            .map((m) => m.model)
            .sort()
        : [],
    [machines, currentParams.brand]
  )

  const categories = useMemo(
    () => Array.from(new Set(materials.map((m) => m.category))).sort(),
    [materials]
  )

  const materialsForCategory = useMemo(
    () =>
      currentParams.category
        ? materials
            .filter((m) => m.category === currentParams.category)
            .map((m) => m.name)
            .sort()
        : materials.map((m) => m.name).sort(),
    [materials, currentParams.category]
  )

  const selectClass =
    'bg-charcoal border border-steel rounded-btn px-3 py-2.5 font-ui text-sm text-ivory focus:outline-none focus:border-ember transition-colors duration-200 cursor-pointer'

  return (
    <div className="flex flex-wrap gap-3 items-end">
      {/* Brand */}
      <div className="flex flex-col gap-1">
        <label className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage">
          Brand
        </label>
        <select
          value={currentParams.brand ?? ''}
          onChange={(e) => updateParam('brand', e.target.value)}
          className={selectClass}
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* Model (filtered by brand) */}
      <div className="flex flex-col gap-1">
        <label className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage">
          Model
        </label>
        <select
          value={currentParams.model ?? ''}
          onChange={(e) => updateParam('model', e.target.value)}
          className={selectClass}
          disabled={!currentParams.brand}
        >
          <option value="">All Models</option>
          {modelsForBrand.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Material Category */}
      <div className="flex flex-col gap-1">
        <label className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage">
          Category
        </label>
        <select
          value={currentParams.category ?? ''}
          onChange={(e) => updateParam('category', e.target.value)}
          className={selectClass}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c} className="capitalize">{c}</option>
          ))}
        </select>
      </div>

      {/* Material Name */}
      <div className="flex flex-col gap-1">
        <label className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage">
          Material
        </label>
        <select
          value={currentParams.material ?? ''}
          onChange={(e) => updateParam('material', e.target.value)}
          className={selectClass}
        >
          <option value="">All Materials</option>
          {materialsForCategory.map((m) => (
            <option key={m} value={m}>{m}</option>
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
    </div>
  )
}
