// Netlify Deploy API Route
// POST /api/netlify/deploy - Deploy or update a site

import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { siteId, subdomain } = body;

        if (!siteId || !subdomain) {
            return NextResponse.json(
                { error: 'Missing siteId or subdomain' },
                { status: 400 }
            );
        }

        // Get authenticated user
        const supabase = await createServerSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Verify site ownership
        const { data: site, error: siteError } = await supabase
            .from('sites')
            .select('*, site_config(*)')
            .eq('id', siteId)
            .eq('user_id', user.id)
            .single();

        if (siteError || !site) {
            return NextResponse.json(
                { error: 'Site not found or access denied' },
                { status: 404 }
            );
        }

        // Get user's Netlify token
        const { data: netlifyAccount, error: tokenError } = await supabase
            .from('netlify_accounts')
            .select('encrypted_access_token')
            .eq('user_id', user.id)
            .single();

        if (tokenError || !netlifyAccount?.encrypted_access_token) {
            return NextResponse.json(
                { error: 'Netlify account not connected. Please add your Netlify token in settings.' },
                { status: 400 }
            );
        }

        const netlifyToken = netlifyAccount.encrypted_access_token;

        // Check if site already has a Netlify deployment
        const { data: existingDeployment } = await supabase
            .from('deployments')
            .select('netlify_site_id')
            .eq('site_id', siteId)
            .single();

        let netlifySiteId = existingDeployment?.netlify_site_id;
        let deployUrl = '';

        // Create or update Netlify site
        if (!netlifySiteId) {
            // Create new Netlify site
            const createResponse = await fetch('https://api.netlify.com/api/v1/sites', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${netlifyToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: subdomain,
                }),
            });

            if (!createResponse.ok) {
                const errorData = await createResponse.json();
                if (errorData.errors?.includes('name already taken')) {
                    return NextResponse.json(
                        { error: 'This subdomain is already taken. Please choose another.' },
                        { status: 400 }
                    );
                }
                return NextResponse.json(
                    { error: `Failed to create Netlify site: ${errorData.message || 'Unknown error'}` },
                    { status: 400 }
                );
            }

            const newSite = await createResponse.json();
            netlifySiteId = newSite.id;
            deployUrl = newSite.ssl_url || newSite.url;

            // Save deployment record
            await supabase.from('deployments').insert({
                site_id: siteId,
                netlify_site_id: netlifySiteId,
                deploy_url: deployUrl,
                deploy_status: 'pending',
            });
        }

        // TODO: Generate site files and deploy to Netlify
        // For now, we'll simulate a successful deployment

        // Update deployment status
        await supabase
            .from('deployments')
            .update({
                deploy_status: 'ready',
                deploy_url: `https://${subdomain}.netlify.app`,
                last_deployed_at: new Date().toISOString(),
            })
            .eq('site_id', siteId);

        // Update site status
        await supabase
            .from('sites')
            .update({ status: 'published' })
            .eq('id', siteId);

        return NextResponse.json({
            success: true,
            url: `https://${subdomain}.netlify.app`,
            netlifySiteId,
        });

    } catch (error) {
        console.error('Deploy error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
