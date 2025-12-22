// API Route: /api/websites
// Handles GET (list user's websites) and POST (create new website)
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Website } from '@/lib/types';

// GET /api/websites - List all websites for authenticated user
export async function GET() {
    try {
        const supabase = await createServerSupabaseClient();

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch user's websites with their config
        const { data: sites, error } = await supabase
            .from('sites')
            .select(`
                id,
                user_id,
                site_name,
                brand_name,
                main_keyword,
                industry,
                status,
                created_at,
                updated_at,
                site_config (
                    pages_data,
                    blog_data,
                    seo_data,
                    theme_data,
                    images_data,
                    last_saved_at
                )
            `)
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });

        if (error) {
            console.error('Error fetching websites:', error);
            return NextResponse.json({ error: 'Failed to fetch websites' }, { status: 500 });
        }

        // Transform to Website format for frontend compatibility
        const websites: Website[] = (sites || []).map(site => {
            const config = Array.isArray(site.site_config) ? site.site_config[0] : site.site_config;
            const pagesData = config?.pages_data || { pages: [] };
            const blogData = config?.blog_data || { posts: [] };
            const seoData = config?.seo_data || {};
            const themeData = config?.theme_data || {};
            const imagesData = config?.images_data || {};

            return {
                id: site.id,
                userId: site.user_id,
                name: site.site_name,
                businessName: site.brand_name,
                industry: site.industry || '',
                services: pagesData.services || [],
                locations: pagesData.locations || [],
                colors: themeData.colors || {
                    primary: '#2563eb',
                    secondary: '#1e40af',
                    accent: '#f59e0b',
                    background: '#ffffff',
                    text: '#1f2937',
                },
                goal: pagesData.goal || 'leads',
                keywords: pagesData.keywords || [],
                pages: pagesData.pages || [],
                blogPosts: blogData.posts || [],
                seoSettings: seoData,
                createdAt: site.created_at,
                updatedAt: site.updated_at,
                status: site.status || 'draft',
                netlifyUrl: pagesData.netlifyUrl,
                netlifySiteId: pagesData.netlifySiteId,
                contactPhone: pagesData.contactPhone,
                contactEmail: pagesData.contactEmail,
                logoUrl: imagesData.logoUrl,
                faviconUrl: imagesData.faviconUrl,
                heroHeadline: pagesData.heroHeadline,
                heroSubheadline: pagesData.heroSubheadline,
                customContent: pagesData.customContent || {},
                customImages: imagesData.customImages || {},
            };
        });

        return NextResponse.json({ websites });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/websites - Create a new website
export async function POST(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const websiteData: Partial<Website> = body;

        // Create site record
        const { data: site, error: siteError } = await supabase
            .from('sites')
            .insert({
                user_id: user.id,
                site_name: websiteData.name || websiteData.businessName || 'New Website',
                brand_name: websiteData.businessName || 'New Business',
                main_keyword: websiteData.keywords?.[0] || '',
                industry: websiteData.industry || 'other',
                status: 'draft',
            })
            .select()
            .single();

        if (siteError) {
            console.error('Error creating site:', siteError);
            return NextResponse.json({ error: 'Failed to create website' }, { status: 500 });
        }

        // Create site_config record with full data
        const { error: configError } = await supabase
            .from('site_config')
            .insert({
                site_id: site.id,
                pages_data: {
                    pages: websiteData.pages || [],
                    services: websiteData.services || [],
                    locations: websiteData.locations || [],
                    keywords: websiteData.keywords || [],
                    goal: websiteData.goal || 'leads',
                    contactPhone: websiteData.contactPhone,
                    contactEmail: websiteData.contactEmail,
                    heroHeadline: websiteData.heroHeadline,
                    heroSubheadline: websiteData.heroSubheadline,
                    customContent: websiteData.customContent || {},
                },
                blog_data: {
                    posts: websiteData.blogPosts || [],
                },
                seo_data: websiteData.seoSettings || {},
                theme_data: {
                    colors: websiteData.colors || {
                        primary: '#2563eb',
                        secondary: '#1e40af',
                        accent: '#f59e0b',
                        background: '#ffffff',
                        text: '#1f2937',
                    },
                },
                images_data: {
                    logoUrl: websiteData.logoUrl,
                    faviconUrl: websiteData.faviconUrl,
                    customImages: websiteData.customImages || {},
                },
            });

        if (configError) {
            console.error('Error creating site config:', configError);
            // Clean up the site if config creation fails
            await supabase.from('sites').delete().eq('id', site.id);
            return NextResponse.json({ error: 'Failed to create website configuration' }, { status: 500 });
        }

        // Return the created website
        const createdWebsite: Website = {
            id: site.id,
            userId: user.id,
            name: site.site_name,
            businessName: site.brand_name,
            industry: websiteData.industry || 'other',
            services: websiteData.services || [],
            locations: websiteData.locations || [],
            colors: websiteData.colors || {
                primary: '#2563eb',
                secondary: '#1e40af',
                accent: '#f59e0b',
                background: '#ffffff',
                text: '#1f2937',
            },
            goal: websiteData.goal || 'leads',
            keywords: websiteData.keywords || [],
            pages: websiteData.pages || [],
            blogPosts: websiteData.blogPosts || [],
            seoSettings: websiteData.seoSettings || {
                siteName: site.site_name,
                siteDescription: '',
                socialLinks: {},
            },
            createdAt: site.created_at,
            updatedAt: site.updated_at,
            status: 'draft',
            customContent: websiteData.customContent || {},
            customImages: websiteData.customImages || {},
        };

        return NextResponse.json({ website: createdWebsite }, { status: 201 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
