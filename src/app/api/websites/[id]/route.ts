// API Route: /api/websites/[id]
// Handles GET (fetch single website), PUT/PATCH (update), DELETE
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Website } from '@/lib/types';

// GET /api/websites/[id] - Fetch a single website
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createServerSupabaseClient();

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch the website with config
        const { data: site, error } = await supabase
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
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (error || !site) {
            return NextResponse.json({ error: 'Website not found' }, { status: 404 });
        }

        // Transform to Website format
        const config = Array.isArray(site.site_config) ? site.site_config[0] : site.site_config;
        const pagesData = config?.pages_data || { pages: [] };
        const blogData = config?.blog_data || { posts: [] };
        const seoData = config?.seo_data || {};
        const themeData = config?.theme_data || {};
        const imagesData = config?.images_data || {};

        const website: Website = {
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
            aboutContent: pagesData.aboutContent,
            servicesDescription: pagesData.servicesDescription,
            contactContent: pagesData.contactContent,
            footerContent: pagesData.footerContent,
            businessAddress: pagesData.businessAddress,
            customContent: pagesData.customContent || {},
            customImages: imagesData.customImages || {},
        };

        return NextResponse.json({ website });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT /api/websites/[id] - Update a website (full update)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createServerSupabaseClient();

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify ownership
        const { data: existingSite, error: findError } = await supabase
            .from('sites')
            .select('id')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (findError || !existingSite) {
            return NextResponse.json({ error: 'Website not found' }, { status: 404 });
        }

        const websiteData: Website = await request.json();

        // Update site record
        const { error: siteError } = await supabase
            .from('sites')
            .update({
                site_name: websiteData.name || websiteData.businessName,
                brand_name: websiteData.businessName,
                main_keyword: websiteData.keywords?.[0] || '',
                industry: websiteData.industry,
                status: websiteData.status || 'draft',
                updated_at: new Date().toISOString(),
            })
            .eq('id', id);

        if (siteError) {
            console.error('Error updating site:', siteError);
            return NextResponse.json({ error: 'Failed to update website' }, { status: 500 });
        }

        // Update site_config record
        const { error: configError } = await supabase
            .from('site_config')
            .update({
                pages_data: {
                    pages: websiteData.pages || [],
                    services: websiteData.services || [],
                    locations: websiteData.locations || [],
                    keywords: websiteData.keywords || [],
                    goal: websiteData.goal || 'leads',
                    contactPhone: websiteData.contactPhone,
                    contactEmail: websiteData.contactEmail,
                    netlifyUrl: websiteData.netlifyUrl,
                    netlifySiteId: websiteData.netlifySiteId,
                    heroHeadline: websiteData.heroHeadline,
                    heroSubheadline: websiteData.heroSubheadline,
                    aboutContent: websiteData.aboutContent,
                    servicesDescription: websiteData.servicesDescription,
                    contactContent: websiteData.contactContent,
                    footerContent: websiteData.footerContent,
                    businessAddress: websiteData.businessAddress,
                    customContent: websiteData.customContent || {},
                },
                blog_data: {
                    posts: websiteData.blogPosts || [],
                },
                seo_data: websiteData.seoSettings || {},
                theme_data: {
                    colors: websiteData.colors,
                },
                images_data: {
                    logoUrl: websiteData.logoUrl,
                    faviconUrl: websiteData.faviconUrl,
                    customImages: websiteData.customImages || {},
                },
                last_saved_at: new Date().toISOString(),
            })
            .eq('site_id', id);

        if (configError) {
            console.error('Error updating site config:', configError);
            return NextResponse.json({ error: 'Failed to update website configuration' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Website saved successfully',
            updatedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH /api/websites/[id] - Partial update (for quick saves)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // Use the same logic as PUT for now
    return PUT(request, { params });
}

// DELETE /api/websites/[id] - Delete a website
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createServerSupabaseClient();

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Delete site (cascade will delete site_config)
        const { error } = await supabase
            .from('sites')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            console.error('Error deleting site:', error);
            return NextResponse.json({ error: 'Failed to delete website' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Website deleted' });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
