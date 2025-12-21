// Legal page templates for SaaS and business websites
// Each template uses placeholders that will be replaced with business info

export interface LegalPageTemplate {
    id: string;
    title: string;
    slug: string;
    description: string;
    content: string;
}

// Placeholder tokens:
// {{BUSINESS_NAME}} - Business name
// {{BUSINESS_EMAIL}} - Contact email
// {{BUSINESS_WEBSITE}} - Website URL
// {{CURRENT_DATE}} - Current date
// {{BUSINESS_ADDRESS}} - Business address

export const LEGAL_TEMPLATES: LegalPageTemplate[] = [
    {
        id: 'privacy-policy',
        title: 'Privacy Policy',
        slug: 'privacy-policy',
        description: 'Standard privacy policy for websites collecting user data',
        content: `
<h1>Privacy Policy</h1>
<p><em>Last updated: {{CURRENT_DATE}}</em></p>

<h2>Introduction</h2>
<p>{{BUSINESS_NAME}} ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website.</p>

<h2>Information We Collect</h2>
<p>We may collect the following types of information:</p>
<ul>
    <li><strong>Personal Information:</strong> Name, email address, phone number, and other contact details you provide through forms</li>
    <li><strong>Usage Data:</strong> IP address, browser type, pages visited, time spent on pages, and other diagnostic data</li>
    <li><strong>Cookies:</strong> Small data files stored on your device to enhance your browsing experience</li>
</ul>

<h2>How We Use Your Information</h2>
<p>We use the collected information for:</p>
<ul>
    <li>Providing and maintaining our services</li>
    <li>Responding to your inquiries and requests</li>
    <li>Sending promotional communications (with your consent)</li>
    <li>Analyzing website usage to improve our services</li>
    <li>Complying with legal obligations</li>
</ul>

<h2>Data Security</h2>
<p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>

<h2>Third-Party Services</h2>
<p>We may use third-party services (such as analytics providers) that collect, monitor, and analyze data. These services have their own privacy policies.</p>

<h2>Your Rights</h2>
<p>Depending on your location, you may have rights to:</p>
<ul>
    <li>Access your personal data</li>
    <li>Request correction of your data</li>
    <li>Request deletion of your data</li>
    <li>Object to or restrict processing</li>
    <li>Data portability</li>
</ul>

<h2>Contact Us</h2>
<p>If you have questions about this Privacy Policy, please contact us at:</p>
<p>Email: {{BUSINESS_EMAIL}}<br>
Website: {{BUSINESS_WEBSITE}}</p>
`,
    },
    {
        id: 'terms-conditions',
        title: 'Terms and Conditions',
        slug: 'terms',
        description: 'Terms of service for website usage',
        content: `
<h1>Terms and Conditions</h1>
<p><em>Last updated: {{CURRENT_DATE}}</em></p>

<h2>Agreement to Terms</h2>
<p>By accessing or using the {{BUSINESS_NAME}} website, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access our website.</p>

<h2>Intellectual Property</h2>
<p>The content on this website, including text, graphics, logos, images, and software, is the property of {{BUSINESS_NAME}} and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our permission.</p>

<h2>Use of Our Services</h2>
<p>You agree to use our website and services only for lawful purposes and in accordance with these Terms. You agree not to:</p>
<ul>
    <li>Use the website in any way that violates applicable laws</li>
    <li>Attempt to gain unauthorized access to our systems</li>
    <li>Interfere with or disrupt the website's functionality</li>
    <li>Upload malicious code or harmful content</li>
</ul>

<h2>Disclaimer of Warranties</h2>
<p>Our website and services are provided "as is" without warranties of any kind, either express or implied. We do not guarantee that our website will be error-free, secure, or continuously available.</p>

<h2>Limitation of Liability</h2>
<p>To the fullest extent permitted by law, {{BUSINESS_NAME}} shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or services.</p>

<h2>Indemnification</h2>
<p>You agree to indemnify and hold {{BUSINESS_NAME}} harmless from any claims, damages, or expenses arising from your use of the website or violation of these Terms.</p>

<h2>Modifications</h2>
<p>We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the website constitutes acceptance of the modified Terms.</p>

<h2>Governing Law</h2>
<p>These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.</p>

<h2>Contact Information</h2>
<p>For questions about these Terms, please contact us at:</p>
<p>Email: {{BUSINESS_EMAIL}}<br>
Website: {{BUSINESS_WEBSITE}}</p>
`,
    },
    {
        id: 'refund-policy',
        title: 'Refund Policy',
        slug: 'refund-policy',
        description: 'Refund and cancellation policy for services',
        content: `
<h1>Refund Policy</h1>
<p><em>Last updated: {{CURRENT_DATE}}</em></p>

<h2>Overview</h2>
<p>At {{BUSINESS_NAME}}, we strive to ensure complete customer satisfaction. This Refund Policy outlines the terms and conditions for refunds and cancellations.</p>

<h2>Eligibility for Refunds</h2>
<p>Refund requests may be considered under the following circumstances:</p>
<ul>
    <li>Services not delivered as described</li>
    <li>Technical issues preventing service delivery</li>
    <li>Cancellation within the specified cooling-off period</li>
</ul>

<h2>Refund Request Process</h2>
<p>To request a refund:</p>
<ol>
    <li>Contact us via email at {{BUSINESS_EMAIL}}</li>
    <li>Provide your order details and reason for the refund request</li>
    <li>Allow 5-7 business days for review</li>
</ol>

<h2>Processing Time</h2>
<p>Approved refunds will be processed within 10 business days. The refund will be credited to your original payment method.</p>

<h2>Non-Refundable Items</h2>
<p>The following are generally non-refundable:</p>
<ul>
    <li>Completed and delivered services</li>
    <li>Custom or personalized work already completed</li>
    <li>Services used beyond the trial period</li>
</ul>

<h2>Subscription Cancellations</h2>
<p>Subscription services may be canceled at any time. Cancellation will take effect at the end of the current billing period. No partial refunds are provided for unused portions of a billing period.</p>

<h2>Contact Us</h2>
<p>For refund inquiries, please contact us at:</p>
<p>Email: {{BUSINESS_EMAIL}}<br>
Website: {{BUSINESS_WEBSITE}}</p>
`,
    },
    {
        id: 'cookie-policy',
        title: 'Cookie Policy',
        slug: 'cookies',
        description: 'Information about website cookie usage',
        content: `
<h1>Cookie Policy</h1>
<p><em>Last updated: {{CURRENT_DATE}}</em></p>

<h2>What Are Cookies</h2>
<p>Cookies are small text files that are placed on your device when you visit a website. They help the website remember your preferences and improve your browsing experience.</p>

<h2>How We Use Cookies</h2>
<p>{{BUSINESS_NAME}} uses cookies for the following purposes:</p>

<h3>Essential Cookies</h3>
<p>These cookies are necessary for the website to function properly. They enable basic features like page navigation and access to secure areas.</p>

<h3>Analytics Cookies</h3>
<p>We use analytics cookies to understand how visitors interact with our website. This helps us improve our content and user experience.</p>

<h3>Functional Cookies</h3>
<p>These cookies remember your preferences (such as language or region) to provide a more personalized experience.</p>

<h3>Marketing Cookies</h3>
<p>Marketing cookies track visitors across websites to display relevant advertisements.</p>

<h2>Managing Cookies</h2>
<p>You can control and manage cookies through your browser settings. Most browsers allow you to:</p>
<ul>
    <li>View what cookies are stored</li>
    <li>Delete cookies individually or in bulk</li>
    <li>Block cookies from certain sites</li>
    <li>Block all cookies</li>
</ul>
<p>Note that disabling cookies may affect website functionality.</p>

<h2>Contact Us</h2>
<p>If you have questions about our use of cookies, please contact us at:</p>
<p>Email: {{BUSINESS_EMAIL}}<br>
Website: {{BUSINESS_WEBSITE}}</p>
`,
    },
];

// Replace placeholders in template content
export function populateLegalTemplate(
    template: LegalPageTemplate,
    businessInfo: {
        businessName: string;
        businessEmail: string;
        businessWebsite: string;
        businessAddress?: string;
    }
): string {
    let content = template.content;
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    content = content.replace(/\{\{BUSINESS_NAME\}\}/g, businessInfo.businessName);
    content = content.replace(/\{\{BUSINESS_EMAIL\}\}/g, businessInfo.businessEmail || 'contact@example.com');
    content = content.replace(/\{\{BUSINESS_WEBSITE\}\}/g, businessInfo.businessWebsite || '#');
    content = content.replace(/\{\{CURRENT_DATE\}\}/g, currentDate);
    content = content.replace(
        /\{\{BUSINESS_ADDRESS\}\}/g,
        businessInfo.businessAddress || 'Address not provided'
    );

    return content;
}

// Get template by ID
export function getLegalTemplate(id: string): LegalPageTemplate | undefined {
    return LEGAL_TEMPLATES.find(t => t.id === id);
}
