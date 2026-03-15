'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Machine, Material } from '@/types'
import Button from '@/components/ui/Button'

interface Props {
  onClose: () => void
}

export default function SubmitSettingModal({ onClose }: Props) {
  const supabase = createClient()
  const [machines, setMachines] = useState<Machine[]>([])
  const [materials, setMaterials] = useState<Material[]>([])

  // Form state
  const [brand, setBrand] = useState('')
  const [machineId, setMachineId] = useState('')
  const [category, setCategory] = useState('')
  const [materialId, setMaterialId] = useState('')
  const [operation, setOperation] = useState('')
  const [thickness, setThickness] = useState('')
  const [power, setPower] = useState('')
  const [speed, setSpeed] = useState('')
  const [passes, setPasses] = useState('1')
  const [lpi, setLpi] = useState('')
  const [interval, setInterval] = useState('')
  const [airAssist, setAirAssist] = useState(false)
  const [focusNotes, setFocusNotes] = useState('')
  const [resultNotes, setResultNotes] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const [{ data: m }, { data: mat }] = await Promise.all([
        supabase.from('machines').select('*').order('brand').order('model'),
        supabase.from('materials').select('*').order('name'),
      ])
      setMachines(m ?? [])
      setMaterials(mat ?? [])
    }
    load()
  }, [supabase])

  const brands = Array.from(new Set(machines.map((m) => m.brand))).sort()
  const modelsForBrand = machines.filter((m) => m.brand === brand)
  const categories = Array.from(new Set(materials.map((m) => m.category))).sort()
  const materialsForCat = category
    ? materials.filter((m) => m.category === category)
    : materials

  const inputClass =
    'w-full bg-charcoal border border-steel rounded-btn px-3 py-2 font-ui text-sm text-ivory placeholder:text-sage focus:outline-none focus:border-ember transition-colors duration-200'
  const selectClass = inputClass + ' cursor-pointer'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!machineId || !materialId || !operation || !power || !speed || !resultNotes) {
      setError('Please fill in all required fields')
      return
    }
    setSubmitting(true)
    setError('')

    const { error: insertError } = await supabase.from('settings').insert({
      machine_id: machineId,
      material_id: materialId,
      thickness_mm: thickness ? Number(thickness) : null,
      operation,
      power_pct: Number(power),
      speed_mmsec: Number(speed),
      passes: Number(passes) || 1,
      lpi: lpi ? Number(lpi) : null,
      interval_mm: interval ? Number(interval) : null,
      air_assist: airAssist,
      focus_notes: focusNotes || null,
      result_notes: resultNotes,
      source_url: sourceUrl || null,
      source_type: 'community',
      submitted_by: (await supabase.auth.getUser()).data.user?.id,
      approved: false,
    })

    if (insertError) {
      setError(insertError.message)
    } else {
      setSubmitted(true)
    }
    setSubmitting(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/80">
      <div className="bg-forest border border-steel rounded-card w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-ui text-lg font-bold text-ivory">Submit Your Settings</h2>
            <button
              onClick={onClose}
              className="text-sage hover:text-ivory text-xl leading-none"
            >
              &times;
            </button>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <p className="font-ui text-ivory text-lg mb-2">
                Thanks — your submission is in review
              </p>
              <p className="font-ui text-sm text-sage">
                An admin will review and approve your settings shortly.
              </p>
              <Button className="mt-6" onClick={onClose}>
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Machine */}
              <fieldset className="flex flex-col gap-3">
                <legend className="font-ui text-sm font-bold text-ivory mb-1">Machine</legend>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage block mb-1">
                      Brand *
                    </label>
                    <select
                      value={brand}
                      onChange={(e) => { setBrand(e.target.value); setMachineId('') }}
                      className={selectClass}
                      required
                    >
                      <option value="">Select brand...</option>
                      {brands.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage block mb-1">
                      Model *
                    </label>
                    <select
                      value={machineId}
                      onChange={(e) => setMachineId(e.target.value)}
                      className={selectClass}
                      required
                      disabled={!brand}
                    >
                      <option value="">Select model...</option>
                      {modelsForBrand.map((m) => (
                        <option key={m.id} value={m.id}>{m.model}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </fieldset>

              {/* Material */}
              <fieldset className="flex flex-col gap-3">
                <legend className="font-ui text-sm font-bold text-ivory mb-1">Material</legend>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage block mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => { setCategory(e.target.value); setMaterialId('') }}
                      className={selectClass}
                    >
                      <option value="">All categories</option>
                      {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage block mb-1">
                      Material *
                    </label>
                    <select
                      value={materialId}
                      onChange={(e) => setMaterialId(e.target.value)}
                      className={selectClass}
                      required
                    >
                      <option value="">Select material...</option>
                      {materialsForCat.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </fieldset>

              {/* Operation + Settings */}
              <fieldset className="flex flex-col gap-3">
                <legend className="font-ui text-sm font-bold text-ivory mb-1">Settings</legend>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage block mb-1">
                      Operation *
                    </label>
                    <select
                      value={operation}
                      onChange={(e) => setOperation(e.target.value)}
                      className={selectClass}
                      required
                    >
                      <option value="">Select...</option>
                      <option value="engrave">Engrave</option>
                      <option value="cut">Cut</option>
                      <option value="score">Score</option>
                      <option value="mark">Mark</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage block mb-1">
                      Thickness (mm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={thickness}
                      onChange={(e) => setThickness(e.target.value)}
                      placeholder="e.g. 3.0"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage block mb-1">
                      Power % *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={power}
                      onChange={(e) => setPower(e.target.value)}
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage block mb-1">
                      Speed (mm/s) *
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={speed}
                      onChange={(e) => setSpeed(e.target.value)}
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage block mb-1">
                      Passes
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={passes}
                      onChange={(e) => setPasses(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage block mb-1">
                      LPI
                    </label>
                    <input
                      type="number"
                      min={50}
                      value={lpi}
                      onChange={(e) => setLpi(e.target.value)}
                      placeholder="e.g. 318"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage block mb-1">
                      Interval (mm)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      value={interval}
                      onChange={(e) => setInterval(e.target.value)}
                      placeholder="e.g. 0.08"
                      className={inputClass}
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={airAssist}
                    onChange={(e) => setAirAssist(e.target.checked)}
                    className="w-4 h-4 rounded-sm accent-ember"
                  />
                  <span className="font-ui text-sm text-ivory">Air assist used</span>
                </label>
              </fieldset>

              {/* Notes */}
              <fieldset className="flex flex-col gap-3">
                <legend className="font-ui text-sm font-bold text-ivory mb-1">Results</legend>
                <div>
                  <label className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage block mb-1">
                    Focus Notes
                  </label>
                  <input
                    type="text"
                    value={focusNotes}
                    onChange={(e) => setFocusNotes(e.target.value)}
                    placeholder="e.g. Focus on surface, defocus 1mm"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage block mb-1">
                    Result Notes *
                  </label>
                  <textarea
                    value={resultNotes}
                    onChange={(e) => setResultNotes(e.target.value)}
                    placeholder="What did these settings produce? Tips, observations, warnings..."
                    rows={3}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage block mb-1">
                    Source URL
                  </label>
                  <input
                    type="url"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    placeholder="Link to forum post, video, etc."
                    className={inputClass}
                  />
                </div>
              </fieldset>

              {error && <p className="font-ui text-xs text-ember">{error}</p>}

              <Button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Settings'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
