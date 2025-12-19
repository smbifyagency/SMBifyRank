// Demo data for testing the AI Website Builder

import { Website } from './types';
import { generateId } from './storage';

export function generateDemoWebsite(): Website {
    const now = new Date().toISOString();
    const id = generateId();

    return {
        id,
        userId: 'demo-user',
        name: 'Acme Restoration Services',
        businessName: 'Acme Restoration Services',
        industry: 'restoration',
        services: [
            { id: generateId(), name: 'Water Damage Restoration', description: 'Fast response water damage restoration services', slug: 'water-damage-restoration', icon: '💧' },
            { id: generateId(), name: 'Fire Damage Restoration', description: 'Expert fire and smoke damage restoration', slug: 'fire-damage-restoration', icon: '🔥' },
            { id: generateId(), name: 'Mold Remediation', description: 'Professional mold inspection and remediation', slug: 'mold-remediation', icon: '🦠' },
            { id: generateId(), name: 'Storm Damage Repair', description: '24/7 emergency storm damage repair', slug: 'storm-damage-repair', icon: '⛈️' },
        ],
        locations: [
            { id: generateId(), city: 'Los Angeles', state: 'CA', slug: 'los-angeles', description: 'Serving Los Angeles and surrounding areas' },
            { id: generateId(), city: 'San Diego', state: 'CA', slug: 'san-diego', description: 'Professional restoration services in San Diego' },
            { id: generateId(), city: 'San Francisco', state: 'CA', slug: 'san-francisco', description: 'Bay Area restoration experts' },
        ],
        colors: {
            primary: '#2563eb',
            secondary: '#1e40af',
            accent: '#f59e0b',
            background: '#ffffff',
            text: '#1f2937',
        },
        goal: 'leads',
        keywords: ['water damage', 'restoration', 'fire damage', 'mold remediation', 'emergency services'],
        pages: [
            {
                id: generateId(),
                title: 'Home',
                slug: '',
                type: 'home',
                content: [
                    { id: generateId(), type: 'hero', content: { headline: 'Professional Restoration Services', subheadline: '24/7 Emergency Response', ctaText: 'Get Free Quote', ctaLink: '/contact' }, order: 0 },
                    { id: generateId(), type: 'services-grid', content: { title: 'Our Services' }, order: 1 },
                    { id: generateId(), type: 'cta', content: { title: 'Need Emergency Help?', description: 'We\'re available 24/7', buttonText: 'Call Now' }, order: 2 },
                ],
                seo: { title: 'Acme Restoration Services | Water, Fire, Mold Restoration', description: 'Professional restoration services for water damage, fire damage, and mold remediation.', keywords: ['restoration', 'water damage', 'fire damage'] },
                order: 0,
                isPublished: true,
            },
            {
                id: generateId(),
                title: 'About Us',
                slug: 'about',
                type: 'about',
                content: [
                    { id: generateId(), type: 'about-intro', content: { title: 'About Acme Restoration', description: 'With over 20 years of experience, we are your trusted restoration partner.' }, order: 0 },
                ],
                seo: { title: 'About Us | Acme Restoration', description: 'Learn about our experienced restoration team.', keywords: ['about', 'restoration company'] },
                order: 1,
                isPublished: true,
            },
            {
                id: generateId(),
                title: 'Services',
                slug: 'services',
                type: 'services',
                content: [
                    { id: generateId(), type: 'services-grid', content: { title: 'Our Services' }, order: 0 },
                ],
                seo: { title: 'Services | Acme Restoration', description: 'Full range of restoration services.', keywords: ['services', 'restoration'] },
                order: 2,
                isPublished: true,
            },
            {
                id: generateId(),
                title: 'Contact',
                slug: 'contact',
                type: 'contact',
                content: [
                    { id: generateId(), type: 'contact-form', content: { title: 'Contact Us' }, order: 0 },
                ],
                seo: { title: 'Contact | Acme Restoration', description: 'Get in touch for a free quote.', keywords: ['contact', 'quote'] },
                order: 3,
                isPublished: true,
            },
            {
                id: generateId(),
                title: 'Blog',
                slug: 'blog',
                type: 'blog',
                content: [
                    { id: generateId(), type: 'blog-list', content: { title: 'Latest Articles' }, order: 0 },
                ],
                seo: { title: 'Blog | Acme Restoration', description: 'Restoration tips and news.', keywords: ['blog', 'restoration'] },
                order: 4,
                isPublished: true,
            },
            {
                id: generateId(),
                title: 'Service Areas',
                slug: 'locations',
                type: 'locations',
                content: [
                    { id: generateId(), type: 'locations-list', content: { title: 'Areas We Serve' }, order: 0 },
                ],
                seo: { title: 'Service Areas | Acme Restoration', description: 'Serving Los Angeles, San Diego, San Francisco and surrounding areas.', keywords: ['service areas', 'locations'] },
                order: 5,
                isPublished: true,
            },
        ],
        blogPosts: [
            {
                id: generateId(),
                title: '5 Signs You Have Water Damage',
                slug: '5-signs-water-damage',
                content: '<h2>How to Spot Water Damage Early</h2><p>Water damage can be sneaky. Here are 5 signs to watch for...</p>',
                excerpt: 'Learn to identify water damage before it becomes a major problem.',
                author: 'Admin',
                publishedAt: now,
                updatedAt: now,
                status: 'published',
                tags: ['water damage', 'tips'],
                seo: { title: '5 Signs of Water Damage', description: 'Learn to spot water damage early.', keywords: ['water damage', 'signs'] },
            },
            {
                id: generateId(),
                title: 'What to Do After a Fire',
                slug: 'what-to-do-after-fire',
                content: '<h2>Steps to Take After a Fire</h2><p>After a fire, safety comes first. Here\'s what you should do...</p>',
                excerpt: 'Essential steps to take immediately after experiencing a fire.',
                author: 'Admin',
                publishedAt: now,
                updatedAt: now,
                status: 'published',
                tags: ['fire damage', 'emergency'],
                seo: { title: 'What to Do After a Fire', description: 'Post-fire recovery guide.', keywords: ['fire', 'recovery'] },
            },
        ],
        seoSettings: {
            siteName: 'Acme Restoration Services',
            siteDescription: 'Professional water, fire, and mold restoration services. 24/7 emergency response.',
            socialLinks: {},
        },
        createdAt: now,
        updatedAt: now,
        status: 'draft',
        contactPhone: '(555) 123-4567',
        contactEmail: 'info@acmerestoration.com',
    };
}
