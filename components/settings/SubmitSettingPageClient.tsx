'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import SubmitSettingModal from './SubmitSettingModal'

export default function SubmitSettingPageClient() {
  const [showModal, setShowModal] = useState(true)

  return (
    <main className="min-h-screen bg-charcoal flex items-center justify-center px-4">
      {showModal ? (
        <SubmitSettingModal onClose={() => setShowModal(false)} />
      ) : (
        <div className="text-center">
          <h1 className="font-display text-3xl font-medium text-ivory mb-4">
            Submit Settings
          </h1>
          <Button onClick={() => setShowModal(true)}>Open Submission Form</Button>
        </div>
      )}
    </main>
  )
}
