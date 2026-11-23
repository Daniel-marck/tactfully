import { NextResponse } from 'next/server'

// Pro checkout is intentionally unavailable until recurring billing and seller
// eligibility have been verified. Do not accept the previous one-time order flow.
export async function POST() {
  return NextResponse.json(
    { error: 'Pro subscriptions are not available yet. Please use the free plan for now.' },
    { status: 503 }
  )
}
