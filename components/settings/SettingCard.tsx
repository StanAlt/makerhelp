'use client'

import { useState } from 'react'
import type { Setting } from '@/types'
import Badge from '@/components/ui/Badge'
import VoteButtons from './VoteButtons'
import ChallengeModal from './ChallengeModal'

interface Props {
  setting: Setting
  voteCounts: { helpful: number; not_helpful: number }
  userVote?: string
  userId?: string
}

export default function SettingCard({ setting, voteCounts, userVote, userId }: Props) {
  const [showChallenge, setShowChallenge] = useState(false)
  const machine = setting.machines
  const material = setting.materials

  const sourceBadge = setting.source_type === 'verified'
    ? 'expert' as const
    : setting.source_type === 'staff'
    ? 'new' as const
    : 'vetted' as const

  const sourceLabel = setting.source_type === 'verified'
    ? 'Verified'
    : setting.source_type === 'staff'
    ? 'Staff'
    : 'Community'

  return (
    <>
      <div className="bg-charcoal border border-steel rounded-card flex flex-col">
        <div className="p-4 flex flex-col gap-3">
          {/* Header: Machine + Material */}
          <div>
            <p className="font-ui text-sm font-bold text-ivory">
              {machine?.brand} {machine?.model}
            </p>
            <p className="font-ui text-sm font-light text-sage">
              {material?.name}
              {setting.thickness_mm ? ` · ${setting.thickness_mm}mm` : ''}
            </p>
          </div>

          {/* Operation + Source */}
          <div className="flex items-center gap-2">
            <Badge variant="vetted">{setting.operation}</Badge>
            <Badge variant={sourceBadge}>{sourceLabel}</Badge>
          </div>

          {/* Primary params */}
          <div className="grid grid-cols-3 gap-3 py-2">
            <div className="text-center">
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage block">
                Power
              </span>
              <span className="font-display text-[26px] font-medium text-ivory leading-none">
                {setting.power_pct}%
              </span>
            </div>
            <div className="text-center">
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage block">
                Speed
              </span>
              <span className="font-display text-[26px] font-medium text-ivory leading-none">
                {setting.speed_mmsec}
              </span>
              <span className="font-ui text-[10px] text-sage block">mm/s</span>
            </div>
            <div className="text-center">
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-sage block">
                Passes
              </span>
              <span className="font-display text-[26px] font-medium text-ivory leading-none">
                {setting.passes}
              </span>
            </div>
          </div>

          {/* Secondary */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-sage font-ui">
            {setting.lpi && <span>LPI: {setting.lpi}</span>}
            {setting.interval_mm && <span>Interval: {setting.interval_mm}mm</span>}
            {setting.air_assist && <span>Air Assist</span>}
            {setting.focus_notes && <span>{setting.focus_notes}</span>}
          </div>

          {/* Result notes */}
          {setting.result_notes && (
            <p className="font-ui text-xs italic text-sage leading-relaxed border-t border-steel pt-2">
              {setting.result_notes}
            </p>
          )}
        </div>

        {/* Footer: votes + challenge */}
        <div className="px-4 pb-4 flex items-center justify-between">
          <VoteButtons
            settingId={setting.id}
            counts={voteCounts}
            userVote={userVote}
            userId={userId}
          />
          <button
            onClick={() => setShowChallenge(true)}
            className="font-ui text-xs text-sage hover:text-ember transition-colors duration-200"
          >
            Challenge this setting
          </button>
        </div>
      </div>

      {showChallenge && (
        <ChallengeModal
          setting={setting}
          onClose={() => setShowChallenge(false)}
        />
      )}
    </>
  )
}
