import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe with the fix
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { 
  apiVersion: '2023-10-16' as any 
});

// Initialize Supabase Admin (needed to update user profiles)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    // 1. Verify the event came from Stripe
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // 2. Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      await handleSubscriptionCreated(session);
      break;
    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionCanceled(subscription);
      break;
  }

  return NextResponse.json({ received: true });
}

// --- Helper Functions ---

async function handleSubscriptionCreated(session: Stripe.Checkout.Session) {
  const userId = session.client_reference_id;
  const customerId = session.customer as string;
  const tier = session.metadata?.tier ?? 'apprentice';

  if (!userId) return; 

  // Update Supabase Profile
  await supabase
    .from('profiles')
    .update({ 
      stripe_customer_id: customerId, 
      tier: tier,
      subscription_status: 'active'
    })
    .eq('id', userId);
}

async function handleSubscriptionCanceled(sub: Stripe.Subscription) {
  // Downgrade to free if they cancel
  await supabase
    .from('profiles')
    .update({ subscription_status: 'canceled', tier: 'free' })
    .eq('stripe_customer_id', sub.customer as string);
}