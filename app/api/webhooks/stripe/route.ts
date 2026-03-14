import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia' as any,
  })
}

function getServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: Request) {
  const stripe = getStripe()
  const supabase = getServiceSupabase()
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (e: any) {
    return NextResponse.json(
      { error: `Webhook error: ${e.message}` },
      { status: 400 }
    )
  }

  if (event.type === 'checkout.session.completed') {
    const checkout = event.data.object as Stripe.Checkout.Session
    const sessionId = checkout.metadata?.session_id
    if (!sessionId) return NextResponse.json({ received: true })

    // Fetch session to get details
    const { data: session } = await supabase
      .from('sessions')
      .select('id, duration_minutes, teacher_id, maker_id')
      .eq('id', sessionId)
      .single()

    if (!session) return NextResponse.json({ received: true })

    // Create Whereby room
    let wherebyRoomUrl: string | null = null
    let wherebyHostRoomUrl: string | null = null

    try {
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + 7) // Room expires in 7 days

      const wherebyRes = await fetch('https://api.whereby.dev/v1/meetings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.WHEREBY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endDate: endDate.toISOString(),
          fields: ['hostRoomUrl'],
        }),
      })
      const wherebyData = await wherebyRes.json()
      wherebyRoomUrl = wherebyData.roomUrl
      wherebyHostRoomUrl = wherebyData.hostRoomUrl
    } catch (e) {
      console.error('Whereby room creation failed:', e)
      // Don't fail the webhook — session still gets confirmed
    }

    // Update session to confirmed
    await supabase
      .from('sessions')
      .update({
        status: 'confirmed',
        stripe_payment_intent_id: checkout.payment_intent as string,
        whereby_room_url: wherebyRoomUrl,
        whereby_host_room_url: wherebyHostRoomUrl,
      })
      .eq('id', sessionId)
  }

  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    const sessionId = paymentIntent.metadata?.session_id
    if (sessionId) {
      await supabase
        .from('sessions')
        .update({ status: 'cancelled' })
        .eq('id', sessionId)
    }
  }

  return NextResponse.json({ received: true })
}
