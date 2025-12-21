'use client';

import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    color?: string;
    fullScreen?: boolean;
    text?: string;
}

export default function LoadingSpinner({
    size = 'medium',
    color,
    fullScreen = false,
    text,
}: LoadingSpinnerProps) {
    const spinner = (
        <div className={`${styles.wrapper} ${fullScreen ? styles.fullScreen : ''}`}>
            <div
                className={`${styles.spinner} ${styles[size]}`}
                style={color ? { borderTopColor: color, borderRightColor: color } : undefined}
            />
            {text && <p className={styles.text}>{text}</p>}
        </div>
    );

    return spinner;
}

// Inline loading spinner for buttons
export function ButtonSpinner({ className = '' }: { className?: string }) {
    return (
        <span className={`${styles.buttonSpinner} ${className}`} />
    );
}
