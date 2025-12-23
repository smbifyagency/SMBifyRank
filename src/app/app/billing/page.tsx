'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import styles from './billing.module.css';

interface Subscription {
    plan_type: 'free' | 'monthly' | 'lifetime';
    status: 'active' | 'expired' | 'canceled' | 'past_due';
    website_limit: number;
    websites_created: number;
    stripe_customer_id: string | null;
    expires_at: string | null;
}

export default function BillingPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loadingPlan, setLoadingPlan] = useState(true);
    const [upgrading, setUpgrading] = useState<'monthly' | 'lifetime' | null>(null);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
            return;
        }

        // Fetch subscription data
        if (user) {
            fetchSubscription();
        }
    }, [user, loading, router]);

    const fetchSubscription = async () => {
        try {
            const response = await fetch('/api/subscription');
            if (response.ok) {
                const data = await response.json();
                setSubscription(data);
            } else {
                // Default to free plan
                setSubscription({
                    plan_type: 'free',
                    status: 'active',
                    website_limit: 1,
                    websites_created: 0,
                    stripe_customer_id: null,
                    expires_at: null,
                });
            }
        } catch {
            // Default to free plan
            setSubscription({
                plan_type: 'free',
                status: 'active',
                website_limit: 1,
                websites_created: 0,
                stripe_customer_id: null,
                expires_at: null,
            });
        } finally {
            setLoadingPlan(false);
        }
    };

    const handleUpgrade = async (planType: 'monthly' | 'lifetime') => {
        setUpgrading(planType);

        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planType }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                alert(data.error || 'Failed to start checkout');
                setUpgrading(null);
            }
        } catch {
            alert('Failed to start checkout');
            setUpgrading(null);
        }
    };

    if (loading || loadingPlan) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (!user) {
        return null;
    }

    const isPaidPlan = subscription?.plan_type === 'monthly' || subscription?.plan_type === 'lifetime';
    // Unlimited if: website_limit is 0/null OR plan is monthly/lifetime (fallback for legacy data)
    const isUnlimited = subscription?.website_limit === 0 || subscription?.website_limit === null || isPaidPlan;

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h1>Billing & Subscription</h1>

                {/* Current Plan Card */}
                <div className={styles.card}>
                    <div className={styles.planHeader}>
                        <div>
                            <h2>Current Plan</h2>
                            <span className={`${styles.planBadge} ${styles[subscription?.plan_type || 'free']}`}>
                                {subscription?.plan_type === 'free' && '🆓 Free Trial'}
                                {subscription?.plan_type === 'monthly' && '⭐ Monthly'}
                                {subscription?.plan_type === 'lifetime' && '👑 Lifetime'}
                            </span>
                        </div>
                        <span className={`${styles.status} ${styles[subscription?.status || 'active']}`}>
                            {subscription?.status}
                        </span>
                    </div>

                    <div className={styles.usage}>
                        <div className={styles.usageItem}>
                            <span className={styles.usageLabel}>Websites Created</span>
                            <span className={styles.usageValue}>
                                {subscription?.websites_created || 0} / {isUnlimited ? '∞' : subscription?.website_limit}
                            </span>
                        </div>
                        {subscription?.plan_type === 'monthly' && subscription?.expires_at && (
                            <div className={styles.usageItem}>
                                <span className={styles.usageLabel}>Next Billing</span>
                                <span className={styles.usageValue}>
                                    {new Date(subscription.expires_at).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                    </div>

                    {!isPaidPlan && (
                        <div className={styles.upgradePrompt}>
                            <p>🚀 Upgrade to create unlimited websites!</p>
                        </div>
                    )}
                </div>

                {/* Upgrade Options */}
                {!isPaidPlan && (
                    <div className={styles.upgradeSection}>
                        <h2>Upgrade Your Plan</h2>
                        <div className={styles.planGrid}>
                            {/* Monthly */}
                            <div className={styles.planCard}>
                                <h3>Monthly</h3>
                                <div className={styles.price}>
                                    <span className={styles.amount}>$19</span>
                                    <span className={styles.period}>/month</span>
                                </div>
                                <ul>
                                    <li>✓ Unlimited websites</li>
                                    <li>✓ Blog system</li>
                                    <li>✓ Netlify deploy</li>
                                    <li>✓ Email support</li>
                                </ul>
                                <button
                                    onClick={() => handleUpgrade('monthly')}
                                    className={styles.upgradeBtn}
                                    disabled={upgrading === 'monthly'}
                                >
                                    {upgrading === 'monthly' ? 'Loading...' : 'Start Monthly'}
                                </button>
                            </div>

                            {/* Lifetime */}
                            <div className={`${styles.planCard} ${styles.featured}`}>
                                <div className={styles.bestValue}>Best Value</div>
                                <h3>Lifetime</h3>
                                <div className={styles.price}>
                                    <span className={styles.amount}>$129</span>
                                    <span className={styles.period}>one-time</span>
                                </div>
                                <ul>
                                    <li>✓ Everything in Monthly</li>
                                    <li>✓ No recurring fees</li>
                                    <li>✓ Priority support</li>
                                    <li>✓ All future updates</li>
                                </ul>
                                <button
                                    onClick={() => handleUpgrade('lifetime')}
                                    className={`${styles.upgradeBtn} ${styles.primary}`}
                                    disabled={upgrading === 'lifetime'}
                                >
                                    {upgrading === 'lifetime' ? 'Loading...' : 'Get Lifetime Access'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Manage Subscription */}
                {isPaidPlan && subscription?.stripe_customer_id && (
                    <div className={styles.card}>
                        <h2>Manage Subscription</h2>
                        <p className={styles.manageInfo}>
                            Visit the Stripe portal to update payment methods, view invoices, or cancel your subscription.
                        </p>
                        <a href="/api/stripe/portal" className={styles.portalBtn}>
                            Open Billing Portal →
                        </a>
                    </div>
                )}

                {/* Secure Payment */}
                <p className={styles.secure}>
                    🔒 All payments are secure and processed by Stripe
                </p>
            </div>
        </div>
    );
}
