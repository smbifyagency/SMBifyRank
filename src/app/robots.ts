import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://smbifyrank.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/app/',
                    '/dashboard/',
                    '/editor/',
                    '/auth/',
                    '/create/',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
