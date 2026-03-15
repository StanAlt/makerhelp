'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  settingId: string
  counts: { helpful: number; not_helpful: number }
  userVote?: string
  userId?: string
}

export default function VoteButtons({ settingId, counts, userVote, userId }: Props) {
  const router = useRouter()
  const [helpful, setHelpful] = useState(counts.helpful)
  const [notHelpful, setNotHelpful] = useState(counts.not_helpful)
  const [currentVote, setCurrentVote] = useState(userVote)
  const [loading, setLoading] = useState(false)

  async function vote(type: 'helpful' | 'not_helpful') {
    if (!userId) {
      router.push('/login')
      return
    }
    if (loading) return
    setLoading(true)

    const res = await fetch('/api/settings/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settingId, vote: type }),
    })

    if (res.ok) {
      const data = await res.json()
      if (data.action === 'removed') {
        if (type === 'helpful') setHelpful((v) => v - 1)
        else setNotHelpful((v) => v - 1)
        setCurrentVote(undefined)
      } else if (data.action === 'switched') {
        if (type === 'helpful') {
          setHelpful((v) => v + 1)
          setNotHelpful((v) => v - 1)
        } else {
          setHelpful((v) => v - 1)
          setNotHelpful((v) => v + 1)
        }
        setCurrentVote(type)
      } else {
        if (type === 'helpful') setHelpful((v) => v + 1)
        else setNotHelpful((v) => v + 1)
        setCurrentVote(type)
      }
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => vote('helpful')}
        disabled={loading}
        className={`flex items-center gap-1 px-2 py-1 rounded-btn border text-xs font-ui transition-colors duration-200 ${
          currentVote === 'helpful'
            ? 'bg-forest-mid border-forest-light text-ivory'
            : 'border-steel text-sage hover:text-ivory hover:border-ivory'
        }`}
      >
        <span>&#9650;</span>
        <span>{helpful}</span>
      </button>
      <button
        onClick={() => vote('not_helpful')}
        disabled={loading}
        className={`flex items-center gap-1 px-2 py-1 rounded-btn border text-xs font-ui transition-colors duration-200 ${
          currentVote === 'not_helpful'
            ? 'bg-forest-mid border-forest-light text-ivory'
            : 'border-steel text-sage hover:text-ivory hover:border-ivory'
        }`}
      >
        <span>&#9660;</span>
        <span>{notHelpful}</span>
      </button>
    </div>
  )
}
