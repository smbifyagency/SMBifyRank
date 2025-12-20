'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './pricing.module.css';

export default function PricingPage() {
    const [loading, setLoading] = useState<'monthly' | 'lifetime' | null>(null);

    const handleUpgrade = async (planType: 'monthly' | 'lifetime') => {
        setLoading(planType);

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
                setLoading(null);
            }
        } catch (error) {
            alert('Failed to start checkout');
            setLoading(null);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className={styles.badge}>Simple Pricing</span>
                    <h1>Choose Your Plan</h1>
                    <p>Start free, upgrade as you grow. No hidden fees.</p>
                </div>

                <div className={styles.pricingGrid}>
                    {/* Free Trial */}
                    <div className={styles.pricingCard}>
                        <div className={styles.planHeader}>
                            <h2>Free Trial</h2>
                            <p className={styles.planDescription}>Try before you buy</p>
                            <div className={styles.price}>
                                <span className={styles.amount}>$0</span>
                                <span className={styles.period}>forever</span>
                            </div>
                        </div>
                        <ul className={styles.features}>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                1 Website
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                All 31 Industry Templates
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                AI Content Generation
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                Visual Page Editor
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                Preview & ZIP Export
                            </li>
                            <li className={styles.excluded}>
                                <span className={styles.xIcon}>✕</span>
                                Blog System
                            </li>
                            <li className={styles.excluded}>
                                <span className={styles.xIcon}>✕</span>
                                Netlify Deployment
                            </li>
                            <li className={styles.excluded}>
                                <span className={styles.xIcon}>✕</span>
                                Auto Updates
                            </li>
                        </ul>
                        <Link href="/login" className={styles.btn}>
                            Get Started Free
                        </Link>
                    </div>

                    {/* Monthly Plan */}
                    <div className={`${styles.pricingCard} ${styles.popular}`}>
                        <div className={styles.popularBadge}>Most Popular</div>
                        <div className={styles.planHeader}>
                            <h2>Monthly</h2>
                            <p className={styles.planDescription}>For active businesses</p>
                            <div className={styles.price}>
                                <span className={styles.amount}>$19</span>
                                <span className={styles.period}>/month</span>
                            </div>
                        </div>
                        <ul className={styles.features}>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                Unlimited Websites
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                All 31 Industry Templates
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                AI Content Generation
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                Full Blog System
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                One-Click Netlify Deploy
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                Auto Live Updates
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                SEO & Schema Markup
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                Email Support
                            </li>
                        </ul>
                        <button
                            onClick={() => handleUpgrade('monthly')}
                            className={styles.btnPrimary}
                            disabled={loading === 'monthly'}
                        >
                            {loading === 'monthly' ? 'Loading...' : 'Start Monthly'}
                        </button>
                    </div>

                    {/* Lifetime Plan */}
                    <div className={styles.pricingCard}>
                        <div className={styles.lifetimeBadge}>Best Value</div>
                        <div className={styles.planHeader}>
                            <h2>Lifetime</h2>
                            <p className={styles.planDescription}>Pay once, use forever</p>
                            <div className={styles.price}>
                                <span className={styles.amount}>$129</span>
                                <span className={styles.period}>one-time</span>
                            </div>
                        </div>
                        <ul className={styles.features}>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                Everything in Monthly
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                Unlimited Websites Forever
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                No Recurring Fees
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                All Future Updates
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                Priority Support
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                AppSumo Compatible
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                Commercial License
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                Early Access Features
                            </li>
                        </ul>
                        <button
                            onClick={() => handleUpgrade('lifetime')}
                            className={styles.btn}
                            disabled={loading === 'lifetime'}
                        >
                            {loading === 'lifetime' ? 'Loading...' : 'Get Lifetime Access'}
                        </button>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className={styles.faq}>
                    <h2>Frequently Asked Questions</h2>
                    <div className={styles.faqGrid}>
                        <div className={styles.faqItem}>
                            <h3>Can I upgrade from Free to paid anytime?</h3>
                            <p>Yes! You can upgrade at any time. Your existing website will be preserved, and you&apos;ll unlock unlimited websites instantly.</p>
                        </div>
                        <div className={styles.faqItem}>
                            <h3>What&apos;s the difference between Monthly and Lifetime?</h3>
                            <p>Both have the same features. Monthly is $19/month recurring. Lifetime is $129 one-time and you never pay again.</p>
                        </div>
                        <div className={styles.faqItem}>
                            <h3>What happens to my websites if I cancel?</h3>
                            <p>Your exported websites are yours forever! They&apos;re static HTML files you can host anywhere. You just won&apos;t be able to create new ones.</p>
                        </div>
                        <div className={styles.faqItem}>
                            <h3>Is there a refund policy?</h3>
                            <p>Yes, we offer a 14-day money-back guarantee for both Monthly and Lifetime plans. No questions asked.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
