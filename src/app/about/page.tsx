'use client';

import Link from 'next/link';
import styles from './about.module.css';

export default function AboutPage() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* Hero */}
                <section className={styles.hero}>
                    <span className={styles.badge}>About Us</span>
                    <h1>About SMBify Rank</h1>
                    <p>
                        Empowering local businesses with AI-powered website generation technology.
                        Built specifically for service-based businesses that need professional,
                        SEO-optimized websites without the complexity.
                    </p>
                </section>

                {/* Vision */}
                <section className={styles.section}>
                    <h2>Our Vision</h2>
                    <p>
                        Every local business deserves a professional online presence. We believe that
                        creating a website shouldn&apos;t require technical expertise or expensive agencies.
                        SMBify Rank makes it possible for any business owner to launch a beautiful,
                        SEO-ready website in minutes.
                    </p>
                </section>

                {/* Why SMBify Rank */}
                <section className={styles.section}>
                    <h2>Why SMBify Rank?</h2>
                    <div className={styles.reasons}>
                        <div className={styles.reason}>
                            <span>🚀</span>
                            <h3>AI-Powered Generation</h3>
                            <p>
                                Our AI understands your business and creates tailored content,
                                optimized for search engines and conversion.
                            </p>
                        </div>
                        <div className={styles.reason}>
                            <span>⚡</span>
                            <h3>5-Minute Setup</h3>
                            <p>
                                No more weeks of development. Get your complete website ready
                                in just 5 minutes with our streamlined process.
                            </p>
                        </div>
                        <div className={styles.reason}>
                            <span>🎯</span>
                            <h3>SEO-First Approach</h3>
                            <p>
                                Every site includes proper schema markup, meta tags, and
                                semantic HTML for maximum search engine visibility.
                            </p>
                        </div>
                        <div className={styles.reason}>
                            <span>💰</span>
                            <h3>Cost Effective</h3>
                            <p>
                                Save thousands compared to traditional web agencies while
                                getting a professional result immediately.
                            </p>
                        </div>
                    </div>
                </section>

                {/* About SMBify Agency */}
                <section className={styles.agency}>
                    <h2>SMBify Agency</h2>
                    <p>
                        SMBify Rank is brought to you by <a href="https://www.smbify.agency" target="_blank" rel="noopener noreferrer">SMBify Agency</a> —
                        a digital marketing agency specializing in helping local businesses grow online.
                    </p>
                    <div className={styles.agencyServices}>
                        <h3>Agency Services</h3>
                        <ul>
                            <li>Local SEO & Google Business Optimization</li>
                            <li>Website Design & Development</li>
                            <li>Content Marketing & Blogging</li>
                            <li>Social Media Management</li>
                            <li>Paid Advertising (Google Ads, Facebook Ads)</li>
                            <li>Reputation Management</li>
                        </ul>
                    </div>
                    <p className={styles.agencyNote}>
                        <strong>For Agencies:</strong> SMBify Rank can be used by marketing agencies to
                        quickly generate client websites. Create unlimited sites for your clients
                        with our Lifetime plan.
                    </p>
                </section>

                {/* CTA */}
                <section className={styles.cta}>
                    <h2>Ready to Get Started?</h2>
                    <p>Build your professional website today</p>
                    <div className={styles.ctaButtons}>
                        <Link href="/app" className={styles.primaryBtn}>
                            Start Building Free →
                        </Link>
                        <Link href="/contact" className={styles.secondaryBtn}>
                            Contact Us
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
