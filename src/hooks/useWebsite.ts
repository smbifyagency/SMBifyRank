// React hook for website data with Supabase persistence
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Website } from '@/lib/types';
import {
    fetchWebsite,
    saveWebsiteWithStatus,
    SyncStatus,
    getSyncStatus,
    subscribeSyncStatus,
    markPendingChanges,
} from '@/lib/supabase-storage';

// Fallback to localStorage for unauthenticated users
import { getWebsite as getLocalWebsite, saveWebsite as saveLocalWebsite } from '@/lib/storage';

interface UseWebsiteOptions {
    autoSave?: boolean;          // Enable auto-save on changes
    autoSaveDelay?: number;      // Debounce delay in ms (default: 2000)
    fallbackToLocalStorage?: boolean; // Use localStorage if not authenticated
}

interface UseWebsiteReturn {
    website: Website | null;
    isLoading: boolean;
    syncStatus: SyncStatus;
    error: string | null;
    updateWebsite: (updates: Partial<Website>) => void;
    saveWebsite: () => Promise<{ success: boolean; error?: string }>;
    refreshWebsite: () => Promise<void>;
}

export function useWebsite(
    websiteId: string,
    options: UseWebsiteOptions = {}
): UseWebsiteReturn {
    const {
        autoSave = true,
        autoSaveDelay = 2000,
        fallbackToLocalStorage = true,
    } = options;

    const [website, setWebsite] = useState<Website | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [syncStatus, setSyncStatus] = useState<SyncStatus>(getSyncStatus());
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const websiteRef = useRef<Website | null>(null);
    const isAuthenticatedRef = useRef<boolean | null>(null);

    // Keep refs in sync for use in async callbacks
    useEffect(() => {
        websiteRef.current = website;
    }, [website]);

    useEffect(() => {
        isAuthenticatedRef.current = isAuthenticated;
    }, [isAuthenticated]);

    // Subscribe to sync status
    useEffect(() => {
        return subscribeSyncStatus(setSyncStatus);
    }, []);

    // Load website on mount
    useEffect(() => {
        async function loadWebsite() {
            setIsLoading(true);
            setError(null);

            try {
                // Try to fetch from Supabase first
                const supabaseWebsite = await fetchWebsite(websiteId);

                if (supabaseWebsite) {
                    setWebsite(supabaseWebsite);
                    setIsAuthenticated(true);
                } else if (fallbackToLocalStorage) {
                    // Fallback to localStorage for unauthenticated users or missing data
                    const localWebsite = getLocalWebsite(websiteId);
                    if (localWebsite) {
                        setWebsite(localWebsite);
                        setIsAuthenticated(false);
                    } else {
                        setError('Website not found');
                    }
                } else {
                    setError('Website not found');
                }
            } catch (err) {
                console.error('Error loading website:', err);

                // Try localStorage as fallback
                if (fallbackToLocalStorage) {
                    const localWebsite = getLocalWebsite(websiteId);
                    if (localWebsite) {
                        setWebsite(localWebsite);
                        setIsAuthenticated(false);
                    } else {
                        setError('Failed to load website');
                    }
                } else {
                    setError('Failed to load website');
                }
            } finally {
                setIsLoading(false);
            }
        }

        loadWebsite();
    }, [websiteId, fallbackToLocalStorage]);

    // Save function with localStorage fallback
    const saveWebsite = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
        const currentWebsite = websiteRef.current;
        if (!currentWebsite) {
            return { success: false, error: 'No website to save' };
        }

        // Clear any pending auto-save
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
            saveTimeoutRef.current = null;
        }

        // Always save to localStorage first as backup
        try {
            saveLocalWebsite(currentWebsite);
            console.log('💾 Saved to localStorage (backup)');
        } catch (err) {
            console.error('Error saving to localStorage:', err);
        }

        const currentIsAuthenticated = isAuthenticatedRef.current;

        // If authenticated or auth state not determined, try Supabase
        if (currentIsAuthenticated !== false) {
            const result = await saveWebsiteWithStatus(currentWebsite, { silentFallback: true });
            if (result.success) {
                console.log('✅ Saved to Supabase');
            } else {
                console.log('📁 Supabase save failed, using localStorage fallback');
            }
            return { success: true }; // Always success since localStorage worked
        } else {
            console.log('✅ Saved to localStorage (not authenticated)');
            return { success: true };
        }
    }, []);

    // Update website with auto-save
    const updateWebsite = useCallback((updates: Partial<Website>) => {
        setWebsite(prev => {
            if (!prev) return prev;

            const updated = {
                ...prev,
                ...updates,
                updatedAt: new Date().toISOString(),
            };

            // Mark as having pending changes
            markPendingChanges();

            // Schedule auto-save if enabled
            if (autoSave) {
                if (saveTimeoutRef.current) {
                    clearTimeout(saveTimeoutRef.current);
                }

                saveTimeoutRef.current = setTimeout(async () => {
                    const currentWebsite = websiteRef.current;
                    const currentIsAuthenticated = isAuthenticatedRef.current;
                    if (currentWebsite) {
                        // Always save to localStorage first
                        saveLocalWebsite(currentWebsite);
                        console.log('💾 Auto-saved to localStorage');

                        // Then try Supabase with silentFallback
                        if (currentIsAuthenticated !== false) {
                            const result = await saveWebsiteWithStatus(currentWebsite, { silentFallback: true });
                            if (result.success) {
                                console.log('✅ Auto-saved to Supabase');
                            } else {
                                console.log('📁 Supabase auto-save failed, localStorage has the data');
                            }
                        }
                    }
                }, autoSaveDelay);
            }

            return updated;
        });
    }, [autoSave, autoSaveDelay, isAuthenticated]);

    // Refresh website from server or localStorage based on auth state
    const refreshWebsite = useCallback(async () => {
        setIsLoading(true);
        try {
            // If we know we're not authenticated, use localStorage directly
            if (isAuthenticated === false && fallbackToLocalStorage) {
                const localWebsite = getLocalWebsite(websiteId);
                if (localWebsite) {
                    setWebsite(localWebsite);
                }
                return;
            }

            // Try to fetch from Supabase
            const supabaseWebsite = await fetchWebsite(websiteId);
            if (supabaseWebsite) {
                setWebsite(supabaseWebsite);
                setIsAuthenticated(true);
            } else if (fallbackToLocalStorage) {
                // Supabase failed (possibly auth issue), fall back to localStorage
                // and preserve any local changes
                const localWebsite = getLocalWebsite(websiteId);
                if (localWebsite) {
                    setWebsite(localWebsite);
                    setIsAuthenticated(false);
                }
                // If no local website either, keep current state
            }
        } finally {
            setIsLoading(false);
        }
    }, [websiteId, isAuthenticated, fallbackToLocalStorage]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    return {
        website,
        isLoading,
        syncStatus,
        error,
        updateWebsite,
        saveWebsite,
        refreshWebsite,
    };
}

// Hook for listing all websites
export function useWebsites() {
    const [websites, setWebsites] = useState<Website[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadWebsites() {
            setIsLoading(true);
            try {
                const response = await fetch('/api/websites', {
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setWebsites(data.websites || []);
                } else {
                    // Fallback to localStorage
                    const { getAllWebsites } = await import('@/lib/storage');
                    setWebsites(getAllWebsites());
                }
            } catch (err) {
                console.error('Error loading websites:', err);
                // Fallback to localStorage
                const { getAllWebsites } = await import('@/lib/storage');
                setWebsites(getAllWebsites());
            } finally {
                setIsLoading(false);
            }
        }

        loadWebsites();
    }, []);

    return { websites, isLoading, error, setWebsites };
}
