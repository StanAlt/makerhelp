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

function operationIcon(op: string) {
  switch (op) {
    case 'cut': return '\u2702'
    case 'engrave': return '\u2B50'
    case 'score': return '\u2014'
    case 'mark': return '\u25C6'
    default: return '\u2022'
  }
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
      <div className="bg-charcoal border border-steel rounded-card flex flex-col hover:border-steel/80 transition-colors duration-200">
        {/* Header bar */}
        <div className="px-4 pt-4 pb-3 border-b border-steel/50">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-ui text-sm font-bold text-ivory truncate">
                {machine?.brand} {machine?.model}
              </p>
              <p className="font-ui text-xs font-light text-sage truncate mt-0.5">
                {material?.name}
                {setting.thickness_mm ? ` \u00B7 ${setting.thickness_mm}mm` : ''}
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="font-ui text-xs text-sage">{operationIcon(setting.operation)}</span>
              <Badge variant="vetted">{setting.operation}</Badge>
            </div>
          </div>
        </div>

        {/* Primary params — large Cormorant numerals */}
        <div className="px-4 py-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center bg-forest/50 rounded-btn py-3 px-1">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-sage block mb-1">
                Power
              </span>
              <span className="font-display text-[28px] font-medium text-ivory leading-none">
                {setting.power_pct}
              </span>
              <span className="font-ui text-[10px] text-sage block mt-0.5">%</span>
            </div>
            <div className="text-center bg-forest/50 rounded-btn py-3 px-1">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-sage block mb-1">
                Speed
              </span>
              <span className="font-display text-[28px] font-medium text-ivory leading-none">
                {setting.speed_mmsec}
              </span>
              <span className="font-ui text-[10px] text-sage block mt-0.5">mm/s</span>
            </div>
            <div className="text-center bg-forest/50 rounded-btn py-3 px-1">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-sage block mb-1">
                Passes
              </span>
              <span className="font-display text-[28px] font-medium text-ivory leading-none">
                {setting.passes}
              </span>
              <span className="font-ui text-[10px] text-sage block mt-0.5">&nbsp;</span>
            </div>
          </div>
        </div>

        {/* Secondary details */}
        <div className="px-4 pb-3">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {setting.lpi && (
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-sage">
                {setting.lpi} LPI
              </span>
            )}
            {setting.interval_mm && (
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-sage">
                {setting.interval_mm}mm gap
              </span>
            )}
            {setting.air_assist && (
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-forest-light">
                Air Assist
              </span>
            )}
          </div>
          {setting.focus_notes && (
            <p className="font-ui text-[11px] text-sage mt-1.5">{setting.focus_notes}</p>
          )}
        </div>

        {/* Result notes */}
        {setting.result_notes && (
          <div className="px-4 pb-3">
            <p className="font-ui text-xs italic text-sage/80 leading-relaxed border-t border-steel/30 pt-2">
              {setting.result_notes}
            </p>
          </div>
        )}

        {/* Footer: source + votes + challenge */}
        <div className="mt-auto px-4 pb-3 pt-1 flex items-center justify-between border-t border-steel/30">
          <div className="flex items-center gap-2">
            <Badge variant={sourceBadge}>{sourceLabel}</Badge>
            {setting.source_url && (
              <a
                href={setting.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] text-sage hover:text-ember transition-colors"
                title="View source"
              >
                src
              </a>
            )}
          </div>
          <div className="flex items-center gap-3">
            <VoteButtons
              settingId={setting.id}
              counts={voteCounts}
              userVote={userVote}
              userId={userId}
            />
            <button
              onClick={() => setShowChallenge(true)}
              className="font-mono text-[10px] uppercase tracking-[0.08em] text-sage hover:text-ember transition-colors duration-200"
              title="Challenge this setting"
            >
              Challenge
            </button>
          </div>
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
