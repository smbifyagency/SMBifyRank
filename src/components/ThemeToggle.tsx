'use client';

import { useTheme } from './ThemeProvider';
import styles from './ThemeToggle.module.css';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <div className={styles.themeToggle}>
            <button
                className={`${styles.themeBtn} ${theme === 'light' ? styles.active : ''}`}
                onClick={() => setTheme('light')}
                title="Light mode"
                aria-label="Light mode"
            >
                ☀️
            </button>
            <button
                className={`${styles.themeBtn} ${theme === 'dark' ? styles.active : ''}`}
                onClick={() => setTheme('dark')}
                title="Dark mode"
                aria-label="Dark mode"
            >
                🌙
            </button>
            <button
                className={`${styles.themeBtn} ${theme === 'system' ? styles.active : ''}`}
                onClick={() => setTheme('system')}
                title="System preference"
                aria-label="System preference"
            >
                💻
            </button>
        </div>
    );
}
