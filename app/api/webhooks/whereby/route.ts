import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // Whereby webhook handler — implemented in Step 8
  return NextResponse.json({ received: true })
}
