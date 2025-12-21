import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://smbifyrank.com';

    // Static pages with their priority and change frequency
    const staticPages = [
        { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
        { path: 'pricing', priority: 0.9, changeFrequency: 'monthly' as const },
        { path: 'how-it-works', priority: 0.8, changeFrequency: 'monthly' as const },
        { path: 'about', priority: 0.7, changeFrequency: 'monthly' as const },
        { path: 'contact', priority: 0.7, changeFrequency: 'monthly' as const },
        { path: 'privacy', priority: 0.3, changeFrequency: 'yearly' as const },
        { path: 'terms', priority: 0.3, changeFrequency: 'yearly' as const },
        { path: 'login', priority: 0.5, changeFrequency: 'yearly' as const },
        { path: 'checkout', priority: 0.6, changeFrequency: 'monthly' as const },
    ];

    const currentDate = new Date().toISOString();

    return staticPages.map((page) => ({
        url: `${baseUrl}/${page.path}`,
        lastModified: currentDate,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
    }));
}
