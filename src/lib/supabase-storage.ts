// Supabase-backed storage service for websites
// This replaces localStorage with API calls to Supabase

import { Website, BlogPost, Page } from './types';

// ============================================
// WEBSITE API OPERATIONS
// ============================================

/**
 * Fetch all websites for the current user from Supabase
 */
export async function fetchWebsites(): Promise<Website[]> {
    try {
        const response = await fetch('/api/websites', {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            console.error('Failed to fetch websites:', response.status);
            return [];
        }

        const data = await response.json();
        return data.websites || [];
    } catch (error) {
        console.error('Error fetching websites:', error);
        return [];
    }
}

/**
 * Fetch a single website by ID from Supabase
 * Returns null if not found or not authenticated
 */
export async function fetchWebsite(id: string): Promise<Website | null> {
    try {
        const response = await fetch(`/api/websites/${id}`, {
            method: 'GET',
            credentials: 'include',
        });

        if (response.status === 401) {
            console.warn('Fetch website: Not authenticated, will use localStorage fallback');
            return null;
        }

        if (!response.ok) {
            console.error('Failed to fetch website:', response.status);
            return null;
        }

        const data = await response.json();
        return data.website || null;
    } catch (error) {
        console.error('Error fetching website:', error);
        return null;
    }
}

/**
 * Create a new website in Supabase
 */
export async function createWebsite(websiteData: Partial<Website>): Promise<Website | null> {
    try {
        const response = await fetch('/api/websites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(websiteData),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Failed to create website:', error);
            return null;
        }

        const data = await response.json();
        return data.website || null;
    } catch (error) {
        console.error('Error creating website:', error);
        return null;
    }
}

/**
 * Save/update a website in Supabase
 * This is the main save function that persists all changes
 */
export async function saveWebsiteToSupabase(website: Website): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await fetch(`/api/websites/${website.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(website),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Failed to save website:', error);
            return { success: false, error: error.error || 'Failed to save' };
        }

        const data = await response.json();
        return { success: true };
    } catch (error) {
        console.error('Error saving website:', error);
        return { success: false, error: 'Network error' };
    }
}

/**
 * Delete a website from Supabase
 */
export async function deleteWebsiteFromSupabase(id: string): Promise<boolean> {
    try {
        const response = await fetch(`/api/websites/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) {
            console.error('Failed to delete website:', response.status);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error deleting website:', error);
        return false;
    }
}

// ============================================
// PAGE OPERATIONS (work on the website object)
// ============================================

export function updatePageInWebsite(website: Website, pageId: string, updates: Partial<Page>): Website {
    return {
        ...website,
        pages: website.pages.map(p =>
            p.id === pageId ? { ...p, ...updates } : p
        ),
    };
}

export function deletePageFromWebsite(website: Website, pageId: string): Website {
    return {
        ...website,
        pages: website.pages.filter(p => p.id !== pageId),
    };
}

// ============================================
// BLOG POST OPERATIONS (work on the website object)
// ============================================

export function updateBlogPostInWebsite(website: Website, postId: string, updates: Partial<BlogPost>): Website {
    return {
        ...website,
        blogPosts: website.blogPosts.map(p =>
            p.id === postId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
        ),
    };
}

export function deleteBlogPostFromWebsite(website: Website, postId: string): Website {
    return {
        ...website,
        blogPosts: website.blogPosts.filter(p => p.id !== postId),
    };
}

// ============================================
// HELPER: Generate unique ID
// ============================================

export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// SYNC STATUS TRACKING
// ============================================

export interface SyncStatus {
    isSaving: boolean;
    lastSaved: Date | null;
    error: string | null;
    pendingChanges: boolean;
}

// Create a simple event emitter for sync status
type SyncListener = (status: SyncStatus) => void;
const syncListeners: Set<SyncListener> = new Set();
let currentSyncStatus: SyncStatus = {
    isSaving: false,
    lastSaved: null,
    error: null,
    pendingChanges: false,
};

export function getSyncStatus(): SyncStatus {
    return { ...currentSyncStatus };
}

export function subscribeSyncStatus(listener: SyncListener): () => void {
    syncListeners.add(listener);
    return () => syncListeners.delete(listener);
}

function updateSyncStatus(updates: Partial<SyncStatus>) {
    currentSyncStatus = { ...currentSyncStatus, ...updates };
    syncListeners.forEach(listener => listener(currentSyncStatus));
}

/**
 * Save with sync status tracking
 * @param website - The website data to save
 * @param options - Optional settings
 * @param options.silentFallback - If true, don't show error if save fails (useful when localStorage has already saved)
 */
export async function saveWebsiteWithStatus(
    website: Website,
    options: { silentFallback?: boolean } = {}
): Promise<{ success: boolean; error?: string }> {
    updateSyncStatus({ isSaving: true, error: null });

    const result = await saveWebsiteToSupabase(website);

    if (result.success) {
        updateSyncStatus({
            isSaving: false,
            lastSaved: new Date(),
            pendingChanges: false,
            error: null
        });
    } else {
        // If silentFallback is true, don't show error (localStorage save succeeded)
        if (options.silentFallback) {
            updateSyncStatus({
                isSaving: false,
                lastSaved: new Date(), // Mark as saved since localStorage worked
                pendingChanges: false,
                error: null // Don't show error
            });
        } else {
            updateSyncStatus({
                isSaving: false,
                error: result.error || 'Save failed',
                pendingChanges: true
            });
        }
    }

    return result;
}

/**
 * Mark a local save as successful (for when localStorage save worked)
 */
export function markLocalSaveSuccess() {
    updateSyncStatus({
        isSaving: false,
        lastSaved: new Date(),
        pendingChanges: false,
        error: null
    });
}

/**
 * Mark that there are pending changes (for debounced save)
 */
export function markPendingChanges() {
    updateSyncStatus({ pendingChanges: true });
}

