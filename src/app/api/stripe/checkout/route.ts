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
        const { planType, couponCode } = body; // 'monthly' or 'lifetime', optional coupon

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

        // Validate coupon if provided
        let discounts: { coupon?: string; promotion_code?: string }[] | undefined;
        if (couponCode) {
            try {
                // First try as a promotion code
                const promoCodes = await stripe.promotionCodes.list({
                    code: couponCode,
                    active: true,
                    limit: 1,
                });

                if (promoCodes.data.length > 0) {
                    discounts = [{ promotion_code: promoCodes.data[0].id }];
                } else {
                    // Try as a direct coupon ID
                    const coupon = await stripe.coupons.retrieve(couponCode);
                    if (coupon && coupon.valid) {
                        discounts = [{ coupon: coupon.id }];
                    }
                }
            } catch {
                // Coupon not found or invalid - continue without discount
                console.log(`Coupon "${couponCode}" not found or invalid`);
            }
        }

        // Build checkout session options
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
            cancel_url: `${baseUrl}/checkout?plan=${planType}&canceled=true`,
            metadata: {
                user_id: user.id,
                plan_type: planType,
            },
            // Allow customers to enter promotion codes on Stripe checkout page
            allow_promotion_codes: !discounts,
            // Pre-fill customer email
            customer_update: {
                address: 'auto',
            },
        };

        // Apply discounts if we have them
        if (discounts) {
            sessionOptions.discounts = discounts;
        }

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
