import styles from './legal.module.css';

export const metadata = {
    title: 'Terms of Service | SMBify Rank',
    description: 'Terms of Service for SMBify Rank - AI-powered website builder for local businesses.',
};

export default function TermsOfServicePage() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h1>Terms of Service</h1>
                <p className={styles.lastUpdated}>Last updated: December 2024</p>

                <section className={styles.section}>
                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using SMBify Rank (&quot;the Service&quot;), you agree to be bound by
                        these Terms of Service. If you do not agree to these terms, please do not
                        use our Service.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>2. Description of Service</h2>
                    <p>
                        SMBify Rank is an AI-powered website builder designed for local businesses.
                        The Service allows users to generate SEO-optimized static websites, manage
                        content, and deploy to hosting platforms.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>3. User Accounts</h2>
                    <ul>
                        <li>You must provide accurate and complete registration information</li>
                        <li>You are responsible for maintaining the security of your account</li>
                        <li>You must be at least 18 years old to use this Service</li>
                        <li>One person or entity may not maintain more than one free account</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>4. Subscription Plans</h2>
                    <h3>Free Plan</h3>
                    <p>Limited to 1 website with restricted features.</p>
                    <h3>Monthly Plan ($19/month)</h3>
                    <p>Unlimited websites with all features. Billed monthly, cancel anytime.</p>
                    <h3>Lifetime Plan ($129 one-time)</h3>
                    <p>Unlimited websites forever with all current and future features.</p>
                </section>

                <section className={styles.section}>
                    <h2>5. Payment Terms</h2>
                    <ul>
                        <li>All payments are processed securely through Stripe</li>
                        <li>Monthly subscriptions are billed automatically</li>
                        <li>Lifetime purchases are one-time payments</li>
                        <li>Refunds are available within 14 days of purchase</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>6. User Content</h2>
                    <p>You retain ownership of all content you create using the Service. You grant
                        us a license to store and display your content as necessary to provide the Service.</p>
                    <p>You are responsible for ensuring your content does not:</p>
                    <ul>
                        <li>Violate any laws or regulations</li>
                        <li>Infringe on intellectual property rights</li>
                        <li>Contain malicious code or spam</li>
                        <li>Include illegal, offensive, or harmful material</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>7. Intellectual Property</h2>
                    <p>
                        The Service, including all software, design, and content (excluding user-generated
                        content), is the property of SMBify Agency and is protected by copyright and
                        other intellectual property laws.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>8. Limitation of Liability</h2>
                    <p>
                        SMBify Rank is provided &quot;as is&quot; without warranties of any kind. We are not
                        liable for any indirect, incidental, or consequential damages arising from
                        your use of the Service.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>9. Termination</h2>
                    <p>
                        We reserve the right to suspend or terminate your account if you violate
                        these Terms. You may cancel your account at any time through your dashboard.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>10. Changes to Terms</h2>
                    <p>
                        We may update these Terms from time to time. We will notify users of
                        significant changes via email or through the Service.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>11. Contact Information</h2>
                    <p>For questions about these Terms, contact us at:</p>
                    <ul>
                        <li>Email: <a href="mailto:smbifyagency@gmail.com">smbifyagency@gmail.com</a></li>
                        <li>Email: <a href="mailto:info@smbify.agency">info@smbify.agency</a></li>
                        <li>Website: <a href="https://www.smbify.agency" target="_blank" rel="noopener noreferrer">www.smbify.agency</a></li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
