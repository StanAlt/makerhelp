import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // Stripe webhook handler — implemented in Step 7
  return NextResponse.json({ received: true })
}
