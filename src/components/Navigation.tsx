'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from './ThemeProvider';
import { useAuth } from '@/lib/useAuth';
import styles from './Navigation.module.css';

export default function Navigation() {
    const pathname = usePathname();
    const router = useRouter();

    // NextAuth (legacy)
    const { data: session, status } = useSession();

    // Supabase auth (new)
    const { user: supabaseUser, loading: supabaseLoading, signOut: supabaseSignOut } = useAuth();

    const [isGuest, setIsGuest] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        const guestMode = localStorage.getItem('guest-mode');
        setIsGuest(guestMode === 'true');
    }, []);

    // Check if we're in the protected app area
    const isAppArea = pathname.startsWith('/app') ||
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/editor') ||
        pathname === '/create';

    // Show simple navigation on login page
    if (pathname === '/login') {
        return (
            <nav className={styles.nav}>
                <div className={styles.container}>
                    <Link href="/" className={styles.logo}>
                        <Image
                            src={resolvedTheme === 'dark' ? '/logo-dark.png' : '/logo-light.png'}
                            alt="SMBify Rank"
                            width={140}
                            height={32}
                            className={styles.logoImage}
                            priority
                        />
                    </Link>
                    <div className={styles.links}>
                        <Link href="/" className={styles.link}>
                            ← Back to Home
                        </Link>
                        <ThemeToggle />
                    </div>
                </div>
            </nav>
        );
    }

    const handleExitGuest = () => {
        localStorage.removeItem('guest-mode');
        setIsGuest(false);
        router.push('/login');
    };

    const handleSignOut = async () => {
        // Sign out from both auth systems
        if (supabaseUser) {
            await supabaseSignOut();
        }
        if (session) {
            await nextAuthSignOut({ callbackUrl: '/login' });
        } else {
            router.push('/login');
        }
    };

    // Combined auth state (Supabase takes priority)
    const currentUser = supabaseUser || session?.user;
    const isLoading = supabaseLoading || status === 'loading';
    const isAuthenticated = currentUser || isGuest;

    // Public homepage navigation
    if (!isAppArea) {
        return (
            <nav className={styles.nav}>
                <div className={styles.container}>
                    <Link href="/" className={styles.logo}>
                        <Image
                            src={resolvedTheme === 'dark' ? '/logo-dark.png' : '/logo-light.png'}
                            alt="SMBify Rank"
                            width={140}
                            height={32}
                            className={styles.logoImage}
                            priority
                        />
                    </Link>

                    <div className={styles.links}>
                        <a href="#features" className={styles.link}>
                            Features
                        </a>
                        <Link href="/pricing" className={styles.link}>
                            Pricing
                        </Link>
                        <ThemeToggle />
                        {isAuthenticated ? (
                            <Link href="/app" className={styles.createBtn}>
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" className={styles.link}>
                                    Sign In
                                </Link>
                                <Link href="/app" className={styles.createBtn}>
                                    Get Started Free
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        );
    }

    // App area navigation (protected)
    return (
        <nav className={styles.nav}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <Image
                        src="/logo-dark.png"
                        alt="SMBify Rank"
                        width={140}
                        height={32}
                        className={styles.logoImage}
                        priority
                    />
                </Link>

                <div className={styles.links}>
                    <Link
                        href="/"
                        className={styles.link}
                    >
                        🏠 Home
                    </Link>
                    <Link
                        href="/app"
                        className={`${styles.link} ${pathname === '/app' ? styles.active : ''}`}
                    >
                        My Websites
                    </Link>
                    <Link
                        href="/app/settings"
                        className={`${styles.link} ${pathname === '/app/settings' ? styles.active : ''}`}
                    >
                        Settings
                    </Link>
                    <ThemeToggle />
                    <Link
                        href="/app/create"
                        className={styles.createBtn}
                    >
                        + New Website
                    </Link>

                    {/* User Profile / Guest / Login */}
                    {isLoading ? (
                        <div className={styles.userLoading}>...</div>
                    ) : currentUser ? (
                        <div className={styles.userMenu}>
                            {(supabaseUser?.user_metadata?.avatar_url || session?.user?.image) && (
                                <img
                                    src={supabaseUser?.user_metadata?.avatar_url || session?.user?.image}
                                    alt={supabaseUser?.user_metadata?.full_name || session?.user?.name || 'User'}
                                    className={styles.userAvatar}
                                />
                            )}
                            {!supabaseUser?.user_metadata?.avatar_url && !session?.user?.image && (
                                <div className={styles.guestAvatar}>👤</div>
                            )}
                            <div className={styles.userDropdown}>
                                <div className={styles.userDropdownInner}>
                                    <div className={styles.userName}>
                                        {supabaseUser?.user_metadata?.full_name || session?.user?.name || supabaseUser?.email || 'User'}
                                    </div>
                                    <div className={styles.userEmail}>
                                        {supabaseUser?.email || session?.user?.email}
                                    </div>
                                    <button
                                        onClick={handleSignOut}
                                        className={styles.signOutBtn}
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : isGuest ? (
                        <div className={styles.userMenu}>
                            <div className={styles.guestAvatar}>👤</div>
                            <div className={styles.userDropdown}>
                                <div className={styles.userDropdownInner}>
                                    <div className={styles.userName}>Guest User</div>
                                    <div className={styles.userEmail}>Testing Mode</div>
                                    <button
                                        onClick={handleExitGuest}
                                        className={styles.signOutBtn}
                                    >
                                        Exit Guest Mode
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link href="/login" className={styles.loginBtn}>
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
