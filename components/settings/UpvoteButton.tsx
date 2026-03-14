'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function UpvoteButton({
  settingId,
  initialUpvotes,
  initialHasUpvoted,
  userId,
}: {
  settingId: string
  initialUpvotes: number
  initialHasUpvoted: boolean
  userId?: string
}) {
  const router = useRouter()
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [hasUpvoted, setHasUpvoted] = useState(initialHasUpvoted)
  const [loading, setLoading] = useState(false)

  async function handleUpvote() {
    if (!userId) {
      router.push('/login')
      return
    }
    if (loading) return
    setLoading(true)

    const res = await fetch('/api/settings/upvote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settingId, remove: hasUpvoted }),
    })

    if (res.ok) {
      setUpvotes((v) => (hasUpvoted ? v - 1 : v + 1))
      setHasUpvoted((v) => !v)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleUpvote}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
        hasUpvoted
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
      }`}
    >
      <span>&uarr;</span>
      <span className="font-medium">{upvotes}</span>
    </button>
  )
}
