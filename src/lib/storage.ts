// LocalStorage-based data persistence for websites

import { Website, BlogPost, Page } from './types';

const STORAGE_KEYS = {
    WEBSITES: 'ai-builder-websites',
    SETTINGS: 'ai-builder-settings',
    NETLIFY_TOKEN: 'ai-builder-netlify-token',
} as const;

// Generate unique IDs
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Website CRUD operations
export function getAllWebsites(): Website[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.WEBSITES);
    return data ? JSON.parse(data) : [];
}

// Get websites for a specific user
export function getWebsitesByUser(userId: string): Website[] {
    const websites = getAllWebsites();
    return websites.filter(w => w.userId === userId);
}

export function getWebsite(id: string): Website | null {
    const websites = getAllWebsites();
    return websites.find(w => w.id === id) || null;
}

export function saveWebsite(website: Website): Website {
    const websites = getAllWebsites();
    const existingIndex = websites.findIndex(w => w.id === website.id);

    const updatedWebsite = {
        ...website,
        updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
        websites[existingIndex] = updatedWebsite;
    } else {
        websites.push(updatedWebsite);
    }

    localStorage.setItem(STORAGE_KEYS.WEBSITES, JSON.stringify(websites));
    return updatedWebsite;
}

export function deleteWebsite(id: string): boolean {
    const websites = getAllWebsites();
    const filteredWebsites = websites.filter(w => w.id !== id);

    if (filteredWebsites.length === websites.length) {
        return false;
    }

    localStorage.setItem(STORAGE_KEYS.WEBSITES, JSON.stringify(filteredWebsites));
    return true;
}

// Page operations
export function getPage(websiteId: string, pageId: string): Page | null {
    const website = getWebsite(websiteId);
    if (!website) return null;
    return website.pages.find(p => p.id === pageId) || null;
}

export function savePage(websiteId: string, page: Page): boolean {
    const website = getWebsite(websiteId);
    if (!website) return false;

    const pageIndex = website.pages.findIndex(p => p.id === page.id);
    if (pageIndex >= 0) {
        website.pages[pageIndex] = page;
    } else {
        website.pages.push(page);
    }

    saveWebsite(website);
    return true;
}

export function deletePage(websiteId: string, pageId: string): boolean {
    const website = getWebsite(websiteId);
    if (!website) return false;

    website.pages = website.pages.filter(p => p.id !== pageId);
    saveWebsite(website);
    return true;
}

export function reorderPages(websiteId: string, pageIds: string[]): boolean {
    const website = getWebsite(websiteId);
    if (!website) return false;

    const reorderedPages = pageIds
        .map((id, index) => {
            const page = website.pages.find(p => p.id === id);
            if (page) {
                return { ...page, order: index };
            }
            return null;
        })
        .filter((p): p is Page => p !== null);

    website.pages = reorderedPages;
    saveWebsite(website);
    return true;
}

// Blog post operations
export function getBlogPost(websiteId: string, postId: string): BlogPost | null {
    const website = getWebsite(websiteId);
    if (!website) return null;
    return website.blogPosts.find(p => p.id === postId) || null;
}

export function saveBlogPost(websiteId: string, post: BlogPost): boolean {
    const website = getWebsite(websiteId);
    if (!website) return false;

    const postIndex = website.blogPosts.findIndex(p => p.id === post.id);
    if (postIndex >= 0) {
        website.blogPosts[postIndex] = { ...post, updatedAt: new Date().toISOString() };
    } else {
        website.blogPosts.push(post);
    }

    saveWebsite(website);
    return true;
}

export function deleteBlogPost(websiteId: string, postId: string): boolean {
    const website = getWebsite(websiteId);
    if (!website) return false;

    website.blogPosts = website.blogPosts.filter(p => p.id !== postId);
    saveWebsite(website);
    return true;
}

// Settings operations
export interface AppSettings {
    netlifyToken?: string;
    defaultColors?: {
        primary: string;
        secondary: string;
        accent: string;
    };
}

export function getSettings(): AppSettings {
    if (typeof window === 'undefined') return {};
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {};
}

export function saveSettings(settings: AppSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function getNetlifyToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.NETLIFY_TOKEN);
}

export function saveNetlifyToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.NETLIFY_TOKEN, token);
}

export function clearNetlifyToken(): void {
    localStorage.removeItem(STORAGE_KEYS.NETLIFY_TOKEN);
}

// Utility: Export all data
export function exportAllData(): string {
    const data = {
        websites: getAllWebsites(),
        settings: getSettings(),
        exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
}

// Utility: Import data
export function importData(jsonString: string): boolean {
    try {
        const data = JSON.parse(jsonString);
        if (data.websites) {
            localStorage.setItem(STORAGE_KEYS.WEBSITES, JSON.stringify(data.websites));
        }
        if (data.settings) {
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
        }
        return true;
    } catch {
        return false;
    }
}

// Utility: Clear all data
export function clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.WEBSITES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.NETLIFY_TOKEN);
}
