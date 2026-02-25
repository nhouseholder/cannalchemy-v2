// Cloudflare Pages Function: Handle Stripe Webhook Events
// POST /api/stripe-webhook
// Requires nodejs_compat flag in wrangler.toml for node:crypto

import { createHmac } from 'node:crypto'

function constructEvent(payload, sigHeader, secret) {
  const elements = sigHeader.split(',')
  const timestamp = elements.find(e => e.startsWith('t='))?.split('=')[1]
  const signature = elements.find(e => e.startsWith('v1='))?.split('=')[1]

  if (!timestamp || !signature) throw new Error('Invalid signature header')

  const signedPayload = `${timestamp}.${payload}`
  const expectedSig = createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex')

  if (signature !== expectedSig) throw new Error('Signature mismatch')

  return JSON.parse(payload)
}

async function updateProfile(userId, updates, env) {
  const SUPABASE_URL = env.VITE_SUPABASE_URL
  const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error('Supabase not configured for webhook')
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
    method: 'PATCH',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(updates),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Profile update failed: ${res.status} ${body}`)
  }
}

export async function onRequestPost(context) {
  const { request, env } = context

  const WEBHOOK_SECRET = env.STRIPE_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) {
    return new Response('Webhook secret not configured', { status: 500 })
  }

  try {
    // Must read raw text body for HMAC verification (not JSON)
    const rawBody = await request.text()
    const sig = request.headers.get('stripe-signature')
    const stripeEvent = constructEvent(rawBody, sig, WEBHOOK_SECRET)

    console.log(`Stripe webhook: ${stripeEvent.type}`)

    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object
        const userId = session.metadata?.supabase_user_id
        const customerId = session.customer

        if (userId) {
          await updateProfile(userId, {
            subscription_status: 'active',
            stripe_customer_id: customerId,
          }, env)
          console.log(`Activated premium for user ${userId}`)
        }
        break
      }

      case 'customer.subscription.updated': {
        const sub = stripeEvent.data.object
        const userId = sub.metadata?.supabase_user_id
        if (userId) {
          const status = sub.status === 'active' ? 'active' : 'canceled'
          const endDate = sub.current_period_end
            ? new Date(sub.current_period_end * 1000).toISOString()
            : null

          await updateProfile(userId, {
            subscription_status: status,
            subscription_end: endDate,
          }, env)
          console.log(`Updated subscription for user ${userId}: ${status}`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const sub = stripeEvent.data.object
        const userId = sub.metadata?.supabase_user_id
        if (userId) {
          await updateProfile(userId, {
            subscription_status: 'canceled',
            subscription_end: new Date().toISOString(),
          }, env)
          console.log(`Canceled subscription for user ${userId}`)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Webhook error:', err)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }
}
