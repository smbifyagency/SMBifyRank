'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Website } from '@/lib/types';
import { getAllWebsites, deleteWebsite, saveWebsite } from '@/lib/storage';
import { generateDemoWebsite } from '@/lib/demoData';
import styles from './app.module.css';

export default function AppDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [websites, setWebsites] = useState<Website[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

    useEffect(() => {
        // Check authentication
        const guestMode = localStorage.getItem('guest-mode');
        if (guestMode === 'true') {
            setIsGuest(true);
        } else if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        setWebsites(getAllWebsites());
        setIsLoading(false);
    }, [status, router]);

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

    const handleLoadDemo = () => {
        const demoWebsite = generateDemoWebsite();
        saveWebsite(demoWebsite);
        setWebsites(getAllWebsites());
    };

    if (status === 'loading' || isLoading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading...</p>
            </div>
        );
    }

    // If not guest and not authenticated, redirect handled above
    if (!isGuest && !session) {
        return null;
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h1>My Websites</h1>
                        <p>Manage your AI-generated websites</p>
                    </div>
                    <div className={styles.headerActions}>
                        <button onClick={handleLoadDemo} className={styles.demoBtn}>
                            📦 Load Demo
                        </button>
                        <Link href="/app/create" className={styles.createBtn}>
                            + New Website
                        </Link>
                    </div>
                </div>

                {/* Quick Links */}
                <div className={styles.quickLinks}>
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
                            <button onClick={handleLoadDemo} className={styles.demoBtn}>
                                Load Demo Data
                            </button>
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
        </div>
    );
}
