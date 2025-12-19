'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1>Build SEO-Optimized Websites<br />in Minutes</h1>
            <p>
              Generate complete static HTML websites with AI. Perfect for local businesses,
              service companies, and SEO-focused campaigns.
            </p>
            <div className={styles.heroCta}>
              <Link href="/app" className={styles.primaryBtn}>
                🚀 Get Started
              </Link>
              <Link href="/login" className={styles.secondaryBtn}>
                Sign In
              </Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.mockupWindow}>
              <div className={styles.mockupHeader}>
                <span></span><span></span><span></span>
              </div>
              <div className={styles.mockupContent}>
                <div className={styles.mockupNav}></div>
                <div className={styles.mockupHero}></div>
                <div className={styles.mockupCards}>
                  <div></div><div></div><div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.container}>
          <h2>Everything You Need</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🤖</div>
              <h3>AI-Powered Generation</h3>
              <p>Generate complete websites from a simple form. Pages are automatically created based on your services and locations.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>✏️</div>
              <h3>Visual Editor</h3>
              <p>Edit text, images, and sections visually. No coding required. See changes in real-time.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📍</div>
              <h3>Location Pages</h3>
              <p>Automatically generate city-specific pages for local SEO. Target multiple locations effortlessly.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📝</div>
              <h3>Blog System</h3>
              <p>Built-in blog with full backlink support. Create content that ranks and drives traffic.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔍</div>
              <h3>SEO Optimized</h3>
              <p>Clean HTML, meta tags, and structured content. Every page is optimized for search engines.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🚀</div>
              <h3>One-Click Deploy</h3>
              <p>Deploy to Netlify instantly or download as a ZIP. Host anywhere you want.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>Ready to Build Your Website?</h2>
            <p>Start creating SEO-optimized websites in minutes with AI</p>
            <Link href="/app" className={styles.primaryBtn}>
              Start Building Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerBrand}>
              <span className={styles.logoIcon}>🚀</span>
              AI Website Builder
            </div>
            <p>Generate, edit, and deploy SEO-optimized static websites.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
