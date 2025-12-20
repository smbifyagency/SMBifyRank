'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import styles from './login.module.css';

export default function LoginPage() {
    const router = useRouter();
    const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut } = useAuth();

    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Guest mode removed - all users must authenticate

    const handleGoogleLogin = async () => {
        try {
            setError(null);
            await signInWithGoogle();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
        }
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            if (isSignUp) {
                await signUpWithEmail(email, password, name);
                // Show success message for signup (email confirmation may be required)
                setError('Check your email for a confirmation link!');
            } else {
                await signInWithEmail(email, password);
                router.push('/app');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Authentication failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.loading}>Loading...</div>
                </div>
            </div>
        );
    }

    if (user) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.userInfo}>
                        {user.user_metadata?.avatar_url && (
                            <img
                                src={user.user_metadata.avatar_url}
                                alt={user.user_metadata?.full_name || 'User'}
                                className={styles.avatar}
                            />
                        )}
                        <h2>Welcome, {user.user_metadata?.full_name || user.email}</h2>
                        <p className={styles.email}>{user.email}</p>
                    </div>
                    <div className={styles.actions}>
                        <a href="/app" className={styles.dashboardBtn}>
                            Go to Dashboard
                        </a>
                        <button
                            onClick={() => signOut()}
                            className={styles.signOutBtn}
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <span className={styles.icon}>🚀</span>
                    <h1>SMBify Rank</h1>
                    <p>{isSignUp ? 'Create your account' : 'Sign in to create and manage your websites'}</p>
                </div>

                {error && (
                    <div className={error.includes('Check your email') ? styles.success : styles.error}>
                        {error}
                    </div>
                )}

                <button
                    onClick={handleGoogleLogin}
                    className={styles.googleBtn}
                >
                    <svg className={styles.googleIcon} viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
                </button>

                <div className={styles.divider}>
                    <span>or</span>
                </div>

                <form onSubmit={handleEmailSubmit} className={styles.form}>
                    {isSignUp && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={styles.input}
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.input}
                        required
                        minLength={6}
                    />
                    <button
                        type="submit"
                        className={styles.emailBtn}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
                    </button>
                </form>

                <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className={styles.toggleBtn}
                >
                    {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                </button>



                <p className={styles.terms}>
                    By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}
