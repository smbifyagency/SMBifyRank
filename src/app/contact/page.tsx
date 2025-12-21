'use client';

import { useState } from 'react';
import styles from './contact.module.css';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        // Simulate form submission (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 1000));

        setSubmitted(true);
        setSubmitting(false);
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* Hero */}
                <section className={styles.hero}>
                    <span className={styles.badge}>Get in Touch</span>
                    <h1>Contact Us</h1>
                    <p>Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.</p>
                </section>

                <div className={styles.grid}>
                    {/* Contact Form */}
                    <div className={styles.formSection}>
                        {submitted ? (
                            <div className={styles.successMessage}>
                                <span>✅</span>
                                <h2>Message Sent!</h2>
                                <p>Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="name">Your Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="subject">Subject</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        placeholder="How can we help?"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="message">Message</label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Tell us more about your inquiry..."
                                    />
                                </div>
                                <button type="submit" disabled={submitting} className={styles.submitBtn}>
                                    {submitting ? 'Sending...' : 'Send Message →'}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Contact Info */}
                    <div className={styles.infoSection}>
                        <div className={styles.infoCard}>
                            <h2>Contact Information</h2>
                            <p>Reach out to us through any of the following channels:</p>

                            <div className={styles.contactItems}>
                                <div className={styles.contactItem}>
                                    <span className={styles.icon}>📧</span>
                                    <div>
                                        <h3>Email</h3>
                                        <a href="mailto:smbifyagency@gmail.com">smbifyagency@gmail.com</a>
                                        <a href="mailto:info@smbify.agency">info@smbify.agency</a>
                                    </div>
                                </div>

                                <div className={styles.contactItem}>
                                    <span className={styles.icon}>📞</span>
                                    <div>
                                        <h3>Phone</h3>
                                        <a href="tel:+923066050256">0306-6050256</a>
                                    </div>
                                </div>

                                <div className={styles.contactItem}>
                                    <span className={styles.icon}>🌐</span>
                                    <div>
                                        <h3>Website</h3>
                                        <a href="https://www.smbify.agency" target="_blank" rel="noopener noreferrer">
                                            www.smbify.agency
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.supportCard}>
                            <h3>💡 Need Quick Help?</h3>
                            <p>Check out our documentation or watch our tutorial videos to get started quickly.</p>
                            <a href="/how-it-works" className={styles.supportLink}>
                                See How It Works →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
