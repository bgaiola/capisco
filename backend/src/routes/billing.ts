import { Router, raw } from 'express'
import { z } from 'zod'
import type Stripe from 'stripe'
import { queryOne, execute, type DbUser } from '../db/index.js'
import { requireAuth } from '../auth/middleware.js'
import { config } from '../config.js'
import { getStripe, priceIdForTier, tierForPriceId } from '../services/stripe.js'

const router = Router()

const CheckoutBody = z.object({
  tier: z.enum(['basic', 'pro']),
})

router.post('/billing/checkout', requireAuth, async (req, res) => {
  const stripe = getStripe()
  if (!stripe) {
    res.status(503).json({ error: 'billing_disabled', message: 'Billing is not configured yet.' })
    return
  }
  const parsed = CheckoutBody.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'invalid_input', message: 'Choose a valid plan.' })
    return
  }
  const priceId = priceIdForTier(parsed.data.tier)
  if (!priceId) {
    res.status(503).json({ error: 'billing_disabled', message: `${parsed.data.tier} price not configured.` })
    return
  }

  const user = await queryOne<DbUser>('SELECT * FROM users WHERE id = $1', [req.user!.id])
  if (!user) {
    res.status(404).json({ error: 'not_found' })
    return
  }
  const userId = Number(user.id)

  let customerId = user.stripe_customer_id
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
      metadata: { userId: String(userId) },
    })
    customerId = customer.id
    await execute('UPDATE users SET stripe_customer_id = $1, updated_at = $2 WHERE id = $3', [
      customerId,
      Date.now(),
      userId,
    ])
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${config.appUrl}/account?checkout=success`,
    cancel_url: `${config.appUrl}/pricing?checkout=canceled`,
    allow_promotion_codes: true,
    client_reference_id: String(userId),
    subscription_data: {
      metadata: { userId: String(userId), tier: parsed.data.tier },
    },
  })

  res.json({ url: session.url })
})

router.post('/billing/portal', requireAuth, async (req, res) => {
  const stripe = getStripe()
  if (!stripe) {
    res.status(503).json({ error: 'billing_disabled' })
    return
  }
  const user = await queryOne<DbUser>('SELECT * FROM users WHERE id = $1', [req.user!.id])
  if (!user?.stripe_customer_id) {
    res.status(400).json({ error: 'no_customer', message: 'No billing account yet.' })
    return
  }
  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripe_customer_id,
    return_url: `${config.appUrl}/account`,
  })
  res.json({ url: session.url })
})

export { router as billingRoute }

// Webhook handler — Express raw body required for signature validation.
export const stripeWebhookHandler = [
  raw({ type: 'application/json' }),
  async (req: import('express').Request, res: import('express').Response) => {
    const stripe = getStripe()
    if (!stripe || !config.stripeWebhookSecret) {
      res.status(503).json({ error: 'webhook_disabled' })
      return
    }
    const sig = req.header('stripe-signature')
    if (!sig) {
      res.status(400).send('Missing signature')
      return
    }
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(req.body as Buffer, sig, config.stripeWebhookSecret)
    } catch (err) {
      console.error('Stripe webhook signature error:', err)
      res.status(400).send('Bad signature')
      return
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session
          const userId = Number(session.client_reference_id ?? session.metadata?.userId)
          if (!userId) break
          if (typeof session.subscription === 'string') {
            const sub = await stripe.subscriptions.retrieve(session.subscription)
            await applySubscription(userId, sub)
          }
          break
        }
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted': {
          const sub = event.data.object as Stripe.Subscription
          const userId = Number(sub.metadata?.userId)
          if (!userId) break
          await applySubscription(userId, sub)
          break
        }
        default:
          break
      }
      res.json({ received: true })
    } catch (err) {
      console.error('Stripe webhook handler error:', err)
      res.status(500).json({ error: 'webhook_failed' })
    }
  },
]

async function applySubscription(userId: number, sub: Stripe.Subscription) {
  const item = sub.items.data[0]
  const priceId = item?.price?.id
  const tier = sub.status === 'canceled' ? 'free' : tierForPriceId(priceId)
  const status: 'active' | 'canceled' | 'past_due' =
    sub.status === 'active' || sub.status === 'trialing'
      ? 'active'
      : sub.status === 'past_due' || sub.status === 'unpaid'
        ? 'past_due'
        : 'canceled'

  await execute(
    `UPDATE users SET tier = $1, status = $2, stripe_subscription_id = $3, updated_at = $4 WHERE id = $5`,
    [tier, status, sub.id, Date.now(), userId],
  )
}
