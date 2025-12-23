// GET /api/debug/subscription-status
// Debug endpoint to check subscription status and configuration

import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { stripe } from '@/lib/stripe';

export async function GET() {
    const checks: Record<string, unknown> = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
    };

    // Check environment variables
    checks.envVars = {
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? '✅ Set' : '❌ Missing',
        STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ? '✅ Set' : '❌ Missing',
        STRIPE_MONTHLY_PRICE_ID: process.env.STRIPE_MONTHLY_PRICE_ID || '❌ Missing',
        STRIPE_LIFETIME_PRICE_ID: process.env.STRIPE_LIFETIME_PRICE_ID || '❌ Missing',
        SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY ? '✅ Set' : '❌ Missing',
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ Missing',
    };

    // Check Stripe connection
    try {
        if (stripe) {
            const balance = await stripe.balance.retrieve();
            checks.stripe = {
                connected: true,
                liveMode: balance.livemode,
            };
        } else {
            checks.stripe = { connected: false, error: 'Stripe not initialized' };
        }
    } catch (error) {
        checks.stripe = { connected: false, error: String(error) };
    }

    // Check Supabase connection
    try {
        const supabase = await createServerSupabaseClient();

        // Check auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError) {
            checks.supabase = {
                connected: true,
                authenticated: false,
                error: authError.message,
            };
        } else if (user) {
            // Get subscription for this user
            const { data: subscription, error: subError } = await supabase
                .from('user_subscriptions')
                .select('*')
                .eq('user_id', user.id)
                .single();

            checks.supabase = {
                connected: true,
                authenticated: true,
                userId: user.id,
                email: user.email,
            };

            if (subError) {
                checks.subscription = {
                    found: false,
                    error: subError.message,
                };
            } else {
                checks.subscription = {
                    found: true,
                    plan_type: subscription.plan_type,
                    status: subscription.status,
                    website_limit: subscription.website_limit,
                    websites_created: subscription.websites_created,
                    stripe_customer_id: subscription.stripe_customer_id ? 'Set' : 'Not set',
                    source: subscription.source,
                };
            }
        } else {
            checks.supabase = {
                connected: true,
                authenticated: false,
                error: 'No user session',
            };
        }
    } catch (error) {
        checks.supabase = { connected: false, error: String(error) };
    }

    // Instructions
    checks.webhookUrl = `${process.env.NEXTAUTH_URL || 'YOUR_DOMAIN'}/api/stripe/webhook`;
    checks.instructions = {
        step1: 'In Stripe Dashboard → Developers → Webhooks',
        step2: `Add endpoint: ${checks.webhookUrl}`,
        step3: 'Select events: checkout.session.completed',
        step4: 'Copy webhook signing secret to Vercel env vars as STRIPE_WEBHOOK_SECRET',
    };

    return NextResponse.json(checks, { status: 200 });
}
