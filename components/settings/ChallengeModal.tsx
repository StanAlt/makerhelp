'use client'

import { useState } from 'react'
import type { Setting } from '@/types'
import Button from '@/components/ui/Button'

interface Props {
  setting: Setting
  onClose: () => void
}

export default function ChallengeModal({ setting, onClose }: Props) {
  const [reason, setReason] = useState('')
  const [suggestedPower, setSuggestedPower] = useState('')
  const [suggestedSpeed, setSuggestedSpeed] = useState('')
  const [suggestedPasses, setSuggestedPasses] = useState('')
  const [evidenceUrl, setEvidenceUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (reason.length < 20) {
      setError('Reason must be at least 20 characters')
      return
    }
    setSubmitting(true)
    setError('')

    const res = await fetch('/api/settings/challenge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        settingId: setting.id,
        reason,
        suggestedPower: suggestedPower ? Number(suggestedPower) : null,
        suggestedSpeed: suggestedSpeed ? Number(suggestedSpeed) : null,
        suggestedPasses: suggestedPasses ? Number(suggestedPasses) : null,
        evidenceUrl: evidenceUrl || null,
      }),
    })

    if (res.ok) {
      setSubmitted(true)
    } else {
      const data = await res.json()
      setError(data.error || 'Failed to submit challenge')
    }
    setSubmitting(false)
  }

  const inputClass =
    'w-full bg-charcoal border border-steel rounded-btn px-3 py-2 font-ui text-sm text-ivory placeholder:text-sage focus:outline-none focus:border-ember transition-colors duration-200'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/80">
      <div className="bg-forest border border-steel rounded-card w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-ui text-lg font-bold text-ivory">Challenge Setting</h2>
            <button
              onClick={onClose}
              className="text-sage hover:text-ivory text-xl leading-none"
            >
              &times;
            </button>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <p className="font-ui text-ivory mb-2">Challenge submitted</p>
              <p className="font-ui text-sm text-sage">
                An admin will review your challenge. Thank you for improving the database.
              </p>
              <Button className="mt-6" onClick={onClose}>
                Close
              </Button>
            </div>
          ) : (
            <>
              {/* Current setting summary */}
              <div className="bg-charcoal border border-steel rounded-btn p-3 mb-4">
                <p className="font-ui text-xs text-sage mb-1">Current setting</p>
                <p className="font-ui text-sm text-ivory">
                  Power: {setting.power_pct}% · Speed: {setting.speed_mmsec} mm/s · Passes: {setting.passes}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage block mb-1">
                    Reason *
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Why should this setting be changed? (min 20 chars)"
                    rows={3}
                    className={inputClass}
                    required
                    minLength={20}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage block mb-1">
                      Power %
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={suggestedPower}
                      onChange={(e) => setSuggestedPower(e.target.value)}
                      placeholder={String(setting.power_pct)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage block mb-1">
                      Speed
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={suggestedSpeed}
                      onChange={(e) => setSuggestedSpeed(e.target.value)}
                      placeholder={String(setting.speed_mmsec)}
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
                      value={suggestedPasses}
                      onChange={(e) => setSuggestedPasses(e.target.value)}
                      placeholder={String(setting.passes)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage block mb-1">
                    Evidence URL
                  </label>
                  <input
                    type="url"
                    value={evidenceUrl}
                    onChange={(e) => setEvidenceUrl(e.target.value)}
                    placeholder="Link to forum post, video, etc."
                    className={inputClass}
                  />
                </div>

                {error && (
                  <p className="font-ui text-xs text-ember">{error}</p>
                )}

                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Challenge'}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
