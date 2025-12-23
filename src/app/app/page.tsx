'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAuth } from '@/lib/useAuth';
import { Website } from '@/lib/types';
import { getAllWebsites, deleteWebsite, saveWebsite, generateId } from '@/lib/storage';
import { DeployModal } from '@/components/DeployModal';
import { UpgradeModal } from '@/components/UpgradeModal';
import { useToast } from '@/components/Toast';
import styles from './app.module.css';

// Demo website data for testing
const createDemoWebsite = (): Website => ({
    id: generateId(),
    name: 'Demo Roofing Company',
    businessName: 'Elite Roofing Pro',
    industry: 'Roofing',
    services: [
        { id: generateId(), name: 'Roof Repair', description: 'Professional roof repair services', slug: 'roof-repair', icon: '🔧' },
        { id: generateId(), name: 'Roof Replacement', description: 'Complete roof replacement', slug: 'roof-replacement', icon: '🏠' },
    ],
    locations: [
        { id: generateId(), city: 'Raleigh', state: 'NC', slug: 'raleigh' },
    ],
    colors: { primary: '#1a365d', secondary: '#2d3748', accent: '#ed8936', background: '#ffffff', text: '#1a202c' },
    goal: 'leads',
    keywords: ['roofing', 'roof repair', 'raleigh'],
    pages: [
        {
            id: generateId(),
            title: 'Home',
            slug: '',
            type: 'home',
            content: [
                {
                    id: generateId(),
                    type: 'hero',
                    content: {
                        headline: 'Elite Roofing Pro',
                        subheadline: 'Your trusted roofing experts in Raleigh, NC',
                        showCta: true,
                        ctaText: 'Get Free Quote',
                        ctaLink: '/contact',
                    },
                    order: 0,
                },
            ],
            seo: { title: 'Elite Roofing Pro | Raleigh NC', description: 'Professional roofing services', keywords: ['roofing'] },
            order: 0,
            isPublished: true,
        },
    ],
    blogPosts: [],
    seoSettings: { siteName: 'Elite Roofing Pro', siteDescription: 'Professional roofing', socialLinks: {} },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'draft',
    contactPhone: '(555) 123-4567',
    contactEmail: 'info@eliteroofingpro.com',
});

