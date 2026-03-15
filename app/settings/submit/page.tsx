import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SubmitSettingPageClient from '@/components/settings/SubmitSettingPageClient'

export default async function SubmitSettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirectTo=/settings/submit')

  return <SubmitSettingPageClient />
}
