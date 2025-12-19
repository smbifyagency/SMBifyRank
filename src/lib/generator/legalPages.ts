// Legal Pages Generator - Auto-generate Privacy Policy and Terms of Service

import { Website } from '../types';

export interface LegalPage {
    slug: string;
    title: string;
    content: string;
}

export function generatePrivacyPolicy(website: Website): LegalPage {
    const businessName = website.businessName;
    const contactEmail = website.contactEmail || 'contact@example.com';
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const content = `
        <section class="legal-content">
            <p class="last-updated">Last Updated: ${currentDate}</p>
            
            <h2>Introduction</h2>
            <p>${businessName} ("we," "our," or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>
            
            <h2>Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>We may collect personal information that you voluntarily provide to us when you:</p>
            <ul>
                <li>Fill out contact forms</li>
                <li>Request quotes or estimates</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact us via phone, email, or social media</li>
            </ul>
            <p>This information may include your name, email address, phone number, address, and any other information you choose to provide.</p>
            
            <h3>Automatically Collected Information</h3>
            <p>When you visit our website, we may automatically collect certain information about your device, including:</p>
            <ul>
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent</li>
                <li>Referring website addresses</li>
            </ul>
            
            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
                <li>Respond to your inquiries and provide customer service</li>
                <li>Process and fulfill service requests</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
            </ul>
            
            <h2>Information Sharing</h2>
            <p>We do not sell, trade, or otherwise transfer your personal information to outside parties except:</p>
            <ul>
                <li>To trusted third parties who assist us in operating our website or conducting our business</li>
                <li>When required by law or to protect our rights</li>
                <li>With your consent</li>
            </ul>
            
            <h2>Cookies and Tracking Technologies</h2>
            <p>We may use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.</p>
            
            <h2>Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>
            
            <h2>Your Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, or delete your data. To exercise these rights, please contact us.</p>
            
            <h2>Children's Privacy</h2>
            <p>Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.</p>
            
            <h2>Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
            
            <h2>Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at:</p>
            <p><strong>${businessName}</strong><br>
            Email: <a href="mailto:${contactEmail}">${contactEmail}</a></p>
        </section>
    `;

    return {
        slug: 'privacy-policy',
        title: 'Privacy Policy',
        content
    };
}

export function generateTermsOfService(website: Website): LegalPage {
    const businessName = website.businessName;
    const contactEmail = website.contactEmail || 'contact@example.com';
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const content = `
        <section class="legal-content">
            <p class="last-updated">Last Updated: ${currentDate}</p>
            
            <h2>Agreement to Terms</h2>
            <p>By accessing and using the website of ${businessName} ("we," "our," or "us"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.</p>
            
            <h2>Use of Our Website</h2>
            <p>You agree to use our website only for lawful purposes and in a way that does not infringe the rights of others or restrict their use of the website.</p>
            <p>You agree not to:</p>
            <ul>
                <li>Use the website in any way that violates applicable laws or regulations</li>
                <li>Attempt to gain unauthorized access to any part of the website</li>
                <li>Transmit any harmful code or malware</li>
                <li>Collect or harvest any information from the website</li>
                <li>Impersonate any person or entity</li>
            </ul>
            
            <h2>Intellectual Property</h2>
            <p>All content on this website, including text, graphics, logos, images, and software, is the property of ${businessName} or its content suppliers and is protected by copyright and other intellectual property laws.</p>
            <p>You may not reproduce, distribute, modify, or create derivative works from any content without our express written permission.</p>
            
            <h2>Services</h2>
            <p>We reserve the right to modify, suspend, or discontinue any aspect of our services at any time without prior notice. Specific service agreements may be subject to additional terms.</p>
            
            <h2>Limitation of Liability</h2>
            <p>${businessName} shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the website or services.</p>
            <p>In no event shall our total liability exceed the amount you paid to us for services in the twelve (12) months preceding the claim.</p>
            
            <h2>Disclaimer of Warranties</h2>
            <p>The website and services are provided "as is" and "as available" without any warranties of any kind, either express or implied, including but not limited to:</p>
            <ul>
                <li>Merchantability</li>
                <li>Fitness for a particular purpose</li>
                <li>Non-infringement</li>
                <li>Accuracy or completeness of content</li>
            </ul>
            
            <h2>Indemnification</h2>
            <p>You agree to indemnify and hold harmless ${businessName} and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising from your use of the website or violation of these terms.</p>
            
            <h2>Governing Law</h2>
            <p>These Terms of Service shall be governed by and construed in accordance with the laws of the state in which ${businessName} operates, without regard to conflict of law principles.</p>
            
            <h2>Dispute Resolution</h2>
            <p>Any disputes arising from these terms or your use of our services shall first be attempted to be resolved through good-faith negotiation. If resolution cannot be reached, disputes shall be submitted to binding arbitration.</p>
            
            <h2>Changes to Terms</h2>
            <p>We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website constitutes acceptance of the modified terms.</p>
            
            <h2>Contact Information</h2>
            <p>If you have any questions about these Terms of Service, please contact us at:</p>
            <p><strong>${businessName}</strong><br>
            Email: <a href="mailto:${contactEmail}">${contactEmail}</a></p>
        </section>
    `;

    return {
        slug: 'terms-of-service',
        title: 'Terms of Service',
        content
    };
}

export function generateLegalPages(website: Website): LegalPage[] {
    return [
        generatePrivacyPolicy(website),
        generateTermsOfService(website)
    ];
}

// CSS for legal pages
export const legalPageStyles = `
    .legal-content {
        max-width: 800px;
        margin: 0 auto;
        padding: 60px 20px;
        line-height: 1.8;
    }
    
    .legal-content h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        color: var(--text);
    }
    
    .legal-content h2 {
        font-size: 1.5rem;
        margin-top: 2rem;
        margin-bottom: 1rem;
        color: var(--text);
        border-bottom: 2px solid var(--primary);
        padding-bottom: 0.5rem;
    }
    
    .legal-content h3 {
        font-size: 1.2rem;
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
        color: var(--text);
    }
    
    .legal-content p {
        margin-bottom: 1rem;
        color: var(--text-muted);
    }
    
    .legal-content ul {
        margin-bottom: 1rem;
        padding-left: 2rem;
    }
    
    .legal-content li {
        margin-bottom: 0.5rem;
        color: var(--text-muted);
    }
    
    .legal-content a {
        color: var(--primary);
        text-decoration: underline;
    }
    
    .last-updated {
        font-style: italic;
        color: var(--text-muted);
        border-left: 3px solid var(--primary);
        padding-left: 1rem;
        margin-bottom: 2rem;
    }
`;
