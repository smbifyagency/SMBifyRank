'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './checkout.module.css';

interface UserProfile {
    name: string | null;
    email: string | null;
}

interface Discount {
    type: 'percent' | 'amount';
    value: number;
    name: string;
}

const PLAN_FEATURES = {
    monthly: [
        'Unlimited Websites',
        'All 31 Industry Templates',
        'AI Content Generation',
        'Full Blog System',
        'One-Click Netlify Deploy',
        'Auto Live Updates',
        'SEO & Schema Markup',
        'Email Support',
    ],
    lifetime: [
        'Everything in Monthly',
        'Unlimited Websites Forever',
        'No Recurring Fees',
        'All Future Updates',
        'Priority Support',
        'AppSumo Compatible',
        'Commercial License',
        'Early Access Features',
    ],
};

const PLAN_PRICES = {
    monthly: 19,
    lifetime: 129,
};

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialPlan = searchParams.get('plan') as 'monthly' | 'lifetime' | null;
    const wasCanceled = searchParams.get('canceled') === 'true';

    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'lifetime'>(initialPlan || 'lifetime');
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState<Discount | null>(null);
    const [couponError, setCouponError] = useState('');
    const [validatingCoupon, setValidatingCoupon] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    // Fetch user profile on mount
    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch('/api/auth/user');
                if (response.ok) {
                    const data = await response.json();
                    setUserProfile(data.user);
                }
            } catch {
                // User not logged in - will be redirected on checkout
            }
        }
        fetchUser();
    }, []);

    // Calculate final price
    const basePrice = PLAN_PRICES[selectedPlan];
    let finalPrice = basePrice;
    let discountAmount = 0;

    if (discount) {
        if (discount.type === 'percent') {
            discountAmount = Math.round(basePrice * (discount.value / 100));
        } else {
            discountAmount = discount.value;
        }
        finalPrice = Math.max(0, basePrice - discountAmount);
    }

    const validateCoupon = async () => {
        if (!couponCode.trim()) {
            setCouponError('Please enter a coupon code');
            return;
        }

        setValidatingCoupon(true);
        setCouponError('');
        setDiscount(null);

        try {
            const response = await fetch('/api/stripe/validate-coupon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ couponCode: couponCode.trim() }),
            });

            const data = await response.json();

            if (data.valid && data.discount) {
                setDiscount(data.discount);
            } else {
                setCouponError(data.error || 'Invalid coupon code');
            }
        } catch {
            setCouponError('Failed to validate coupon');
        } finally {
            setValidatingCoupon(false);
        }
    };

    const removeCoupon = () => {
        setCouponCode('');
        setDiscount(null);
        setCouponError('');
    };

    const handleCheckout = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    planType: selectedPlan,
                    couponCode: discount ? couponCode.trim() : undefined,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    // User not logged in - redirect to login
                    router.push(`/login?redirect=/checkout?plan=${selectedPlan}`);
                    return;
                }
                throw new Error(data.error || 'Failed to start checkout');
            }

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to start checkout');
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <Link href="/pricing" className={styles.backLink}>
                        ← Back to Pricing
                    </Link>
                    <h1>Complete Your Upgrade</h1>
                    <p>Unlock unlimited websites and all premium features</p>
                </div>

                {/* Canceled Banner */}
                {wasCanceled && (
                    <div className={styles.canceledBanner}>
                        <span>⚠️</span>
                        <span>Payment was canceled. Select a plan and try again.</span>
                    </div>
                )}

                <div className={styles.checkoutGrid}>
                    {/* Left: Plan Selection */}
                    <div className={styles.planSection}>
                        <h2>Select Your Plan</h2>

                        <div className={styles.planOptions}>
                            {/* Monthly Plan */}
                            <button
                                className={`${styles.planCard} ${selectedPlan === 'monthly' ? styles.selected : ''}`}
                                onClick={() => setSelectedPlan('monthly')}
                            >
                                <div className={styles.planHeader}>
                                    <div className={styles.planRadio}>
                                        <div className={styles.radioOuter}>
                                            {selectedPlan === 'monthly' && <div className={styles.radioInner} />}
                                        </div>
                                    </div>
                                    <div className={styles.planInfo}>
                                        <span className={styles.planName}>Monthly</span>
                                        <span className={styles.planDesc}>Flexible, cancel anytime</span>
                                    </div>
                                    <div className={styles.planPrice}>
                                        <span className={styles.amount}>$19</span>
                                        <span className={styles.period}>/month</span>
                                    </div>
                                </div>
                            </button>

                            {/* Lifetime Plan */}
                            <button
                                className={`${styles.planCard} ${selectedPlan === 'lifetime' ? styles.selected : ''}`}
                                onClick={() => setSelectedPlan('lifetime')}
                            >
                                <div className={styles.bestValue}>BEST VALUE</div>
                                <div className={styles.planHeader}>
                                    <div className={styles.planRadio}>
                                        <div className={styles.radioOuter}>
                                            {selectedPlan === 'lifetime' && <div className={styles.radioInner} />}
                                        </div>
                                    </div>
                                    <div className={styles.planInfo}>
                                        <span className={styles.planName}>Lifetime</span>
                                        <span className={styles.planDesc}>Pay once, use forever</span>
                                    </div>
                                    <div className={styles.planPrice}>
                                        <span className={styles.amount}>$129</span>
                                        <span className={styles.period}>one-time</span>
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* Features */}
                        <div className={styles.features}>
                            <h3>What you'll get:</h3>
                            <ul>
                                {PLAN_FEATURES[selectedPlan].map((feature, idx) => (
                                    <li key={idx}>
                                        <span className={styles.checkIcon}>✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className={styles.summarySection}>
                        <div className={styles.summaryCard}>
                            <h2>Order Summary</h2>

                            {/* User Info */}
                            {userProfile && (
                                <div className={styles.userInfo}>
                                    <div className={styles.userIcon}>👤</div>
                                    <div>
                                        <p className={styles.userName}>{userProfile.name || 'User'}</p>
                                        <p className={styles.userEmail}>{userProfile.email}</p>
                                    </div>
                                </div>
                            )}

                            {/* Plan Summary */}
                            <div className={styles.summaryItems}>
                                <div className={styles.summaryRow}>
                                    <span>{selectedPlan === 'monthly' ? 'Monthly Plan' : 'Lifetime Plan'}</span>
                                    <span>${basePrice}</span>
                                </div>

                                {discount && (
                                    <div className={`${styles.summaryRow} ${styles.discount}`}>
                                        <span>
                                            Discount ({discount.name})
                                            <button onClick={removeCoupon} className={styles.removeCoupon}>×</button>
                                        </span>
                                        <span>-${discountAmount}</span>
                                    </div>
                                )}

                                <div className={styles.divider} />

                                <div className={`${styles.summaryRow} ${styles.total}`}>
                                    <span>Total</span>
                                    <span>${finalPrice}{selectedPlan === 'monthly' ? '/mo' : ''}</span>
                                </div>
                            </div>

                            {/* Coupon Input */}
                            {!discount && (
                                <div className={styles.couponSection}>
                                    <label>Have a coupon code?</label>
                                    <div className={styles.couponInput}>
                                        <input
                                            type="text"
                                            placeholder="Enter code"
                                            value={couponCode}
                                            onChange={(e) => {
                                                setCouponCode(e.target.value);
                                                setCouponError('');
                                            }}
                                            onKeyDown={(e) => e.key === 'Enter' && validateCoupon()}
                                        />
                                        <button
                                            onClick={validateCoupon}
                                            disabled={validatingCoupon || !couponCode.trim()}
                                        >
                                            {validatingCoupon ? '...' : 'Apply'}
                                        </button>
                                    </div>
                                    {couponError && <p className={styles.couponError}>{couponError}</p>}
                                </div>
                            )}

                            {discount && (
                                <div className={styles.couponApplied}>
                                    <span>🎉</span>
                                    <span>
                                        Coupon applied! You save ${discountAmount}
                                        {discount.type === 'percent' && ` (${discount.value}% off)`}
                                    </span>
                                </div>
                            )}

                            {/* Error Display */}
                            {error && (
                                <div className={styles.error}>
                                    <span>⚠️</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Checkout Button */}
                            <button
                                className={styles.checkoutBtn}
                                onClick={handleCheckout}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className={styles.loadingContent}>
                                        <span className={styles.spinner} />
                                        Processing...
                                    </span>
                                ) : (
                                    `Pay $${finalPrice}${selectedPlan === 'monthly' ? '/month' : ''}`
                                )}
                            </button>

                            <p className={styles.secureNote}>
                                🔒 Secure payment powered by Stripe
                            </p>

                            <p className={styles.guarantee}>
                                14-day money-back guarantee. No questions asked.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Default export with Suspense boundary for useSearchParams
export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className={styles.page}>
                <div className={styles.container}>
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <p>Loading checkout...</p>
                    </div>
                </div>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
