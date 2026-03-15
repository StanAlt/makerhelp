import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { action, id } = body

  switch (action) {
    case 'approve_setting': {
      const { error } = await supabase
        .from('settings')
        .update({
          approved: true,
          approved_by: user.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true })
    }

    case 'reject_setting': {
      const { error } = await supabase.from('settings').delete().eq('id', id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true })
    }

    case 'accept_challenge': {
      const { settingId, suggestedPower, suggestedSpeed, suggestedPasses } = body

      // Update the original setting with suggested values
      const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
      if (suggestedPower != null) updates.power_pct = suggestedPower
      if (suggestedSpeed != null) updates.speed_mmsec = suggestedSpeed
      if (suggestedPasses != null) updates.passes = suggestedPasses

      await supabase.from('settings').update(updates).eq('id', settingId)

      // Mark challenge as accepted
      await supabase
        .from('setting_challenges')
        .update({
          status: 'accepted',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', id)

      return NextResponse.json({ success: true })
    }

    case 'reject_challenge': {
      await supabase
        .from('setting_challenges')
        .update({
          status: 'rejected',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', id)
      return NextResponse.json({ success: true })
    }

    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  }
}
