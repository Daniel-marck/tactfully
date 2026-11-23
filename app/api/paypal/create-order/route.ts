import { NextResponse } from 'next/server'

// Tactfully does not currently offer verified recurring billing.
// Fail closed: do not create one-time PayPal orders that could be mistaken
// for monthly subscriptions. Re-enable only after subscription lifecycle,
// verified webhooks, cancellation, renewal, and entitlement expiry are tested.
export async function POST() {
  return NextResponse.json(
    { error: 'Pro billing is temporarily unavailable. No payment has been taken.' },
    { status: 503 }
  )
}
