import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia' as any,
  })
}

export async function POST(request: Request) {
  try {
    const stripe = getStripe()
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      teacherId,
      makerId,
      durationMinutes,
      amountCents,
      platformFeeCents,
      teacherPayoutCents,
      problemDescription,
      machineType,
    } = body

    // Validate user is the maker
    if (user.id !== makerId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Fetch teacher's Stripe account
    const { data: teacherProfile } = await supabase
      .from('teacher_profiles')
      .select('stripe_account_id, stripe_onboarding_complete, profiles!inner(full_name)')
      .eq('id', teacherId)
      .single()

    if (!teacherProfile?.stripe_onboarding_complete || !teacherProfile?.stripe_account_id) {
      return NextResponse.json(
        { error: 'Teacher payment setup incomplete' },
        { status: 400 }
      )
    }

    // Create pending session in DB
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert({
        teacher_id: teacherId,
        maker_id: makerId,
        status: 'pending',
        duration_minutes: durationMinutes,
        amount_cents: amountCents,
        platform_fee_cents: platformFeeCents,
        teacher_payout_cents: teacherPayoutCents,
        problem_description: problemDescription,
        machine_type: machineType,
      })
      .select('id')
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
    }

    // Create Stripe Checkout Session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!
    const teacherName = (teacherProfile.profiles as any)?.full_name ?? 'Expert'

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${durationMinutes}-Minute Session with ${teacherName}`,
              description: problemDescription?.slice(0, 200),
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: platformFeeCents,
        transfer_data: {
          destination: teacherProfile.stripe_account_id,
        },
        metadata: {
          session_id: session.id,
          teacher_id: teacherId,
          maker_id: makerId,
        },
      },
      success_url: `${appUrl}/sessions/${session.id}?payment=success`,
      cancel_url: `${appUrl}/book/${teacherId}?cancelled=true`,
      metadata: {
        session_id: session.id,
      },
    })

    return NextResponse.json({ checkoutUrl: checkoutSession.url })
  } catch (e: any) {
    console.error('Session create error:', e)
    return NextResponse.json(
      { error: e.message ?? 'Server error' },
      { status: 500 }
    )
  }
}
