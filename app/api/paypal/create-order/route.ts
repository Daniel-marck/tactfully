import { NextResponse } from 'next/server'

// Tactfully does not currently offer verified recurring billing.
// Fail closed: do not create one-time PayPal orders that could be mistaken
// for monthly subscriptions.
export async function POST() {
  return NextResponse.json(
    { error: 'Pro billing is temporarily unavailable. No payment has been taken.' },
    { status: 503 }
  )
}
