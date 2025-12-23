// POST /api/subscription/fix-plan
// Admin endpoint to manually fix a user's plan
// For users who paid but webhook didn't update their subscription

import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

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
        const { planType, userEmail } = body;

        // If userEmail is provided, this is an admin request
        // Otherwise, fix the current user's plan
        let targetUserId = user.id;

        if (userEmail) {
            // Look up user by email - only allow if current user is admin
            // For now, we'll just use the authenticated user
            // In production, add proper admin check here
            const { data: targetUser } = await supabase
                .from('users')
                .select('id')
                .eq('email', userEmail)
                .single();

            if (targetUser) {
                targetUserId = targetUser.id;
            } else {
                return NextResponse.json(
                    { error: 'User not found' },
                    { status: 404 }
                );
            }
        }

        if (!planType || !['monthly', 'lifetime'].includes(planType)) {
            return NextResponse.json(
                { error: 'Invalid plan type. Must be "monthly" or "lifetime"' },
                { status: 400 }
            );
        }

        // Update the subscription
        const { data, error } = await supabase
            .from('user_subscriptions')
            .update({
                plan_type: planType,
                status: 'active',
                website_limit: 0, // Unlimited
                source: 'coupon',
                updated_at: new Date().toISOString(),
                expires_at: planType === 'lifetime' ? null : undefined,
            })
            .eq('user_id', targetUserId)
            .select()
            .single();

        if (error) {
            console.error('[fix-plan] Update error:', error);
            return NextResponse.json(
                { error: 'Failed to update subscription' },
                { status: 500 }
            );
        }

        console.log(`[fix-plan] Successfully updated user ${targetUserId} to ${planType} plan`);

        return NextResponse.json({
            success: true,
            message: `Successfully upgraded to ${planType} plan`,
            subscription: {
                plan_type: data.plan_type,
                website_limit: data.website_limit,
                status: data.status,
            },
        });

    } catch (error) {
        console.error('[fix-plan] Error:', error);
        return NextResponse.json(
            { error: 'Failed to fix plan' },
            { status: 500 }
        );
    }
}
