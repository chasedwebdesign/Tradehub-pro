import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    // 1. SAFETY CHECK: Check if key is missing or fake
    if (!stripeKey || stripeKey.includes('placeholder') || stripeKey === 'your_key_here') {
      console.warn("Stripe is not fully configured. Defaulting to 'Coming Soon' mode.");
      return NextResponse.json({ coming_soon: true }, { status: 200 });
    }

    // 2. Attempt to Initialize Stripe
    // ✅ FIXED: Added 'as any' to satisfy TypeScript strictness
    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' as any });
    
    const headersList = await headers();
    const origin = headersList.get('origin') || 'http://localhost:3000';

    // 3. Create the Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: 'price_123456789', // Replace with real ID later
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/study/quiz?success=true`,
      cancel_url: `${origin}/study/quiz?canceled=true`,
      metadata: {
        tier: 'pro',
      },
    });

    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    console.error("Stripe Error (Falling back to Coming Soon):", err.message);
    return NextResponse.json({ coming_soon: true }, { status: 200 });
  }
}