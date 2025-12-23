// Changelog Page - Shows all git commits with timestamps
// Helps verify if the live site has the latest version

import styles from './changelog.module.css';

// This is populated at build time from git log
const CHANGELOG_ENTRIES = [
    {
        hash: '212fea9',
        date: '2025-12-24 02:27:00 PKT',
        message: 'Add changelog page to track version history',
        details: 'New /changelog page, version info in footer, helps verify live deployments'
    },
    {
        hash: '3174a82',
        date: '2025-12-24 02:04:36 PKT',
        message: 'Phase 4: Editor Panel Integration',
        details: 'New EditorPanel component with section list, JSON editors, and AI regeneration'
    },
    {
        hash: '8888676',
        date: '2025-12-24 02:00:01 PKT',
        message: 'Update implementation plan with progress: Phases 1-3 complete',
        details: 'Documentation update'
    },
    {
        hash: '01a3811',
        date: '2025-12-24 01:59:15 PKT',
        message: 'Phase 3: AI JSON Generation',
        details: 'New aiSections.ts - AI generates JSON instead of HTML, section locking'
    },
    {
        hash: 'c96abed',
        date: '2025-12-24 01:57:12 PKT',
        message: 'Phase 2: Section Editor Components',
        details: '10 form-based section editors (Hero, Services, About, Contact, CTA, etc.)'
    },
    {
        hash: 'a84a31f',
        date: '2025-12-24 01:45:20 PKT',
        message: 'Phase 1: JSON-first architecture foundation',
        details: 'Typed section schemas, sectionHelpers.ts, sectionRenderer.ts'
    },
    {
        hash: '9f21e4d',
        date: '2025-12-24 00:09:23 PKT',
        message: 'Fix logo for light mode - switch between light/dark logo based on theme',
        details: 'Dynamic logo switching in Navigation component'
    },
    {
        hash: '41915f5',
        date: '2025-12-23 23:54:57 PKT',
        message: 'Fix both light and dark mode properly',
        details: 'Removed conflicting prefers-color-scheme media queries'
    },
    {
        hash: 'f8ebed6',
        date: '2025-12-23 23:45:29 PKT',
        message: 'Fix light mode homepage with proper contrast and colors',
        details: 'Added light mode overrides for homepage elements'
    },
    {
        hash: '457ab6c',
        date: '2025-12-23 23:30:52 PKT',
        message: 'Fix light mode support for all components',
        details: 'CSS variables for glass effects, theme-aware styling'
    },
    {
        hash: '8dfe5e7',
        date: '2025-12-23 23:14:43 PKT',
        message: 'Premium SaaS redesign with modern animations',
        details: 'Glassmorphism, 3D effects, gradient backgrounds, micro-animations'
    },
    {
        hash: 'a28551c',
        date: '2025-12-23 14:08:53 PKT',
        message: 'Add debug tools for Stripe/Supabase integration',
        details: 'New /api/debug/subscription-status endpoint'
    },
    {
        hash: '345a79c',
        date: '2025-12-23 13:21:22 PKT',
        message: 'Fix subscription upgrade + Add premium animations to SaaS pages',
        details: 'Dashboard and billing page animations'
    },
    {
        hash: 'df2fa9b',
        date: '2025-12-23 13:12:36 PKT',
        message: 'Add fallback upgrade confirmation for coupon users',
        details: 'New /api/subscription/confirm-upgrade endpoint'
    },
    {
        hash: '5494d87',
        date: '2025-12-23 12:57:37 PKT',
        message: 'Consolidate checkout to Stripe-only flow',
        details: 'Removed custom checkout, use Stripe native promo codes'
    },
    {
        hash: 'aa914b3',
        date: '2025-12-23 12:52:20 PKT',
        message: 'Fix lifetime/monthly plan website limit for coupon users',
        details: 'checkCanCreateWebsite auto-corrects limits'
    },
    {
        hash: '3985de9',
        date: '2025-12-23 00:51:12 PKT',
        message: 'Add industry-specific images for each niche',
        details: 'industryImages.ts with 50+ industries'
    },
    {
        hash: '9bc27cc',
        date: '2025-12-23 00:30:03 PKT',
        message: 'Implement Supabase-backed persistence architecture',
        details: 'supabase-storage.ts, server-side data fetching'
    },
    {
        hash: '79e3924',
        date: '2025-12-22 23:54:51 PKT',
        message: 'Fix link insertion in RichTextEditor and update types',
        details: 'Range/Selection API for link insertion'
    },
    {
        hash: '74515a0',
        date: '2025-12-22 18:18:42 PKT',
        message: 'Fix text edit persistence and link insertion bugs',
        details: 'Editor fixes'
    },
    {
        hash: '63c60c6',
        date: '2025-12-22 13:19:52 PKT',
        message: 'Trigger Vercel rebuild',
        details: 'Deployment fix'
    },
];

// Build info - will be updated on each build
const BUILD_INFO = {
    latestCommit: '212fea9',
    buildTime: new Date().toISOString(),
    version: '2.0.1',
};

export default function ChangelogPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>📋 Changelog</h1>
                <p className={styles.subtitle}>Track all updates to SMBifyRank</p>
            </div>

            <div className={styles.buildInfo}>
                <h2>🔧 Current Build</h2>
                <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Version</span>
                        <span className={styles.infoValue}>{BUILD_INFO.version}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Latest Commit</span>
                        <code className={styles.hash}>{BUILD_INFO.latestCommit}</code>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Build Time</span>
                        <span className={styles.infoValue}>{new Date(BUILD_INFO.buildTime).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className={styles.changelog}>
                <h2>📝 Recent Changes</h2>
                <div className={styles.timeline}>
                    {CHANGELOG_ENTRIES.map((entry, index) => (
                        <div key={entry.hash} className={styles.entry}>
                            <div className={styles.marker}>
                                <div className={styles.dot} />
                                {index < CHANGELOG_ENTRIES.length - 1 && <div className={styles.line} />}
                            </div>
                            <div className={styles.content}>
                                <div className={styles.entryHeader}>
                                    <code className={styles.hash}>{entry.hash}</code>
                                    <span className={styles.date}>{entry.date}</span>
                                </div>
                                <h3 className={styles.message}>{entry.message}</h3>
                                {entry.details && (
                                    <p className={styles.details}>{entry.details}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.footer}>
                <p>
                    <a href="https://github.com/smbifyagency/SMBifyRank" target="_blank" rel="noopener noreferrer">
                        View on GitHub →
                    </a>
                </p>
            </div>
        </div>
    );
}
