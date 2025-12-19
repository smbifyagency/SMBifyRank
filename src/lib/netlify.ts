// Netlify API integration for deploying static websites

import { Website } from './types';
import { exportWebsite } from './export';

const NETLIFY_API_BASE = 'https://api.netlify.com/api/v1';

export interface NetlifySite {
    id: string;
    name: string;
    url: string;
    ssl_url: string;
    admin_url: string;
    created_at: string;
    updated_at: string;
}

export interface NetlifyDeploy {
    id: string;
    site_id: string;
    state: 'uploading' | 'uploaded' | 'processing' | 'ready' | 'error';
    url: string;
    ssl_url: string;
    deploy_url: string;
    created_at: string;
}

// Create a new Netlify site
export async function createNetlifySite(
    token: string,
    siteName: string
): Promise<NetlifySite> {
    const response = await fetch(`${NETLIFY_API_BASE}/sites`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: siteName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create Netlify site');
    }

    return response.json();
}

// Deploy files to a Netlify site
export async function deployToNetlify(
    token: string,
    siteId: string,
    website: Website
): Promise<NetlifyDeploy> {
    const files = exportWebsite(website);

    // Create file hashes manifest
    const filesManifest: Record<string, string> = {};
    const fileContents: Record<string, string> = {};

    for (const file of files) {
        const hash = await sha1(file.content);
        filesManifest[`/${file.path}`] = hash;
        fileContents[hash] = file.content;
    }

    // Create deploy
    const deployResponse = await fetch(`${NETLIFY_API_BASE}/sites/${siteId}/deploys`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            files: filesManifest,
        }),
    });

    if (!deployResponse.ok) {
        const error = await deployResponse.json();
        throw new Error(error.message || 'Failed to create deploy');
    }

    const deploy: NetlifyDeploy & { required: string[] } = await deployResponse.json();

    // Upload required files
    for (const hash of deploy.required || []) {
        const content = fileContents[hash];
        if (content) {
            await fetch(`${NETLIFY_API_BASE}/deploys/${deploy.id}/files/${hash}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/octet-stream',
                },
                body: content,
            });
        }
    }

    return deploy;
}

// Get deploy status
export async function getDeployStatus(
    token: string,
    deployId: string
): Promise<NetlifyDeploy> {
    const response = await fetch(`${NETLIFY_API_BASE}/deploys/${deployId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get deploy status');
    }

    return response.json();
}

// Get site info
export async function getNetlifySite(
    token: string,
    siteId: string
): Promise<NetlifySite> {
    const response = await fetch(`${NETLIFY_API_BASE}/sites/${siteId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get site info');
    }

    return response.json();
}

// Delete a Netlify site
export async function deleteNetlifySite(
    token: string,
    siteId: string
): Promise<void> {
    const response = await fetch(`${NETLIFY_API_BASE}/sites/${siteId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete site');
    }
}

// Verify Netlify token
export async function verifyNetlifyToken(token: string): Promise<boolean> {
    try {
        const response = await fetch(`${NETLIFY_API_BASE}/user`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.ok;
    } catch {
        return false;
    }
}

// SHA-1 hash function
async function sha1(content: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Full deployment flow
export async function deployWebsite(
    token: string,
    website: Website
): Promise<{ siteUrl: string; siteId: string }> {
    let siteId = website.netlifySiteId;

    // Create site if doesn't exist
    if (!siteId) {
        const siteName = `${website.name}-${Date.now()}`.toLowerCase().replace(/\s+/g, '-');
        const site = await createNetlifySite(token, siteName);
        siteId = site.id;
    }

    // Deploy
    const deploy = await deployToNetlify(token, siteId, website);

    // Wait for deployment to be ready
    let status = deploy;
    let attempts = 0;
    const maxAttempts = 30;

    while (status.state !== 'ready' && status.state !== 'error' && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        status = await getDeployStatus(token, deploy.id);
        attempts++;
    }

    if (status.state === 'error') {
        throw new Error('Deployment failed');
    }

    return {
        siteUrl: status.ssl_url || status.url,
        siteId,
    };
}
