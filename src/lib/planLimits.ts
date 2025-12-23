// Plan Enforcement Middleware
// Backend-only limit checking for website generation

import { createServerSupabaseClient } from './supabase-server';
import { DbUserSubscription, PlanType } from './db-types';

export interface PlanCheckResult {
    canCreate: boolean;
    error?: 'payment_required' | 'subscription_expired' | 'limit_reached' | 'unauthorized';
    subscription?: DbUserSubscription;
    message?: string;
}

export const PLAN_LIMITS: Record<PlanType, number | null> = {
    free: 1,        // 1 website
    monthly: null,  // Unlimited (null = no limit)
    lifetime: null, // Unlimited (null = no limit)
};

export const PLAN_PRICES = {
    monthly: 19,    // $19/month
    lifetime: 129,  // $129 one-time
};

/**
 * Check if user can create a new website based on their plan
 * This is the BACKEND enforcement - cannot be bypassed
 */
export async function checkCanCreateWebsite(): Promise<PlanCheckResult> {
    try {
        const supabase = await createServerSupabaseClient();

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return {
                canCreate: false,
                error: 'unauthorized',
                message: 'You must be logged in to create a website.',
            };
        }

        // Get user's subscription
        const { data: subscription, error: subError } = await supabase
            .from('user_subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (subError || !subscription) {
            // No subscription found - should auto-create on signup
            // For safety, deny access
            return {
                canCreate: false,
                error: 'payment_required',
                message: 'No subscription found. Please contact support.',
            };
        }

        // Check subscription status
        if (subscription.status !== 'active') {
            return {
                canCreate: false,
                error: 'subscription_expired',
                subscription,
                message: subscription.status === 'past_due'
                    ? 'Your payment is past due. Please update your billing info.'
                    : 'Your subscription has expired. Please upgrade to continue.',
            };
        }

        // IMPORTANT: Monthly and Lifetime plans ALWAYS have unlimited access
        // This is a fallback for any existing records where website_limit wasn't updated properly
        if (subscription.plan_type === 'monthly' || subscription.plan_type === 'lifetime') {
            // If limit is still set to 1 (legacy issue), fix it in database
            if (subscription.website_limit === 1) {
                console.log(`[checkCanCreateWebsite] Fixing legacy limit for user with ${subscription.plan_type} plan`);
                await supabase
                    .from('user_subscriptions')
                    .update({ website_limit: 0 })
                    .eq('user_id', user.id);
            }
            return {
                canCreate: true,
                subscription: { ...subscription, website_limit: 0 }, // Return corrected value
            };
        }

        // Check if plan has limit (for free users)
        const limit = subscription.website_limit;

        // null or 0 = unlimited
        if (limit === null || limit === 0) {
            return {
                canCreate: true,
                subscription,
            };
        }

        // Check limit
        if (subscription.websites_created >= limit) {
            return {
                canCreate: false,
                error: 'limit_reached',
                subscription,
                message: `You've reached your limit of ${limit} website${limit > 1 ? 's' : ''}. Upgrade to create more.`,
            };
        }

        return {
            canCreate: true,
            subscription,
        };

    } catch (error) {
        console.error('Plan check error:', error);
        return {
            canCreate: false,
            error: 'unauthorized',
            message: 'An error occurred. Please try again.',
        };
    }
}

/**
 * Increment the websites_created count after successful creation
 */
export async function incrementWebsitesCreated(userId: string): Promise<boolean> {
    try {
        const supabase = await createServerSupabaseClient();

        const { error } = await supabase
            .from('user_subscriptions')
            .update({
                websites_created: supabase.rpc('increment_websites_created', { p_user_id: userId })
            })
            .eq('user_id', userId);

        // Alternative approach - direct increment
        const { error: rpcError } = await supabase.rpc('increment_websites_created', {
            p_user_id: userId
        });

        return !rpcError;
    } catch (error) {
        console.error('Increment websites error:', error);
        return false;
    }
}

/**
 * Get user's current subscription
 */
export async function getUserSubscription(): Promise<DbUserSubscription | null> {
    try {
        const supabase = await createServerSupabaseClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data: subscription } = await supabase
            .from('user_subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .single();

        return subscription;
    } catch (error) {
        console.error('Get subscription error:', error);
        return null;
    }
}

/**
 * Upgrade user to a paid plan (called after Stripe payment)
 */
export async function upgradePlan(
    userId: string,
    planType: 'monthly' | 'lifetime',
    stripeCustomerId?: string,
    stripeSubscriptionId?: string,
    source: 'direct' | 'appsumo' | 'coupon' = 'direct'
): Promise<boolean> {
    try {
        const supabase = await createServerSupabaseClient();

        console.log(`[upgradePlan] Upgrading user ${userId} to ${planType} (source: ${source})`);

        const updateData: Partial<DbUserSubscription> = {
            user_id: userId,
            plan_type: planType,
            status: 'active',
            website_limit: 0, // 0 = unlimited for paid plans
            source,
            updated_at: new Date().toISOString(),
        };

        if (stripeCustomerId) {
            updateData.stripe_customer_id = stripeCustomerId;
        }

        if (stripeSubscriptionId) {
            updateData.stripe_subscription_id = stripeSubscriptionId;
        }

        // Lifetime plans never expire
        if (planType === 'lifetime') {
            updateData.expires_at = null;
        }

        // Use upsert to handle cases where subscription might not exist yet
        // (e.g., race condition between user creation and payment completion)
        const { data, error } = await supabase
            .from('user_subscriptions')
            .upsert(updateData, {
                onConflict: 'user_id',
                ignoreDuplicates: false,
            })
            .select()
            .single();

        if (error) {
            console.error(`[upgradePlan] Error upgrading user ${userId}:`, error);
            return false;
        }

        console.log(`[upgradePlan] Successfully upgraded user ${userId}:`, {
            plan_type: data?.plan_type,
            website_limit: data?.website_limit,
            status: data?.status,
        });

        return true;
    } catch (error) {
        console.error('[upgradePlan] Unexpected error:', error);
        return false;
    }
}
