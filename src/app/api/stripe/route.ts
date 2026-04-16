import { NextResponse } from 'next/server';

// Stripe checkout session creation
// TODO: Add real Stripe keys in .env.local
export async function POST(req: Request) {
  const { priceId } = await req.json();

  // Placeholder — replace with real Stripe SDK
  const PRICES: Record<string, { name: string; amount: number }> = {
    pro_monthly: { name: 'SubjectLine Pro', amount: 1400 },
    agency_monthly: { name: 'SubjectLine Agency', amount: 4900 },
  };

  const plan = PRICES[priceId];
  if (!plan) {
    return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
  }

  // In production: create Stripe checkout session
  // const session = await stripe.checkout.sessions.create({ ... });
  return NextResponse.json({
    url: `/dashboard?plan=${priceId}`,
    message: `Checkout for ${plan.name} ($${plan.amount / 100}/mo) — Stripe integration pending`,
  });
}
