'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Setting, SettingChallenge } from '@/types'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

interface Props {
  pending: Setting[]
  challenges: (SettingChallenge & { settings: Setting })[]
  adminId: string
}

export default function AdminSettingsClient({ pending, challenges, adminId }: Props) {
  const [tab, setTab] = useState<'pending' | 'challenges'>('pending')
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function handleAction(action: string, id: string, body: Record<string, unknown>) {
    setLoading(id)
    await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, id, ...body }),
    })
    setLoading(null)
    router.refresh()
  }

  const tabClass = (active: boolean) =>
    `px-4 py-2 font-ui text-sm font-medium rounded-btn transition-colors duration-200 ${
      active ? 'bg-ember text-ivory' : 'text-sage hover:text-ivory'
    }`

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        <button className={tabClass(tab === 'pending')} onClick={() => setTab('pending')}>
          Pending Submissions ({pending.length})
        </button>
        <button className={tabClass(tab === 'challenges')} onClick={() => setTab('challenges')}>
          Open Challenges ({challenges.length})
        </button>
      </div>

      {tab === 'pending' && (
        <div className="flex flex-col gap-4">
          {pending.length === 0 && (
            <p className="font-ui text-sage">No pending submissions.</p>
          )}
          {pending.map((s) => (
            <div key={s.id} className="bg-forest border border-steel rounded-card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-ui text-sm font-bold text-ivory">
                    {s.machines?.brand} {s.machines?.model} — {s.materials?.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="vetted">{s.operation}</Badge>
                    <Badge variant="vetted">{s.source_type}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div>
                      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-sage block">Power</span>
                      <span className="font-display text-xl text-ivory">{s.power_pct}%</span>
                    </div>
                    <div>
                      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-sage block">Speed</span>
                      <span className="font-display text-xl text-ivory">{s.speed_mmsec} mm/s</span>
                    </div>
                    <div>
                      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-sage block">Passes</span>
                      <span className="font-display text-xl text-ivory">{s.passes}</span>
                    </div>
                  </div>
                  {s.result_notes && (
                    <p className="font-ui text-xs italic text-sage mt-2">{s.result_notes}</p>
                  )}
                  {s.source_url && (
                    <a
                      href={s.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-ui text-xs text-ember hover:text-ember-light mt-1 inline-block"
                    >
                      Source link
                    </a>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    onClick={() => handleAction('approve_setting', s.id, { adminId })}
                    disabled={loading === s.id}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAction('reject_setting', s.id, { adminId })}
                    disabled={loading === s.id}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'challenges' && (
        <div className="flex flex-col gap-4">
          {challenges.length === 0 && (
            <p className="font-ui text-sage">No open challenges.</p>
          )}
          {challenges.map((c) => {
            const s = c.settings
            return (
              <div key={c.id} className="bg-forest border border-steel rounded-card p-4">
                <p className="font-ui text-sm font-bold text-ivory mb-3">
                  {s?.machines?.brand} {s?.machines?.model} — {s?.materials?.name}
                </p>

                {/* Side by side: original vs suggested */}
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="bg-charcoal border border-steel rounded-btn p-3">
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-sage mb-2">
                      Current
                    </p>
                    <p className="font-ui text-sm text-ivory">
                      Power: {s?.power_pct}% · Speed: {s?.speed_mmsec} · Passes: {s?.passes}
                    </p>
                  </div>
                  <div className="bg-charcoal border border-ember/30 rounded-btn p-3">
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ember mb-2">
                      Suggested
                    </p>
                    <p className="font-ui text-sm text-ivory">
                      Power: {c.suggested_power ?? s?.power_pct}% ·
                      Speed: {c.suggested_speed ?? s?.speed_mmsec} ·
                      Passes: {c.suggested_passes ?? s?.passes}
                    </p>
                  </div>
                </div>

                <p className="font-ui text-sm text-ivory mb-1">
                  <span className="text-sage">Reason:</span> {c.reason}
                </p>
                {c.evidence_url && (
                  <a
                    href={c.evidence_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-ui text-xs text-ember hover:text-ember-light"
                  >
                    Evidence link
                  </a>
                )}

                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    onClick={() =>
                      handleAction('accept_challenge', c.id, {
                        settingId: c.setting_id,
                        adminId,
                        suggestedPower: c.suggested_power,
                        suggestedSpeed: c.suggested_speed,
                        suggestedPasses: c.suggested_passes,
                      })
                    }
                    disabled={loading === c.id}
                  >
                    Accept Challenge
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAction('reject_challenge', c.id, { adminId })}
                    disabled={loading === c.id}
                  >
                    Reject Challenge
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
