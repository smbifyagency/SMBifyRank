import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import { Website } from '@/lib/types';
import { exportWebsite } from '@/lib/export';

// GET endpoint - not used, returns info
export async function GET() {
    return NextResponse.json({
        message: 'Use POST method with website data to export',
        method: 'POST'
    });
}

// POST endpoint with proper headers for download
// Supports both JSON body and form data submission
export async function POST(request: NextRequest) {
    try {
        let website: Website;
        let filename = 'website.zip';

        const contentType = request.headers.get('content-type') || '';

        if (contentType.includes('application/x-www-form-urlencoded')) {
            // Handle form data submission (for reliable Chrome downloads)
            const formData = await request.formData();
            const websiteData = formData.get('websiteData');
            const filenameParam = formData.get('filename');

            if (!websiteData || typeof websiteData !== 'string') {
                return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
            }

            website = JSON.parse(websiteData);
            if (filenameParam && typeof filenameParam === 'string') {
                filename = filenameParam;
            }
        } else {
            // Handle JSON body submission
            website = await request.json();
        }

        if (!website || !website.businessName) {
            return NextResponse.json({ error: 'Invalid website data' }, { status: 400 });
        }

        // Use the professional export function from lib/export.ts
        // This uses the same high-quality templates as the preview
        const files = exportWebsite(website);

        // Create ZIP file
        const zip = new JSZip();

        files.forEach(file => {
            zip.file(file.path, file.content);
        });

        // Generate ZIP as uint8array
        const zipContent = await zip.generateAsync({
            type: 'uint8array',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 }
        });

        // Use filename from form if provided, otherwise generate from website name
        const finalFilename = filename !== 'website.zip' ? filename :
            `${(website.name || website.businessName || 'website')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '') || 'website'}-website.zip`;

        // Return response with proper headers for download
        return new NextResponse(Buffer.from(zipContent), {
            status: 200,
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="${finalFilename}"`,
                'Content-Length': zipContent.length.toString(),
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });
    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json({
            error: 'Failed to export website',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
