import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { settingId, vote } = await request.json()

  if (!settingId || !['helpful', 'not_helpful'].includes(vote)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  // Check existing vote
  const { data: existing } = await supabase
    .from('setting_votes')
    .select('id, vote')
    .eq('setting_id', settingId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    if (existing.vote === vote) {
      // Remove vote
      await supabase.from('setting_votes').delete().eq('id', existing.id)
      return NextResponse.json({ action: 'removed' })
    } else {
      // Switch vote
      await supabase
        .from('setting_votes')
        .update({ vote })
        .eq('id', existing.id)
      return NextResponse.json({ action: 'switched' })
    }
  }

  // New vote
  await supabase
    .from('setting_votes')
    .insert({ setting_id: settingId, user_id: user.id, vote })

  return NextResponse.json({ action: 'added' })
}
