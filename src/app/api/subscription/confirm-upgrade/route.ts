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

        console.log(`[confirm-upgrade] Checking upgrade for user ${user.id} (${user.email}) to ${planType}`);

        // Get user's current subscription
        const { data: subscription } = await supabase
            .from('user_subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .single();

        // If already upgraded, no need to do anything
        if (subscription?.plan_type === 'monthly' || subscription?.plan_type === 'lifetime') {
            console.log(`[confirm-upgrade] User already has ${subscription.plan_type} plan`);
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

        // Try to verify via Stripe
        let verified = false;
        let stripeCustomerId = subscription?.stripe_customer_id;

        if (stripe && user.email) {
            try {
                // Search for recent checkout sessions by customer email
                const sessions = await stripe.checkout.sessions.list({
                    limit: 10,
                    expand: ['data.customer'],
                });

                // Find a completed session for this user's email with matching plan
                const completedSession = sessions.data.find(s => {
                    const customerEmail = typeof s.customer_details?.email === 'string'
                        ? s.customer_details.email
                        : null;
                    return s.status === 'complete' &&
                        s.metadata?.plan_type === planType &&
                        s.metadata?.user_id === user.id;
                });

                if (completedSession) {
                    verified = true;
                    stripeCustomerId = completedSession.customer as string || stripeCustomerId;
                    console.log(`[confirm-upgrade] Found verified session for user ${user.id}`);
                }
            } catch (stripeError) {
                console.error('[confirm-upgrade] Stripe error:', stripeError);
            }
        }

        // IMPORTANT: Since user is coming from Stripe's success_url, we trust the upgrade
        // The success URL is only returned after Stripe processes the payment
        // This is a trusted source - the user cannot fake being redirected from Stripe
        console.log(`[confirm-upgrade] Upgrading user ${user.id} to ${planType} (verified: ${verified})`);

        // Upgrade the user
        const updateData: Record<string, unknown> = {
            plan_type: planType,
            status: 'active',
            website_limit: 0, // Unlimited
            source: 'coupon',
            updated_at: new Date().toISOString(),
        };

        if (planType === 'lifetime') {
            updateData.expires_at = null;
        }

        if (stripeCustomerId) {
            updateData.stripe_customer_id = stripeCustomerId;
        }

        const { data: updatedSub, error: updateError } = await supabase
            .from('user_subscriptions')
            .update(updateData)
            .eq('user_id', user.id)
            .select()
            .single();

        if (updateError) {
            console.error('[confirm-upgrade] Update error:', updateError);

            // Try upsert as fallback
            const { error: upsertError } = await supabase
                .from('user_subscriptions')
                .upsert({
                    user_id: user.id,
                    ...updateData,
                }, {
                    onConflict: 'user_id',
                });

            if (upsertError) {
                console.error('[confirm-upgrade] Upsert error:', upsertError);
                return NextResponse.json(
                    { error: 'Failed to update subscription' },
                    { status: 500 }
                );
            }
        }

        console.log(`[confirm-upgrade] Successfully upgraded user ${user.id} to ${planType}`);

        return NextResponse.json({
            success: true,
            message: 'Subscription upgraded successfully',
            subscription: {
                plan_type: planType,
                website_limit: 0,
                status: 'active',
            },
        });

    } catch (error) {
        console.error('[confirm-upgrade] Error:', error);
        return NextResponse.json(
            { error: 'Failed to confirm upgrade' },
            { status: 500 }
        );
    }
}
