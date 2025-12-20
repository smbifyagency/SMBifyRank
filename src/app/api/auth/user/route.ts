// User Profile API
// GET /api/auth/user - Get current user profile

import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET() {
    try {
        const supabase = await createServerSupabaseClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { user: null },
                { status: 401 }
            );
        }

        // Get user profile with subscription
        const { data: profile } = await supabase
            .from('users')
            .select('name, email, avatar_url')
            .eq('id', user.id)
            .single();

        const { data: subscription } = await supabase
            .from('user_subscriptions')
            .select('plan_type, status, website_limit, websites_created')
            .eq('user_id', user.id)
            .single();

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: profile?.name || null,
                avatarUrl: profile?.avatar_url || null,
                subscription: subscription || {
                    plan_type: 'free',
                    status: 'active',
                    website_limit: 1,
                    websites_created: 0,
                },
            },
        });

    } catch (error) {
        console.error('User API error:', error);
        return NextResponse.json(
            { user: null, error: 'Failed to get user' },
            { status: 500 }
        );
    }
}
