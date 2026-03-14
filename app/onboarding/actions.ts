'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function setUserRole(role: 'maker' | 'teacher') {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  await supabase
    .from('profiles')
    .update({ role })
    .eq('id', user.id)

  redirect(role === 'teacher' ? '/onboarding/teacher' : '/dashboard/maker')
}
