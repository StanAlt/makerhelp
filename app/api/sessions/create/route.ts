import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // Session creation — implemented in Step 7
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}
