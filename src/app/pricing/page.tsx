'use client';

import Link from 'next/link';
import styles from './pricing.module.css';

export default function PricingPage() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className={styles.badge}>Simple Pricing</span>
                    <h1>Choose Your Plan</h1>
                    <p>Start free, upgrade as you grow. No hidden fees.</p>
                </div>

                <div className={styles.pricingGrid}>
                    {/* Free Plan */}
                    <div className={styles.pricingCard}>
                        <div className={styles.planHeader}>
                            <h2>Free</h2>
                            <p className={styles.planDescription}>Perfect for trying out</p>
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
                                Basic AI Content Generation
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                Visual Page Editor
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                Manual ZIP Export
                            </li>
                            <li className={styles.excluded}>
                                <span className={styles.xIcon}>✕</span>
                                Blog System
                            </li>
                            <li className={styles.excluded}>
                                <span className={styles.xIcon}>✕</span>
                                One-Click Deploy
                            </li>
                            <li className={styles.excluded}>
                                <span className={styles.xIcon}>✕</span>
                                Priority Support
                            </li>
                        </ul>
                        <Link href="/app" className={styles.btn}>
                            Get Started Free
                        </Link>
                    </div>

                    {/* Pro Plan */}
                    <div className={`${styles.pricingCard} ${styles.popular}`}>
                        <div className={styles.popularBadge}>Most Popular</div>
                        <div className={styles.planHeader}>
                            <h2>Pro</h2>
                            <p className={styles.planDescription}>For growing businesses</p>
                            <div className={styles.price}>
                                <span className={styles.amount}>$29</span>
                                <span className={styles.period}>/month</span>
                            </div>
                        </div>
                        <ul className={styles.features}>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                5 Websites
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                All 31 Industry Templates
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                Advanced AI Content (GPT-4)
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                Visual Page Editor
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                One-Click Netlify Deploy
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                Full Blog System
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                AI Blog Post Writer
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                Email Support
                            </li>
                        </ul>
                        <Link href="/app" className={styles.btnPrimary}>
                            Start Pro Trial
                        </Link>
                    </div>

                    {/* Agency Plan */}
                    <div className={styles.pricingCard}>
                        <div className={styles.planHeader}>
                            <h2>Agency</h2>
                            <p className={styles.planDescription}>For agencies & teams</p>
                            <div className={styles.price}>
                                <span className={styles.amount}>$99</span>
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
                                Advanced AI Content (GPT-4)
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                White-Label Option
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                API Access
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                Full Blog System
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                Bulk Blog Generation
                            </li>
                            <li className={styles.included}>
                                <span className={styles.checkIcon}>✓</span>
                                Priority Support
                            </li>
                        </ul>
                        <Link href="/app" className={styles.btn}>
                            Contact Sales
                        </Link>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className={styles.faq}>
                    <h2>Frequently Asked Questions</h2>
                    <div className={styles.faqGrid}>
                        <div className={styles.faqItem}>
                            <h3>Can I upgrade or downgrade anytime?</h3>
                            <p>Yes! You can change your plan at any time. Upgrades take effect immediately, downgrades at the end of your billing cycle.</p>
                        </div>
                        <div className={styles.faqItem}>
                            <h3>Do I need my own OpenAI API key?</h3>
                            <p>Yes, you&apos;ll need to provide your own OpenAI API key for AI content generation. This keeps costs transparent and gives you full control.</p>
                        </div>
                        <div className={styles.faqItem}>
                            <h3>What happens to my websites if I cancel?</h3>
                            <p>Your exported websites are yours forever! They&apos;re static HTML files you can host anywhere. You just won&apos;t be able to edit or create new ones.</p>
                        </div>
                        <div className={styles.faqItem}>
                            <h3>Is there a refund policy?</h3>
                            <p>Yes, we offer a 14-day money-back guarantee. If you&apos;re not satisfied, contact us for a full refund.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
