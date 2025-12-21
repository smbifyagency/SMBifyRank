'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from './ThemeProvider';
import styles from './Footer.module.css';

export default function Footer() {
    const { resolvedTheme } = useTheme();
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { name: 'Facebook', url: 'https://facebook.com/smbify', icon: '📘' },
        { name: 'Instagram', url: 'https://instagram.com/smbify', icon: '📸' },
        { name: 'Twitter', url: 'https://twitter.com/smbify', icon: '🐦' },
        { name: 'LinkedIn', url: 'https://linkedin.com/company/smbify', icon: '💼' },
        { name: 'YouTube', url: 'https://youtube.com/@smbify', icon: '📺' },
    ];

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Top Section */}
                <div className={styles.top}>
                    {/* Brand */}
                    <div className={styles.brand}>
                        <Link href="/" className={styles.logo}>
                            <Image
                                src={resolvedTheme === 'dark' ? '/logo-dark.png' : '/logo-light.png'}
                                alt="SMBify Rank"
                                width={140}
                                height={32}
                                className={styles.logoImage}
                            />
                        </Link>
                        <p className={styles.brandDesc}>
                            AI-powered website generator for local businesses.
                            Build SEO-optimized static websites in minutes, not weeks.
                        </p>
                        {/* Social Links */}
                        <div className={styles.social}>
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.socialIcon}
                                    title={social.name}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className={styles.linksGrid}>
                        {/* Product */}
                        <div className={styles.linkColumn}>
                            <h3>Product</h3>
                            <Link href="/#features">Features</Link>
                            <Link href="/how-it-works">How It Works</Link>
                            <Link href="/pricing">Pricing</Link>
                            <Link href="/app">Dashboard</Link>
                        </div>

                        {/* Company */}
                        <div className={styles.linkColumn}>
                            <h3>Company</h3>
                            <Link href="/about">About Us</Link>
                            <Link href="/contact">Contact</Link>
                            <a href="https://www.smbify.agency" target="_blank" rel="noopener noreferrer">
                                SMBify Agency
                            </a>
                        </div>

                        {/* Legal */}
                        <div className={styles.linkColumn}>
                            <h3>Legal</h3>
                            <Link href="/privacy">Privacy Policy</Link>
                            <Link href="/terms">Terms of Service</Link>
                        </div>

                        {/* Contact */}
                        <div className={styles.linkColumn}>
                            <h3>Contact</h3>
                            <a href="mailto:smbifyagency@gmail.com">smbifyagency@gmail.com</a>
                            <a href="mailto:info@smbify.agency">info@smbify.agency</a>
                            <a href="tel:+923066050256">0306-6050256</a>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        © {currentYear} SMBify Rank. All rights reserved.
                    </p>
                    <p className={styles.agency}>
                        A product of <a href="https://www.smbify.agency" target="_blank" rel="noopener noreferrer">SMBify Agency</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
