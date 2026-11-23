import { NextResponse } from 'next/server'

// The previous endpoint captured one-time orders while describing Pro as monthly.
// Disable it so an old order cannot accidentally grant a recurring entitlement.
export async function POST() {
  return NextResponse.json(
    { error: 'The old one-time checkout is disabled. Pro subscriptions will open after recurring billing is verified.' },
    { status: 410 }
  )
}
