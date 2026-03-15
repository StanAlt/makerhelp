import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSettingsClient from '@/components/settings/AdminSettingsClient'

export const metadata = {
  title: 'Admin — Settings Review — MakerHelp',
}

export default async function AdminSettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  // Fetch pending submissions
  const { data: pending } = await supabase
    .from('settings')
    .select('*, machines(*), materials(*)')
    .eq('approved', false)
    .order('created_at', { ascending: false })

  // Fetch open challenges
  const { data: challenges } = await supabase
    .from('setting_challenges')
    .select('*, settings(*, machines(*), materials(*))')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-charcoal">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="font-display text-3xl font-medium text-ivory mb-8">
          Settings Review
        </h1>
        <AdminSettingsClient
          pending={pending ?? []}
          challenges={challenges ?? []}
          adminId={user.id}
        />
      </div>
    </main>
  )
}
