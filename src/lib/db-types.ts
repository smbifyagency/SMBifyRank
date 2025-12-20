// Database Types for Supabase Tables
// These types match the database schema defined in Supabase

export interface DbUser {
    id: string; // UUID from auth.users
    email: string;
    name: string | null;
    created_at: string;
}

export interface DbSite {
    id: string;
    user_id: string;
    site_name: string;
    brand_name: string;
    main_keyword: string | null;
    status: 'draft' | 'published' | 'archived';
    created_at: string;
    updated_at: string;
}

export interface DbSiteConfig {
    id: string;
    site_id: string;
    pages_data: PagesData;
    blog_data: BlogData;
    seo_data: SeoData;
    theme_data: ThemeData;
    images_data: ImagesData;
    last_saved_at: string;
}

export interface DbNetlifyAccount {
    id: string;
    user_id: string;
    encrypted_access_token: string;
    netlify_team_slug?: string;
    created_at: string;
}

export interface DbDeployment {
    id: string;
    site_id: string;
    netlify_site_id: string | null;
    deploy_status: 'pending' | 'building' | 'ready' | 'error';
    last_deployed_at: string | null;
    deploy_url: string | null;
    deploy_logs: string | null;
}

// JSON field types
export interface PagesData {
    pages: PageConfig[];
}

export interface PageConfig {
    id: string;
    slug: string;
    title: string;
    content: string;
    seo: {
        title: string;
        description: string;
        keywords: string[];
    };
}

export interface BlogData {
    posts: BlogPost[];
}

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    content: string;
    featuredImage?: string;
    author?: string;
    publishedAt?: string;
    seo: {
        title: string;
        description: string;
    };
}

export interface SeoData {
    siteTitle: string;
    siteDescription: string;
    keywords: string[];
    ogImage?: string;
    canonicalUrl?: string;
}

export interface ThemeData {
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
    };
    fonts?: {
        heading?: string;
        body?: string;
    };
}

export interface ImagesData {
    logo?: string;
    favicon?: string;
    ogImage?: string;
    gallery?: string[];
}

// Helper type for Supabase responses
export type DbResult<T> = {
    data: T | null;
    error: Error | null;
};
