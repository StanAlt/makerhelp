'use client'

import { useState } from 'react'

interface BookingFormProps {
  teacher: {
    id: string
    hourly_rate_cents: number
    session_lengths: number[]
    teacherName: string
  }
  makerId: string
}

type Step = 'select' | 'describe' | 'confirm'

export function BookingForm({ teacher, makerId }: BookingFormProps) {
  const [step, setStep] = useState<Step>('select')
  const [duration, setDuration] = useState<number>(
    teacher.session_lengths.includes(60) ? 60 : 30
  )
  const [problem, setProblem] = useState('')
  const [machineType, setMachineType] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const ratePerHour = teacher.hourly_rate_cents / 100
  const amount = (ratePerHour * duration) / 60
  const amountCents = Math.round(amount * 100)
  const platformFeeCents = Math.round(amountCents * 0.2)
  const teacherPayoutCents = amountCents - platformFeeCents

  async function handleCheckout() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/sessions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: teacher.id,
          makerId,
          durationMinutes: duration,
          amountCents,
          platformFeeCents,
          teacherPayoutCents,
          problemDescription: problem,
          machineType,
        }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
        setLoading(false)
        return
      }
      window.location.href = data.checkoutUrl
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (step === 'select') {
    return (
      <div>
        <h2 className="font-semibold mb-4">Choose Session Length</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {teacher.session_lengths.includes(30) && (
            <button
              onClick={() => setDuration(30)}
              className={`p-6 border-2 rounded-lg text-center transition-colors ${
                duration === 30
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl font-bold">${(ratePerHour / 2).toFixed(0)}</div>
              <div className="text-gray-600">30 minutes</div>
            </button>
          )}
          {teacher.session_lengths.includes(60) && (
            <button
              onClick={() => setDuration(60)}
              className={`p-6 border-2 rounded-lg text-center transition-colors ${
                duration === 60
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl font-bold">${ratePerHour.toFixed(0)}</div>
              <div className="text-gray-600">60 minutes</div>
            </button>
          )}
        </div>
        <button
          onClick={() => setStep('describe')}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Continue &rarr;
        </button>
      </div>
    )
  }

  if (step === 'describe') {
    return (
      <div>
        <h2 className="font-semibold mb-4">Describe Your Problem</h2>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Your Machine</label>
            <input
              type="text"
              value={machineType}
              onChange={(e) => setMachineType(e.target.value)}
              placeholder="e.g. xTool P2, OMTech 60W CO2, Atomstack S30 Pro"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              What do you need help with?
            </label>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value.slice(0, 1000))}
              placeholder="Describe the problem you're having or what you want to learn. The more detail, the better your session will be."
              rows={5}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">{problem.length}/1000</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setStep('select')}
            className="px-4 py-3 border rounded-lg hover:bg-gray-50"
          >
            &larr; Back
          </button>
          <button
            onClick={() => setStep('confirm')}
            disabled={problem.trim().length < 20}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue &rarr;
          </button>
        </div>
      </div>
    )
  }

  // Confirm step
  return (
    <div>
      <h2 className="font-semibold mb-4">Review &amp; Pay</h2>
      <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Session with</span>
          <span className="font-medium">{teacher.teacherName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Duration</span>
          <span className="font-medium">{duration} minutes</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Your machine</span>
          <span className="font-medium">{machineType || '—'}</span>
        </div>
        <div className="border-t pt-3 flex justify-between">
          <span className="font-semibold">Total</span>
          <span className="font-semibold text-lg">${amount.toFixed(2)}</span>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Your problem description:{' '}
        <em>
          &ldquo;{problem.slice(0, 100)}
          {problem.length > 100 ? '...' : ''}&rdquo;
        </em>
      </p>
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm mb-4">
          {error}
        </div>
      )}
      <div className="flex gap-3">
        <button
          onClick={() => setStep('describe')}
          className="px-4 py-3 border rounded-lg hover:bg-gray-50"
        >
          &larr; Back
        </button>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
        >
          {loading ? 'Redirecting to payment...' : `Pay $${amount.toFixed(2)} \u2192`}
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-3 text-center">
        Secure payment via Stripe. The teacher will confirm a time with you after payment.
      </p>
    </div>
  )
}
