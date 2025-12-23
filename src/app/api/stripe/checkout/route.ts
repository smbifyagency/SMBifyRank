// Stripe Checkout Session API
// POST /api/stripe/checkout - Create checkout session for upgrade
// Build fix: 2025-12-21

import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { stripe, STRIPE_PRICES } from '@/lib/stripe';
import { createServerSupabaseClient } from '@/lib/supabase-server';

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
                { error: 'Unauthorized. Please log in to continue.' },
                { status: 401 }
            );
        }

        // Get user profile for pre-filling checkout
        const { data: userProfile } = await supabase
            .from('users')
            .select('name, email')
            .eq('id', user.id)
            .single();

        // Get or create Stripe customer
        const { data: subscription } = await supabase
            .from('user_subscriptions')
            .select('stripe_customer_id')
            .eq('user_id', user.id)
            .single();

        let customerId = subscription?.stripe_customer_id;

        if (!customerId) {
            // Create Stripe customer with user details
            const customer = await stripe.customers.create({
                email: user.email,
                name: userProfile?.name || undefined,
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

        // Build checkout session options
        // All coupon/promotion code handling is done directly on Stripe's checkout page
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const sessionOptions: Stripe.Checkout.SessionCreateParams = {
            customer: customerId,
            mode: planType === 'monthly' ? 'subscription' : 'payment',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${baseUrl}/app?upgraded=true&plan=${planType}`,
            cancel_url: `${baseUrl}/pricing?canceled=true`,
            metadata: {
                user_id: user.id,
                plan_type: planType,
            },
            // Always allow customers to enter promotion codes on Stripe checkout page
            allow_promotion_codes: true,
            // Pre-fill customer email
            customer_update: {
                address: 'auto',
            },
        };

        // Create checkout session
        const session = await stripe.checkout.sessions.create(sessionOptions);

        return NextResponse.json({
            url: session.url,
            sessionId: session.id,
        });

    } catch (error) {
        console.error('Stripe checkout error:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session. Please try again.' },
            { status: 500 }
        );
    }
}
