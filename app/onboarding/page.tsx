import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import RoleSelector from '@/components/onboarding/RoleSelector'

export default async function OnboardingPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'teacher') redirect('/dashboard/teacher')
  if (profile?.role === 'maker') redirect('/dashboard/maker')
  if (profile?.role === 'admin') redirect('/admin/teachers')

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome to MakerHelp</h1>
        <p className="text-gray-500 text-center mb-8">How would you like to use MakerHelp?</p>
        <RoleSelector />
      </div>
    </main>
  )
}
