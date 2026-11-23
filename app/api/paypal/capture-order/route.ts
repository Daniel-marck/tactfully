import { NextResponse } from 'next/server'

// Disable capture until recurring subscriptions and verified webhook-based
// entitlement management are implemented and tested.
export async function POST() {
  return NextResponse.json(
    { error: 'Payment capture is disabled while Pro billing is being prepared.' },
    { status: 410 }
  )
}
