'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveTeacher(teacherId: string) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') return

  await supabase
    .from('teacher_profiles')
    .update({ is_active: true })
    .eq('id', teacherId)

  revalidatePath('/admin/teachers')
  revalidatePath('/teachers')
}
