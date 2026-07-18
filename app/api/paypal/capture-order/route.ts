import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const PAYPAL_API =
  process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'

const EXPECTED_AMOUNT = '12.00'

async function getPayPalAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64')

  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) throw new Error('Failed to authenticate with PayPal')
  const data = await res.json()
  return data.access_token as string
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'You need to sign in first.' }, { status: 401 })
    }

    const { orderID } = await req.json()
    if (!orderID) {
      return NextResponse.json({ error: 'Missing orderID.' }, { status: 400 })
    }

    const accessToken = await getPayPalAccessToken()

    // Ask PayPal directly whether this order actually completed -- never
    // trust the browser's word that "payment succeeded".
    const captureRes = await fetch(
      `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    const captureData = await captureRes.json()

    if (!captureRes.ok || captureData.status !== 'COMPLETED') {
      console.error('❌ PayPal capture failed or incomplete:', captureData)
      return NextResponse.json({ error: 'Payment was not completed.' }, { status: 402 })
    }

    // Verify: the order belongs to THIS logged-in user (custom_id set at
    // create-order time), and the amount matches what we expect to charge.
    const purchaseUnit = captureData.purchase_units?.[0]
    const paidCustomId = purchaseUnit?.custom_id
    const capturedAmount =
      purchaseUnit?.payments?.captures?.[0]?.amount?.value

    if (paidCustomId !== user.id) {
      console.error('❌ PayPal order user mismatch', { paidCustomId, userId: user.id })
      return NextResponse.json({ error: 'Order does not match this account.' }, { status: 403 })
    }

    if (capturedAmount !== EXPECTED_AMOUNT) {
      console.error('❌ PayPal captured amount mismatch', { capturedAmount })
      return NextResponse.json({ error: 'Payment amount mismatch.' }, { status: 402 })
    }

    // Only now, after independently verifying with PayPal, upgrade the
    // account -- using the service_role key so RLS doesn't block it.
    const admin = createAdminClient()
    const { error: updateError } = await admin
      .from('profiles')
      .update({ plan: 'pro', paypal_order_id: orderID })
      .eq('id', user.id)

    if (updateError) {
      // Likely the unique index on paypal_order_id -- this order was
      // already used to upgrade an account once before.
      console.error('❌ Failed to upgrade profile:', updateError)
      return NextResponse.json(
        { error: 'Could not apply upgrade. Contact support if you were charged.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, plan: 'pro' })
  } catch (error: any) {
    console.error('❌ capture-order route crashed:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
