'use client';

import { useState } from 'react';
import styles from './UpgradeModal.module.css';
import { LoadingButton } from './Animations';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentPlan?: string;
    websitesCreated?: number;
    websiteLimit?: number;
}

export function UpgradeModal({
    isOpen,
    onClose,
    currentPlan = 'free',
    websitesCreated = 1,
    websiteLimit = 1,
}: UpgradeModalProps) {
    const [loading, setLoading] = useState<'monthly' | 'lifetime' | null>(null);
    const [error, setError] = useState('');

    const handleUpgrade = async (planType: 'monthly' | 'lifetime') => {
        setLoading(planType);
        setError('');

        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planType }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to start checkout');
            }

            // Redirect to Stripe checkout
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to start checkout');
            setLoading(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>×</button>

                <div className={styles.header}>
                    <span className={styles.icon}>🚀</span>
                    <h2>Upgrade to Unlock More</h2>
                    <p className={styles.subtitle}>
                        You've used {websitesCreated} of {websiteLimit} free website{websiteLimit > 1 ? 's' : ''}.
                        Upgrade to create unlimited websites!
                    </p>
                </div>

                {error && (
                    <div className={styles.error}>{error}</div>
                )}

                <div className={styles.plans}>
                    {/* Monthly Plan */}
                    <div className={styles.plan}>
                        <div className={styles.planHeader}>
                            <span className={styles.planName}>Monthly</span>
                            <div className={styles.price}>
                                <span className={styles.amount}>$19</span>
                                <span className={styles.period}>/month</span>
                            </div>
                        </div>
                        <ul className={styles.features}>
                            <li>✓ Unlimited websites</li>
                            <li>✓ Blog publishing</li>
                            <li>✓ Netlify deployment</li>
                            <li>✓ Auto updates</li>
                            <li>✓ SEO & Schema</li>
                        </ul>
                        <LoadingButton
                            onClick={() => handleUpgrade('monthly')}
                            loading={loading === 'monthly'}
                            className={styles.selectBtn}
                        >
                            Start Monthly
                        </LoadingButton>
                    </div>

                    {/* Lifetime Plan */}
                    <div className={`${styles.plan} ${styles.featured}`}>
                        <div className={styles.badge}>BEST VALUE</div>
                        <div className={styles.planHeader}>
                            <span className={styles.planName}>Lifetime</span>
                            <div className={styles.price}>
                                <span className={styles.amount}>$129</span>
                                <span className={styles.period}>one-time</span>
                            </div>
                        </div>
                        <ul className={styles.features}>
                            <li>✓ Everything in Monthly</li>
                            <li>✓ Pay once, use forever</li>
                            <li>✓ No recurring fees</li>
                            <li>✓ Priority support</li>
                            <li>✓ Future updates included</li>
                        </ul>
                        <LoadingButton
                            onClick={() => handleUpgrade('lifetime')}
                            loading={loading === 'lifetime'}
                            className={`${styles.selectBtn} ${styles.primary}`}
                        >
                            Get Lifetime Access
                        </LoadingButton>
                    </div>
                </div>

                <p className={styles.secure}>
                    🔒 Secure payment powered by Stripe • Coupon codes accepted at checkout
                </p>
            </div>
        </div>
    );
}
