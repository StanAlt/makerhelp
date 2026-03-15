import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { settingId, reason, suggestedPower, suggestedSpeed, suggestedPasses, evidenceUrl } =
    await request.json()

  if (!settingId || !reason || reason.length < 20) {
    return NextResponse.json(
      { error: 'Setting ID and reason (min 20 chars) required' },
      { status: 400 }
    )
  }

  const { error } = await supabase.from('setting_challenges').insert({
    setting_id: settingId,
    challenger_id: user.id,
    reason,
    suggested_power: suggestedPower,
    suggested_speed: suggestedSpeed,
    suggested_passes: suggestedPasses,
    evidence_url: evidenceUrl,
  })

  if (error) {
    console.error('Challenge submit error:', error)
    return NextResponse.json({ error: 'Failed to submit challenge' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
