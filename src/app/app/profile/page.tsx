'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import styles from './profile.module.css';

export default function ProfilePage() {
    const router = useRouter();
    const { user, loading, signOut } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
            return;
        }
        if (user) {
            setName(user.user_metadata?.full_name || user.user_metadata?.name || '');
            setEmail(user.email || '');
        }
    }, [user, loading, router]);

    const handleSave = async () => {
        setSaving(true);
        setMessage('');

        try {
            // Update user metadata in Supabase
            const response = await fetch('/api/profile/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });

            if (response.ok) {
                setMessage('Profile updated successfully!');
                setIsEditing(false);
            } else {
                setMessage('Failed to update profile');
            }
        } catch {
            setMessage('Error updating profile');
        } finally {
            setSaving(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (!user) {
        return null;
    }

    const isGoogleUser = user.app_metadata?.provider === 'google';

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h1>Profile Settings</h1>

                <div className={styles.card}>
                    <div className={styles.avatarSection}>
                        {user.user_metadata?.avatar_url ? (
                            <img
                                src={user.user_metadata.avatar_url}
                                alt="Profile"
                                className={styles.avatar}
                            />
                        ) : (
                            <div className={styles.avatarPlaceholder}>
                                {name?.charAt(0)?.toUpperCase() || email?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                        )}
                    </div>

                    <div className={styles.form}>
                        <div className={styles.field}>
                            <label>Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={styles.input}
                                />
                            ) : (
                                <p className={styles.value}>{name || 'Not set'}</p>
                            )}
                        </div>

                        <div className={styles.field}>
                            <label>Email</label>
                            <p className={styles.value}>{email}</p>
                            {isGoogleUser && (
                                <span className={styles.badge}>Google Account</span>
                            )}
                        </div>

                        {message && (
                            <p className={styles.message}>{message}</p>
                        )}

                        <div className={styles.actions}>
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleSave}
                                        className={styles.saveBtn}
                                        disabled={saving}
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className={styles.cancelBtn}
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className={styles.editBtn}
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.card}>
                    <h2>Account Details</h2>
                    <div className={styles.accountInfo}>
                        <div className={styles.field}>
                            <label>Account ID</label>
                            <p className={styles.value + ' ' + styles.mono}>{user.id.slice(0, 8)}...{user.id.slice(-4)}</p>
                        </div>
                        <div className={styles.field}>
                            <label>Member Since</label>
                            <p className={styles.value}>
                                {user.created_at
                                    ? new Date(user.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })
                                    : 'Unknown'
                                }
                            </p>
                        </div>
                    </div>
                </div>

                <div className={styles.card}>
                    <h2>Quick Links</h2>
                    <div className={styles.accountActions}>
                        <a href="/app" className={styles.link}>
                            🏠 Dashboard
                        </a>
                        <a href="/app/billing" className={styles.link}>
                            💳 Billing & Subscription
                        </a>
                        <a href="/app/settings" className={styles.link}>
                            ⚙️ API Settings
                        </a>
                        <button onClick={handleSignOut} className={styles.signOutBtn}>
                            🚪 Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
