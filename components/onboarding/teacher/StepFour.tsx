'use client'

import { EquipmentEntry } from './TeacherOnboardingForm'

interface StepFourProps {
  fullName: string
  headline: string
  bio: string
  hourlyRate: number
  sessionLengths: number[]
  equipment: EquipmentEntry[]
  specialties: string[]
  confirmed: boolean
  onConfirmChange: (confirmed: boolean) => void
}

const LASER_TYPE_LABELS: Record<string, string> = {
  diode: 'Diode',
  co2: 'CO2',
  fiber: 'Fiber',
  uv: 'UV',
  galvo: 'Galvo',
}

export default function StepFour({
  fullName,
  headline,
  bio,
  hourlyRate,
  sessionLengths,
  equipment,
  specialties,
  confirmed,
  onConfirmChange,
}: StepFourProps) {
  const platformFee = 0.2
  const payout = hourlyRate * (1 - platformFee)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Review Your Profile</h2>
      <p className="text-sm text-gray-500">
        Please review everything before submitting. You can go back to make changes.
      </p>

      <div className="bg-gray-50 rounded-lg p-6 space-y-6">
        {/* Basic Info */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Basic Info
          </h3>
          <p className="text-lg font-semibold">{fullName}</p>
          <p className="text-blue-600">{headline}</p>
          <p className="text-gray-700 mt-2 whitespace-pre-wrap">{bio}</p>
        </div>

        {/* Rate */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Pricing
          </h3>
          <p className="text-gray-700">
            <span className="font-semibold">${hourlyRate}/hr</span>
            {' · '}
            You earn ${(payout / 2).toFixed(2)} for 30 min, ${payout.toFixed(2)} for 60 min
          </p>
        </div>

        {/* Equipment */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Equipment ({equipment.length} machine{equipment.length !== 1 ? 's' : ''})
          </h3>
          <div className="space-y-2">
            {equipment.map((eq) => (
              <div key={eq.id} className="text-gray-700">
                <span className="font-medium">{eq.brand}</span>
                {eq.model && <span> {eq.model}</span>}
                <span className="text-gray-500">
                  {' · '}
                  {LASER_TYPE_LABELS[eq.laserType] || eq.laserType}
                  {eq.wattage && ` · ${eq.wattage}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Specialties */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Specialties ({specialties.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {specialties.map((s) => (
              <span
                key={s}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => onConfirmChange(e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
        />
        <span className="text-sm text-gray-700">
          I confirm all information is accurate and I own the equipment listed above.
        </span>
      </label>
    </div>
  )
}
