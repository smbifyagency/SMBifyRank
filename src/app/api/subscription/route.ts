// Subscription API - Get current user's subscription
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET() {
    try {
        const supabase = await createServerSupabaseClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get subscription from database
        const { data: subscription, error } = await supabase
            .from('user_subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error || !subscription) {
            // Return default free plan if no subscription found
            return NextResponse.json({
                plan_type: 'free',
                status: 'active',
                website_limit: 1,
                websites_created: 0,
                stripe_customer_id: null,
                stripe_subscription_id: null,
                expires_at: null,
            });
        }

        return NextResponse.json(subscription);
    } catch (error) {
        console.error('Subscription API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch subscription' },
            { status: 500 }
        );
    }
}
