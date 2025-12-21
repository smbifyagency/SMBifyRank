import styles from './legal.module.css';

export const metadata = {
    title: 'Privacy Policy | SMBify Rank',
    description: 'Privacy Policy for SMBify Rank - AI-powered website builder for local businesses.',
};

export default function PrivacyPolicyPage() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h1>Privacy Policy</h1>
                <p className={styles.lastUpdated}>Last updated: December 2024</p>

                <section className={styles.section}>
                    <h2>1. Introduction</h2>
                    <p>
                        SMBify Rank (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
                        This Privacy Policy explains how we collect, use, disclose, and safeguard your
                        information when you use our website builder service.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>2. Information We Collect</h2>
                    <h3>Personal Information</h3>
                    <ul>
                        <li>Name and email address (when you create an account)</li>
                        <li>Business information (name, industry, location, services)</li>
                        <li>Payment information (processed securely by Stripe)</li>
                        <li>Usage data and analytics</li>
                    </ul>
                    <h3>Automatically Collected Information</h3>
                    <ul>
                        <li>IP address and device information</li>
                        <li>Browser type and version</li>
                        <li>Pages visited and time spent</li>
                        <li>Referring website addresses</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>3. How We Use Your Information</h2>
                    <p>We use the information we collect to:</p>
                    <ul>
                        <li>Provide and maintain our service</li>
                        <li>Generate your website content</li>
                        <li>Process payments and manage subscriptions</li>
                        <li>Send service-related communications</li>
                        <li>Improve our service and user experience</li>
                        <li>Respond to customer support requests</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>4. Data Security</h2>
                    <p>
                        We implement appropriate security measures to protect your personal information.
                        Your data is stored securely using industry-standard encryption. Payment
                        processing is handled by Stripe, a PCI-compliant payment processor.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>5. Third-Party Services</h2>
                    <p>We use the following third-party services:</p>
                    <ul>
                        <li><strong>Supabase:</strong> Authentication and database</li>
                        <li><strong>Stripe:</strong> Payment processing</li>
                        <li><strong>Netlify:</strong> Website deployment (optional)</li>
                        <li><strong>Google:</strong> OAuth authentication</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>6. Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Access your personal data</li>
                        <li>Correct inaccurate data</li>
                        <li>Request deletion of your data</li>
                        <li>Export your data</li>
                        <li>Opt out of marketing communications</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>7. Cookies</h2>
                    <p>
                        We use cookies to maintain your session and preferences. You can control
                        cookie settings through your browser.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>8. Contact Us</h2>
                    <p>
                        If you have questions about this Privacy Policy, please contact us at:
                    </p>
                    <ul>
                        <li>Email: <a href="mailto:smbifyagency@gmail.com">smbifyagency@gmail.com</a></li>
                        <li>Email: <a href="mailto:info@smbify.agency">info@smbify.agency</a></li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
