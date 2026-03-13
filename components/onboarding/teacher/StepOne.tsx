'use client'

interface StepOneProps {
  fullName: string
  headline: string
  bio: string
  hourlyRate: number
  sessionLengths: number[]
  onChange: (field: string, value: string | number | number[]) => void
}

export default function StepOne({
  fullName,
  headline,
  bio,
  hourlyRate,
  sessionLengths,
  onChange,
}: StepOneProps) {
  const platformFee = 0.2
  const teacherEarnings = hourlyRate * (1 - platformFee)

  const toggleSessionLength = (length: number) => {
    if (sessionLengths.includes(length)) {
      if (sessionLengths.length > 1) {
        onChange(
          'sessionLengths',
          sessionLengths.filter((l) => l !== length)
        )
      }
    } else {
      onChange('sessionLengths', [...sessionLengths, length])
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Basic Info</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => onChange('fullName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Your full name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Headline
        </label>
        <input
          type="text"
          value={headline}
          onChange={(e) => onChange('headline', e.target.value.slice(0, 100))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="xTool & CO2 specialist, 5yr LightBurn expert"
          maxLength={100}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">Min 10 characters</span>
          <span
            className={`text-xs ${
              headline.length > 90 ? 'text-orange-500' : 'text-gray-400'
            }`}
          >
            {headline.length}/100
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio
        </label>
        <textarea
          value={bio}
          onChange={(e) => onChange('bio', e.target.value.slice(0, 500))}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Tell makers about your experience, what you've built, and how you can help"
          maxLength={500}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">Min 50 characters</span>
          <span
            className={`text-xs ${
              bio.length > 450 ? 'text-orange-500' : 'text-gray-400'
            }`}
          >
            {bio.length}/500
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hourly Rate ($)
        </label>
        <input
          type="number"
          value={hourlyRate}
          onChange={(e) => {
            const val = parseInt(e.target.value) || 0
            onChange('hourlyRate', Math.min(500, Math.max(0, val)))
          }}
          min={20}
          max={500}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-sm text-gray-500 mt-1">
          Platform keeps 20%. You receive{' '}
          <span className="font-medium text-green-600">
            ${teacherEarnings.toFixed(2)}
          </span>{' '}
          per hour.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Session Lengths
        </label>
        <div className="flex gap-3">
          {[30, 60].map((length) => (
            <label key={length} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sessionLengths.includes(length)}
                onChange={() => toggleSessionLength(length)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm">{length} minutes</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
