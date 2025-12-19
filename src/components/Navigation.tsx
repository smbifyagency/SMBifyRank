'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from './ThemeProvider';
import styles from './Navigation.module.css';

export default function Navigation() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession();
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

    // Don't show navigation on login page
    if (pathname === '/login') {
        return null;
    }

    const handleExitGuest = () => {
        localStorage.removeItem('guest-mode');
        setIsGuest(false);
        router.push('/login');
    };

    const isAuthenticated = session?.user || isGuest;

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
                        <a href="#pricing" className={styles.link}>
                            Pricing
                        </a>
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
                <Link href="/app" className={styles.logo}>
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
                    <Link
                        href="/app"
                        className={`${styles.link} ${pathname === '/app' ? styles.active : ''}`}
                    >
                        My Websites
                    </Link>
                    <Link
                        href="/app/blog-manager"
                        className={`${styles.link} ${pathname === '/app/blog-manager' ? styles.active : ''}`}
                    >
                        Blog Manager
                    </Link>
                    <Link
                        href="/app/settings"
                        className={`${styles.link} ${pathname === '/app/settings' ? styles.active : ''}`}
                    >
                        Settings
                    </Link>
                    <Link
                        href="/app/create"
                        className={styles.createBtn}
                    >
                        + New Website
                    </Link>

                    {/* User Profile / Guest / Login */}
                    {status === 'loading' ? (
                        <div className={styles.userLoading}>...</div>
                    ) : session?.user ? (
                        <div className={styles.userMenu}>
                            {session.user.image && (
                                <img
                                    src={session.user.image}
                                    alt={session.user.name || 'User'}
                                    className={styles.userAvatar}
                                />
                            )}
                            <div className={styles.userDropdown}>
                                <div className={styles.userName}>{session.user.name}</div>
                                <div className={styles.userEmail}>{session.user.email}</div>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/login' })}
                                    className={styles.signOutBtn}
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    ) : isGuest ? (
                        <div className={styles.userMenu}>
                            <div className={styles.guestAvatar}>👤</div>
                            <div className={styles.userDropdown}>
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
