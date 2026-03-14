import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia' as any,
  })
}

export default async function StripeCompletePage() {
  const stripe = getStripe()
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: teacherProfile } = await supabase
    .from('teacher_profiles')
    .select('stripe_account_id')
    .eq('id', user.id)
    .single()

  if (teacherProfile?.stripe_account_id) {
    const account = await stripe.accounts.retrieve(teacherProfile.stripe_account_id)
    if (account.details_submitted) {
      await supabase
        .from('teacher_profiles')
        .update({ stripe_onboarding_complete: true })
        .eq('id', user.id)
    }
  }

  redirect('/dashboard/teacher')
}
