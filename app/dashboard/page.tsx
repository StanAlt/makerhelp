import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_teacher')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/onboarding')

  // Admin always goes to admin
  if (profile.role === 'admin') redirect('/admin/teachers')

  // Teachers default to teacher dashboard
  if (profile.is_teacher) redirect('/dashboard/teacher')

  redirect('/dashboard/maker')
}
