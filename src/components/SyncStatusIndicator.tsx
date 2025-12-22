// Sync Status Indicator Component
// Shows save/sync status in the UI (saving, saved, error)
'use client';

import { useState, useEffect } from 'react';
import { SyncStatus, getSyncStatus, subscribeSyncStatus } from '@/lib/supabase-storage';
import styles from './SyncStatusIndicator.module.css';

interface SyncStatusIndicatorProps {
    className?: string;
}

export function SyncStatusIndicator({ className = '' }: SyncStatusIndicatorProps) {
    const [status, setStatus] = useState<SyncStatus>(getSyncStatus());

    useEffect(() => {
        return subscribeSyncStatus(setStatus);
    }, []);

    // Format time since last save
    const formatLastSaved = () => {
        if (!status.lastSaved) return '';
        const seconds = Math.floor((Date.now() - status.lastSaved.getTime()) / 1000);
        if (seconds < 5) return 'Just now';
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        return status.lastSaved.toLocaleTimeString();
    };

    if (status.isSaving) {
        return (
            <div className={`${styles.indicator} ${styles.saving} ${className}`}>
                <span className={styles.spinner}></span>
                <span>Saving...</span>
            </div>
        );
    }

    if (status.error) {
        return (
            <div className={`${styles.indicator} ${styles.error} ${className}`}>
                <span className={styles.icon}>⚠️</span>
                <span>Save failed</span>
            </div>
        );
    }

    if (status.pendingChanges) {
        return (
            <div className={`${styles.indicator} ${styles.pending} ${className}`}>
                <span className={styles.icon}>●</span>
                <span>Unsaved changes</span>
            </div>
        );
    }

    if (status.lastSaved) {
        return (
            <div className={`${styles.indicator} ${styles.saved} ${className}`}>
                <span className={styles.icon}>✓</span>
                <span>Saved {formatLastSaved()}</span>
            </div>
        );
    }

    return null;
}

export default SyncStatusIndicator;
