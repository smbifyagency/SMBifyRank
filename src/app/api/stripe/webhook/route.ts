// Stripe Webhook Handler
// POST /api/stripe/webhook - Handle Stripe events

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { upgradePlan } from '@/lib/planLimits';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
    try {
        if (!stripe || !webhookSecret) {
            console.error('Stripe or webhook secret not configured');
            return NextResponse.json(
                { error: 'Webhook not configured' },
                { status: 500 }
            );
        }

        const body = await request.text();
        const headersList = await headers();
        const signature = headersList.get('stripe-signature');

        if (!signature) {
            return NextResponse.json(
                { error: 'No signature' },
                { status: 400 }
            );
        }

        // Verify webhook signature
        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err) {
            console.error('Webhook signature verification failed:', err);
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            );
        }

        // Handle events
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.metadata?.user_id;
                const planType = session.metadata?.plan_type as 'monthly' | 'lifetime';

                if (userId && planType) {
                    console.log(`Upgrading user ${userId} to ${planType} plan`);

                    await upgradePlan(
                        userId,
                        planType,
                        session.customer as string,
                        session.subscription as string || undefined
                    );
                }
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                // Find user by Stripe customer ID and downgrade to free
                const supabase = await createServerSupabaseClient();

                const { data: userSub } = await supabase
                    .from('user_subscriptions')
                    .select('user_id')
                    .eq('stripe_customer_id', customerId)
                    .single();

                if (userSub) {
                    console.log(`Downgrading user ${userSub.user_id} to free plan`);

                    await supabase
                        .from('user_subscriptions')
                        .update({
                            plan_type: 'free',
                            status: 'canceled',
                            website_limit: 1,
                            stripe_subscription_id: null,
                        })
                        .eq('user_id', userSub.user_id);
                }
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice;
                const customerId = invoice.customer as string;

                // Mark subscription as past_due
                const supabase = await createServerSupabaseClient();

                await supabase
                    .from('user_subscriptions')
                    .update({ status: 'past_due' })
                    .eq('stripe_customer_id', customerId);

                console.log(`Payment failed for customer ${customerId}`);
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}
