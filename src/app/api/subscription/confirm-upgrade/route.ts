// POST /api/subscription/confirm-upgrade
// Fallback endpoint to confirm upgrade when webhook might not fire
// Called after returning from Stripe checkout with upgraded=true

import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
    try {
        const supabase = await createServerSupabaseClient();

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
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

        // Get user's current subscription
        const { data: subscription } = await supabase
            .from('user_subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .single();

        // If already upgraded, no need to do anything
        if (subscription?.plan_type === 'monthly' || subscription?.plan_type === 'lifetime') {
            console.log(`[confirm-upgrade] User ${user.id} already has ${subscription.plan_type} plan`);
            return NextResponse.json({
                success: true,
                message: 'Already upgraded',
                subscription: {
                    plan_type: subscription.plan_type,
                    website_limit: 0,
                    status: subscription.status,
                },
            });
        }

        // Check Stripe for actual payment
        if (stripe && subscription?.stripe_customer_id) {
            try {
                // Get recent checkout sessions for this customer
                const sessions = await stripe.checkout.sessions.list({
                    customer: subscription.stripe_customer_id,
                    limit: 5,
                });

                // Find completed session for requested plan type
                const completedSession = sessions.data.find(
                    s => s.status === 'complete' && s.metadata?.plan_type === planType
                );

                if (completedSession) {
                    console.log(`[confirm-upgrade] Found completed session for user ${user.id}, upgrading to ${planType}`);

                    // Upgrade the user
                    const { error: updateError } = await supabase
                        .from('user_subscriptions')
                        .update({
                            plan_type: planType,
                            status: 'active',
                            website_limit: 0, // Unlimited
                            source: 'direct',
                            updated_at: new Date().toISOString(),
                            expires_at: planType === 'lifetime' ? null : undefined,
                        })
                        .eq('user_id', user.id);

                    if (updateError) {
                        console.error('[confirm-upgrade] Update error:', updateError);
                        return NextResponse.json(
                            { error: 'Failed to update subscription' },
                            { status: 500 }
                        );
                    }

                    return NextResponse.json({
                        success: true,
                        message: 'Subscription upgraded successfully',
                        subscription: {
                            plan_type: planType,
                            website_limit: 0,
                            status: 'active',
                        },
                    });
                }
            } catch (stripeError) {
                console.error('[confirm-upgrade] Stripe error:', stripeError);
                // Continue without Stripe verification
            }
        }

        // If no Stripe customer or couldn't verify, check if upgrade was requested
        // This is a fallback - in production, you'd want more verification
        console.log(`[confirm-upgrade] No completed session found for user ${user.id}, plan ${planType}`);

        return NextResponse.json({
            success: false,
            error: 'Could not verify payment. Please contact support if you completed payment.',
        });

    } catch (error) {
        console.error('[confirm-upgrade] Error:', error);
        return NextResponse.json(
            { error: 'Failed to confirm upgrade' },
            { status: 500 }
        );
    }
}
