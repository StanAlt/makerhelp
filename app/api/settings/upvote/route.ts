import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { settingId, remove } = await request.json()

  if (remove) {
    await supabase
      .from('settings_upvotes')
      .delete()
      .eq('user_id', user.id)
      .eq('setting_id', settingId)
  } else {
    await supabase
      .from('settings_upvotes')
      .insert({ user_id: user.id, setting_id: settingId })
  }

  return NextResponse.json({ success: true })
}
