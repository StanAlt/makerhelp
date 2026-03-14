import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TeacherOnboardingForm } from '@/components/onboarding/teacher/TeacherOnboardingForm'

export default async function TeacherOnboardingPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // If already submitted, go to complete page
  const { data: existing } = await supabase
    .from('teacher_profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (existing) redirect('/onboarding/teacher/complete')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single()

  return (
    <TeacherOnboardingForm
      initialName={profile?.full_name ?? ''}
      userEmail={profile?.email ?? ''}
    />
  )
}
