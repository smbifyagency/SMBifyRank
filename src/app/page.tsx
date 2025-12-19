'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>🚀 AI-Powered Website Builder</span>
            <h1>Build SEO-Optimized Websites<br />in Minutes</h1>
            <p>
              Generate complete static HTML websites with AI. Perfect for local businesses,
              service companies, and SEO-focused campaigns. No coding required.
            </p>
            <div className={styles.heroCta}>
              <Link href="/app" className={styles.primaryBtn}>
                Start Building Free →
              </Link>
              <Link href="#how-it-works" className={styles.secondaryBtn}>
                See How It Works
              </Link>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>31+</span>
                <span className={styles.statLabel}>Industry Templates</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>5 min</span>
                <span className={styles.statLabel}>Avg. Build Time</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>100%</span>
                <span className={styles.statLabel}>SEO Optimized</span>
              </div>
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

      {/* How It Works Section */}
      <section id="how-it-works" className={styles.howItWorks}>
        <div className={styles.container}>
          <span className={styles.sectionBadge}>Simple Process</span>
          <h2>Build Your Website in 4 Easy Steps</h2>
          <div className={styles.stepsGrid}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepIcon}>📋</div>
              <h3>Enter Business Info</h3>
              <p>Tell us about your business, industry, services, and locations. We&apos;ll use this to generate your site.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepIcon}>🎨</div>
              <h3>Choose Your Brand</h3>
              <p>Upload your logo and pick your brand colors. We&apos;ll apply them across your entire website.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepIcon}>🤖</div>
              <h3>AI Generates Content</h3>
              <p>Our AI creates SEO-optimized content for every page - home, about, services, and location pages.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepIcon}>🚀</div>
              <h3>Export & Deploy</h3>
              <p>Download your complete website as a ZIP or deploy directly to Netlify with one click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.container}>
          <span className={styles.sectionBadge}>Powerful Features</span>
          <h2>Everything You Need to Rank</h2>
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
              <p>Built-in blog with AI article generation. Create content that ranks and drives traffic.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔍</div>
              <h3>SEO Optimized</h3>
              <p>Clean HTML, meta tags, schema markup, and structured content. Every page is optimized for search engines.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⚡</div>
              <h3>Fast Static Sites</h3>
              <p>Pure HTML/CSS output means blazing fast load times. No JavaScript bloat, no database lag.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={styles.pricing}>
        <div className={styles.container}>
          <span className={styles.sectionBadge}>Simple Pricing</span>
          <h2>Choose Your Plan</h2>
          <p className={styles.pricingSubtext}>Start free, upgrade when you need more</p>

          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <div className={styles.pricingHeader}>
                <h3>Free</h3>
                <div className={styles.price}>
                  <span className={styles.priceAmount}>$0</span>
                  <span className={styles.priceLabel}>forever</span>
                </div>
              </div>
              <ul className={styles.pricingFeatures}>
                <li>✓ 1 Website</li>
                <li>✓ All 31 Industry Templates</li>
                <li>✓ Basic AI Content</li>
                <li>✓ Manual ZIP Export</li>
                <li>✓ Visual Editor</li>
                <li className={styles.featureDisabled}>✕ Blog System</li>
                <li className={styles.featureDisabled}>✕ Priority Support</li>
              </ul>
              <Link href="/app" className={styles.pricingBtn}>
                Get Started Free
              </Link>
            </div>

            <div className={`${styles.pricingCard} ${styles.pricingPopular}`}>
              <div className={styles.popularBadge}>Most Popular</div>
              <div className={styles.pricingHeader}>
                <h3>Pro</h3>
                <div className={styles.price}>
                  <span className={styles.priceAmount}>$29</span>
                  <span className={styles.priceLabel}>/month</span>
                </div>
              </div>
              <ul className={styles.pricingFeatures}>
                <li>✓ 5 Websites</li>
                <li>✓ All 31 Industry Templates</li>
                <li>✓ Advanced AI Content</li>
                <li>✓ One-Click Netlify Deploy</li>
                <li>✓ Visual Editor</li>
                <li>✓ Full Blog System</li>
                <li>✓ Email Support</li>
              </ul>
              <Link href="/app" className={styles.pricingBtnPrimary}>
                Start Pro Trial
              </Link>
            </div>

            <div className={styles.pricingCard}>
              <div className={styles.pricingHeader}>
                <h3>Agency</h3>
                <div className={styles.price}>
                  <span className={styles.priceAmount}>$99</span>
                  <span className={styles.priceLabel}>/month</span>
                </div>
              </div>
              <ul className={styles.pricingFeatures}>
                <li>✓ Unlimited Websites</li>
                <li>✓ All 31 Industry Templates</li>
                <li>✓ Advanced AI Content</li>
                <li>✓ One-Click Netlify Deploy</li>
                <li>✓ White-Label Option</li>
                <li>✓ API Access</li>
                <li>✓ Priority Support</li>
              </ul>
              <Link href="/app" className={styles.pricingBtn}>
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>Ready to Build Your Website?</h2>
            <p>Join thousands of local businesses using SMBify Rank to dominate search results</p>
            <Link href="/app" className={styles.primaryBtn}>
              Start Building Now - It&apos;s Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerBrand}>
              <Image
                src="/logo-dark.png"
                alt="SMBify Rank"
                width={140}
                height={32}
              />
              <p>AI-powered website builder for local businesses</p>
            </div>
            <div className={styles.footerLinks}>
              <div className={styles.footerColumn}>
                <h4>Product</h4>
                <Link href="#features">Features</Link>
                <Link href="#pricing">Pricing</Link>
                <Link href="#how-it-works">How It Works</Link>
              </div>
              <div className={styles.footerColumn}>
                <h4>Company</h4>
                <a href="https://smbify.agency" target="_blank" rel="noopener noreferrer">SMBify Agency</a>
                <Link href="/login">Sign In</Link>
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>© 2025 SMBify Rank. All rights reserved.</p>
            <p>Powered by <a href="https://smbify.agency" target="_blank" rel="noopener noreferrer">smbify.agency</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
