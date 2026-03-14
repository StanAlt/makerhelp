'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Stripe from 'stripe'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia' as any,
  })
}

export async function createStripeConnectLink() {
  const stripe = getStripe()
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: teacherProfile } = await supabase
    .from('teacher_profiles')
    .select('stripe_account_id')
    .eq('id', user.id)
    .single()

  let accountId = teacherProfile?.stripe_account_id

  // Create Stripe Connect account if doesn't exist
  if (!accountId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', user.id)
      .single()

    const account = await stripe.accounts.create({
      type: 'express',
      email: profile?.email ?? undefined,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
      metadata: { user_id: user.id },
    })
    accountId = account.id

    await supabase
      .from('teacher_profiles')
      .update({ stripe_account_id: accountId })
      .eq('id', user.id)
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${appUrl}/dashboard/teacher/stripe`,
    return_url: `${appUrl}/dashboard/teacher/stripe/complete`,
    type: 'account_onboarding',
  })

  redirect(accountLink.url)
}
