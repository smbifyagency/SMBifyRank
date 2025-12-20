// Stripe Checkout Session API
// POST /api/stripe/checkout - Create checkout session for upgrade

import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { stripe, STRIPE_PRICES } from '@/lib/stripe';

export async function POST(request: Request) {
    try {
        if (!stripe) {
            return NextResponse.json(
                { error: 'Stripe is not configured' },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { planType } = body; // 'monthly' or 'lifetime'

        if (!planType || !['monthly', 'lifetime'].includes(planType)) {
            return NextResponse.json(
                { error: 'Invalid plan type' },
                { status: 400 }
            );
        }

        // Get authenticated user
        const supabase = await createServerSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get or create Stripe customer
        const { data: subscription } = await supabase
            .from('user_subscriptions')
            .select('stripe_customer_id')
            .eq('user_id', user.id)
            .single();

        let customerId = subscription?.stripe_customer_id;

        if (!customerId) {
            // Create Stripe customer
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: {
                    user_id: user.id,
                },
            });
            customerId = customer.id;

            // Save customer ID to database
            await supabase
                .from('user_subscriptions')
                .update({ stripe_customer_id: customerId })
                .eq('user_id', user.id);
        }

        // Get the price ID
        const priceId = planType === 'monthly' ? STRIPE_PRICES.monthly : STRIPE_PRICES.lifetime;

        if (!priceId) {
            return NextResponse.json(
                { error: 'Price not configured. Please set STRIPE_MONTHLY_PRICE_ID or STRIPE_LIFETIME_PRICE_ID.' },
                { status: 500 }
            );
        }

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: planType === 'monthly' ? 'subscription' : 'payment',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/app?upgraded=true`,
            cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/pricing?canceled=true`,
            metadata: {
                user_id: user.id,
                plan_type: planType,
            },
        });

        return NextResponse.json({
            url: session.url,
            sessionId: session.id,
        });

    } catch (error) {
        console.error('Stripe checkout error:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
