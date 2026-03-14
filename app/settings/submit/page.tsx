import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SettingsSubmitForm } from '@/components/settings/SettingsSubmitForm'

export default async function SubmitSettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirectTo=/settings/submit')

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Submit Laser Settings</h1>
      <p className="text-gray-600 mb-8">
        Share settings that worked for you. Help other makers avoid trial and error.
      </p>
      <SettingsSubmitForm userId={user.id} />
    </main>
  )
}
