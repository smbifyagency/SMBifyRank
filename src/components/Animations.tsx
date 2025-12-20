'use client';

import { useEffect, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
    children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);
    const [displayChildren, setDisplayChildren] = useState(children);

    useEffect(() => {
        // Start with fade out
        setIsVisible(false);

        // Quick fade out, then update content and fade in
        const timeout = setTimeout(() => {
            setDisplayChildren(children);
            setIsVisible(true);
        }, 100);

        return () => clearTimeout(timeout);
    }, [pathname, children]);

    return (
        <div
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 0.25s ease-out, transform 0.25s ease-out',
            }}
        >
            {displayChildren}
        </div>
    );
}

// Animated Card wrapper for staggered animations
interface AnimatedCardProps {
    children: ReactNode;
    delay?: number;
    className?: string;
}

export function AnimatedCard({ children, delay = 0, className = '' }: AnimatedCardProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timeout);
    }, [delay]);

    return (
        <div
            className={className}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
                transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
            }}
        >
            {children}
        </div>
    );
}

// Loading Button with spinner
interface LoadingButtonProps {
    loading?: boolean;
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    type?: 'button' | 'submit';
    disabled?: boolean;
}

export function LoadingButton({
    loading = false,
    children,
    onClick,
    className = '',
    type = 'button',
    disabled = false
}: LoadingButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={loading || disabled}
            className={className}
            style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                opacity: loading ? 0.8 : 1,
            }}
        >
            {loading && (
                <span
                    style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid transparent',
                        borderTopColor: 'currentColor',
                        borderRadius: '50%',
                        animation: 'spin 0.6s linear infinite',
                    }}
                />
            )}
            <span style={{ opacity: loading ? 0.7 : 1 }}>{children}</span>
        </button>
    );
}

// Success checkmark animation
export function SuccessCheck({ size = 24 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            style={{
                animation: 'scaleIn 0.3s ease-out forwards',
            }}
        >
            <circle cx="12" cy="12" r="10" fill="#22c55e" />
            <path
                d="M8 12l2.5 2.5L16 9"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                    strokeDasharray: 20,
                    strokeDashoffset: 20,
                    animation: 'checkmark 0.3s ease-out 0.2s forwards',
                }}
            />
        </svg>
    );
}

// Skeleton loader
interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    borderRadius?: string;
}

export function Skeleton({ width = '100%', height = '20px', borderRadius = '8px' }: SkeletonProps) {
    return (
        <div
            style={{
                width,
                height,
                borderRadius,
                background: 'linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-tertiary) 50%, var(--bg-secondary) 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
            }}
        />
    );
}
