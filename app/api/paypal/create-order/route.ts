import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const PAYPAL_API =
  process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'

const PRO_PRICE_USD = '12.00' // Fixed server-side. Never read this from the client request.

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

export async function POST() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'You need to sign in first.' }, { status: 401 })
    }

    const accessToken = await getPayPalAccessToken()

    const orderRes = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            // custom_id lets us tie the PayPal order back to a specific
            // Supabase user during capture, without trusting anything
            // the browser sends us at capture time.
            custom_id: user.id,
            amount: {
              currency_code: 'USD',
              value: PRO_PRICE_USD,
            },
            description: 'Tactfully Pro -- monthly',
          },
        ],
      }),
    })

    if (!orderRes.ok) {
      const err = await orderRes.json()
      console.error('❌ PayPal create-order failed:', err)
      return NextResponse.json({ error: 'Could not start checkout.' }, { status: 502 })
    }

    const order = await orderRes.json()
    return NextResponse.json({ id: order.id })
  } catch (error: any) {
    console.error('❌ create-order route crashed:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
