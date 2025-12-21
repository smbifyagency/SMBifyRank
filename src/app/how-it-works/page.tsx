'use client';

import Link from 'next/link';
import styles from './how-it-works.module.css';

export default function HowItWorksPage() {
    const steps = [
        {
            number: '01',
            title: 'Sign Up & Login',
            description: 'Create your free account in seconds using Google or email. No credit card required to get started.',
            icon: '🔐',
        },
        {
            number: '02',
            title: 'Enter Business Details',
            description: 'Tell us about your business - name, industry, location, and services. Our AI uses this to personalize your website.',
            icon: '📝',
        },
        {
            number: '03',
            title: 'Choose Your Template',
            description: 'Select from 31+ industry-specific templates designed for local businesses. Each template is SEO-optimized and mobile-ready.',
            icon: '🎨',
        },
        {
            number: '04',
            title: 'Customize with Live Editor',
            description: 'Use our drag-and-drop editor to customize colors, images, text, and layout. See changes in real-time.',
            icon: '✏️',
        },
        {
            number: '05',
            title: 'Generate Your Website',
            description: 'Click generate and watch AI create your complete website with pages, blog, SEO, and schema markup.',
            icon: '⚡',
        },
        {
            number: '06',
            title: 'Preview & Deploy',
            description: 'Preview your site, make final adjustments, then deploy to Netlify with one click. Your site goes live instantly.',
            icon: '🚀',
        },
    ];

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* Hero */}
                <section className={styles.hero}>
                    <span className={styles.badge}>Simple Process</span>
                    <h1>How SMBify Rank Works</h1>
                    <p>Build and deploy your professional business website in just 5 minutes. No coding required.</p>
                </section>

                {/* Steps */}
                <section className={styles.steps}>
                    {steps.map((step, index) => (
                        <div key={index} className={styles.step}>
                            <div className={styles.stepNumber}>{step.number}</div>
                            <div className={styles.stepContent}>
                                <div className={styles.stepIcon}>{step.icon}</div>
                                <h2>{step.title}</h2>
                                <p>{step.description}</p>
                            </div>
                            {index < steps.length - 1 && <div className={styles.stepConnector} />}
                        </div>
                    ))}
                </section>

                {/* Features Highlight */}
                <section className={styles.features}>
                    <h2>What You Get</h2>
                    <div className={styles.featureGrid}>
                        <div className={styles.feature}>
                            <span>🎯</span>
                            <h3>SEO-Optimized</h3>
                            <p>Every page comes with proper meta tags, schema markup, and semantic HTML.</p>
                        </div>
                        <div className={styles.feature}>
                            <span>📱</span>
                            <h3>Mobile Responsive</h3>
                            <p>Your site looks perfect on all devices - desktop, tablet, and mobile.</p>
                        </div>
                        <div className={styles.feature}>
                            <span>⚡</span>
                            <h3>Lightning Fast</h3>
                            <p>Static HTML output means your site loads instantly for visitors.</p>
                        </div>
                        <div className={styles.feature}>
                            <span>📝</span>
                            <h3>Blog Ready</h3>
                            <p>Built-in blog system to publish content and boost your SEO.</p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className={styles.cta}>
                    <h2>Ready to Build Your Website?</h2>
                    <p>Join thousands of local businesses using SMBify Rank</p>
                    <div className={styles.ctaButtons}>
                        <Link href="/app" className={styles.primaryBtn}>
                            Start Building Free →
                        </Link>
                        <Link href="/pricing" className={styles.secondaryBtn}>
                            View Pricing
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
