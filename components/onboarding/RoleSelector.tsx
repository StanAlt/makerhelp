'use client'

import { useState } from 'react'
import { setUserRole } from '@/app/onboarding/actions'

export default function RoleSelector() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSelect = async (role: 'maker' | 'teacher') => {
    setLoading(role)
    await setUserRole(role)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <button
        onClick={() => handleSelect('maker')}
        disabled={loading !== null}
        className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all text-left disabled:opacity-50"
      >
        <div className="text-3xl mb-3">&#128295;</div>
        <h2 className="text-xl font-bold mb-2">I&apos;m a Maker</h2>
        <p className="text-gray-600 text-sm mb-4">
          I have a laser engraver or CNC and need expert guidance
        </p>
        <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
          {loading === 'maker' ? 'Setting up...' : 'Get Help'}
        </span>
      </button>

      <button
        onClick={() => handleSelect('teacher')}
        disabled={loading !== null}
        className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all text-left disabled:opacity-50"
      >
        <div className="text-3xl mb-3">&#127891;</div>
        <h2 className="text-xl font-bold mb-2">I&apos;m an Expert</h2>
        <p className="text-gray-600 text-sm mb-4">
          I&apos;m experienced with laser machines and want to earn money sharing my knowledge
        </p>
        <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
          {loading === 'teacher' ? 'Setting up...' : 'Start Teaching'}
        </span>
      </button>
    </div>
  )
}