// Wrapper component to handle Suspense for useSearchParams
function AppDashboardContent() {
    const { data: session, status } = useSession();
    const { user: supabaseUser, loading: supabaseLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const toast = useToast();
    const [websites, setWebsites] = useState<Website[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
    const [deployModal, setDeployModal] = useState<{ id: string; name: string } | null>(null);
    const [showUpgrade, setShowUpgrade] = useState(false);
    const [showUpgradeBanner, setShowUpgradeBanner] = useState(false);
    const [upgradedPlan, setUpgradedPlan] = useState<string | null>(null);
    const [isPaidUser, setIsPaidUser] = useState(false);
    const [isTestMode, setIsTestMode] = useState(false);

    // Combined auth check - must be authenticated with either NextAuth or Supabase
    const isAuthenticated = session?.user || supabaseUser;
    const authLoading = status === 'loading' || supabaseLoading;

    // Check for upgrade success from Stripe checkout
    useEffect(() => {
        const upgraded = searchParams.get('upgraded');
        const plan = searchParams.get('plan');

        if (upgraded === 'true' && plan) {
            setShowUpgradeBanner(true);
            setUpgradedPlan(plan);
            toast.success(`🎉 Welcome to ${plan === 'lifetime' ? 'Lifetime' : 'Pro'}! You now have unlimited access.`);

            // Call confirm-upgrade API to ensure subscription is updated
            // (fallback in case webhook didn't fire, e.g., 100% off coupon)
            fetch('/api/subscription/confirm-upgrade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planType: plan }),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        console.log('Subscription confirmed:', data);
                        setIsPaidUser(true);
                    }
                })
                .catch(err => console.error('Confirm upgrade error:', err));

            // Clean up URL params without reload
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }
    }, [searchParams, toast]);

    useEffect(() => {
        // Check for test mode (development only)
        const testMode = searchParams.get('test') === 'true';
        const isDevelopment = process.env.NODE_ENV === 'development';

        if (testMode && isDevelopment) {
            setIsTestMode(true);
            // Load or create demo data in test mode
            let existingWebsites = getAllWebsites();
            if (existingWebsites.length === 0) {
                const demoWebsite = createDemoWebsite();
                saveWebsite(demoWebsite);
                existingWebsites = [demoWebsite];
            }
            setWebsites(existingWebsites);
            setIsLoading(false);
            return;
        }

        // Require authentication - no guest mode
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
            return;
        }

        if (isAuthenticated) {
            setWebsites(getAllWebsites());
            setIsLoading(false);

            // Fetch subscription status
            fetch('/api/subscription')
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (data && (data.plan_type === 'monthly' || data.plan_type === 'lifetime')) {
                        setIsPaidUser(true);
                    }
                })
                .catch(() => { });
        }
    }, [authLoading, isAuthenticated, router, searchParams]);

    const handleDeleteClick = (id: string, name: string) => {
        setDeleteConfirm({ id, name });
    };

    const handleDeleteConfirm = () => {
        if (deleteConfirm) {
            deleteWebsite(deleteConfirm.id);
            setWebsites(getAllWebsites());
            setDeleteConfirm(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirm(null);
    };

    if (authLoading || isLoading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading...</p>
            </div>
        );
    }

    // Must be authenticated (or in test mode) - redirect handled above
    if (!isAuthenticated && !isTestMode) {
        return null;
    }

    // Plan limit check - Free users get 1 website max
    const handleCreateNew = () => {
        const currentCount = websites.length;

        if (!isPaidUser && currentCount >= 1) {
            setShowUpgrade(true);
            return;
        }
        router.push('/create');
    };



    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* Upgrade Success Banner */}
                {showUpgradeBanner && (
                    <div className={styles.successBanner}>
                        <span className={styles.successIcon}>🎉</span>
                        <div className={styles.successContent}>
                            <h3>Welcome to {upgradedPlan === 'lifetime' ? 'Lifetime' : 'Pro'}!</h3>
                            <p>You now have unlimited access to all features. Start building!</p>
                        </div>
                        <button
                            className={styles.dismissBtn}
                            onClick={() => setShowUpgradeBanner(false)}
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h1>My Websites</h1>
                        <p>Manage your AI-generated websites</p>
                    </div>
                    <div className={styles.headerActions}>
                        <button onClick={handleCreateNew} className={styles.createBtn}>
                            + New Website
                        </button>
                    </div>
                </div>

                {/* Quick Links */}
                <div className={styles.quickLinks}>
                    <Link href="/app/blog-writer" className={styles.quickLink}>
                        ✍️ AI Blog Writer
                    </Link>
                    <Link href="/app/blog-manager" className={styles.quickLink}>
                        📝 Blog Manager
                    </Link>
                    <Link href="/app/billing" className={styles.quickLink}>
                        💳 Billing
                    </Link>
                    <Link href="/app/settings" className={styles.quickLink}>
                        ⚙️ API Settings
                    </Link>
                </div>

                {/* Websites Grid */}
                {websites.length > 0 ? (
                    <div className={styles.grid}>
                        {websites.map(website => (
                            <div key={website.id} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <h3>{website.businessName}</h3>
                                    <span className={`${styles.badge} ${website.status === 'published' ? styles.published : styles.draft}`}>
                                        {website.status}
                                    </span>
                                </div>
                                <div className={styles.cardMeta}>
                                    <span>📄 {website.pages.length} pages</span>
                                    <span>📍 {website.locations.length} locations</span>
                                    <span>📝 {website.blogPosts.length} posts</span>
                                </div>
                                <div className={styles.cardActions}>
                                    <Link href={`/dashboard/${website.id}`} className={styles.editBtn}>
                                        Edit
                                    </Link>
                                    <Link href={`/editor/${website.id}`} className={styles.previewBtn}>
                                        Preview
                                    </Link>
                                    <button
                                        className={styles.deployBtn}
                                        onClick={() => setDeployModal({ id: website.id, name: website.businessName })}
                                    >
                                        🚀
                                    </button>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => handleDeleteClick(website.id, website.businessName)}
                                    >
                                        🗑️
                                    </button>
                                </div>
                                {website.netlifyUrl && (
                                    <a
                                        href={website.netlifyUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.liveLink}
                                    >
                                        🌐 {website.netlifyUrl}
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.empty}>
                        <div className={styles.emptyIcon}>🏗️</div>
                        <h2>No Websites Yet</h2>
                        <p>Create your first AI-generated website or load demo data to get started.</p>
                        <div className={styles.emptyActions}>
                            <Link href="/app/create" className={styles.createBtn}>
                                Create Website
                            </Link>

                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Delete Website?</h3>
                        <p>Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.</p>
                        <div className={styles.modalActions}>
                            <button onClick={handleDeleteCancel} className={styles.cancelBtn}>
                                Cancel
                            </button>
                            <button onClick={handleDeleteConfirm} className={styles.confirmDeleteBtn}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Deploy Modal */}
            {deployModal && (
                <DeployModal
                    isOpen={!!deployModal}
                    onClose={() => setDeployModal(null)}
                    siteName={deployModal.name}
                    siteId={deployModal.id}
                    onDeploySuccess={(url) => {
                        toast.success(`Website deployed to ${url}`);
                        setWebsites(getAllWebsites());
                        setDeployModal(null);
                    }}
                />
            )}

            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={showUpgrade}
                onClose={() => setShowUpgrade(false)}
                currentPlan="free"
                websitesCreated={websites.length}
                websiteLimit={1}
            />
        </div>
    );
}

// Default export with Suspense boundary for useSearchParams
export default function AppDashboard() {
    return (
        <Suspense fallback={
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading...</p>
            </div>
        }>
            <AppDashboardContent />
        </Suspense>
    );
}
