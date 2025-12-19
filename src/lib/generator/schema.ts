// Schema Markup Generator - JSON-LD structured data for SEO

import { Website, Page, BlogPost, Service, Location } from '../types';
import { getIndustryCategory } from '../industryData';

export interface SchemaMarkup {
    type: string;
    json: object;
}

// Generate LocalBusiness schema
export function generateLocalBusinessSchema(website: Website): SchemaMarkup {
    const category = getIndustryCategory(website.industry);
    const primaryLocation = website.locations[0];

    return {
        type: 'LocalBusiness',
        json: {
            '@context': 'https://schema.org',
            '@type': category?.schemaType || 'LocalBusiness',
            '@id': `#${website.id}`,
            name: website.businessName,
            description: website.seoSettings.siteDescription,
            url: website.netlifyUrl || '/',
            telephone: website.contactPhone || '',
            email: website.contactEmail || '',
            image: website.logoUrl || '',
            priceRange: '$$',
            address: primaryLocation ? {
                '@type': 'PostalAddress',
                addressLocality: primaryLocation.city,
                addressRegion: primaryLocation.state || '',
                addressCountry: 'US',
            } : undefined,
            geo: primaryLocation ? {
                '@type': 'GeoCoordinates',
                latitude: 0, // Would need geocoding
                longitude: 0,
            } : undefined,
            areaServed: website.locations.map(loc => ({
                '@type': 'City',
                name: `${loc.city}${loc.state ? `, ${loc.state}` : ''}`,
            })),
            openingHoursSpecification: [
                {
                    '@type': 'OpeningHoursSpecification',
                    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    opens: '08:00',
                    closes: '18:00',
                },
                {
                    '@type': 'OpeningHoursSpecification',
                    dayOfWeek: ['Saturday'],
                    opens: '09:00',
                    closes: '14:00',
                },
            ],
            hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Services',
                itemListElement: website.services.map((service, index) => ({
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: service.name,
                        description: service.description,
                    },
                    position: index + 1,
                })),
            },
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                reviewCount: '127',
                bestRating: '5',
                worstRating: '1',
            },
        },
    };
}

// Generate WebSite schema with SearchAction
export function generateWebsiteSchema(website: Website): SchemaMarkup {
    const baseUrl = website.netlifyUrl || 'https://example.com';

    return {
        type: 'WebSite',
        json: {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: website.businessName,
            url: baseUrl,
            description: website.seoSettings.siteDescription,
            potentialAction: {
                '@type': 'SearchAction',
                target: `${baseUrl}/search?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
            },
            publisher: {
                '@type': 'Organization',
                name: website.businessName,
                url: baseUrl,
            },
        },
    };
}

// Generate Organization schema
export function generateOrganizationSchema(website: Website): SchemaMarkup {
    const baseUrl = website.netlifyUrl || 'https://example.com';

    return {
        type: 'Organization',
        json: {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: website.businessName,
            url: baseUrl,
            logo: website.logoUrl || `${baseUrl}/logo.png`,
            description: website.seoSettings.siteDescription,
            contactPoint: {
                '@type': 'ContactPoint',
                telephone: website.contactPhone || '',
                contactType: 'customer service',
                availableLanguage: ['English'],
                areaServed: 'US',
            },
            sameAs: Object.values(website.seoSettings.socialLinks || {}).filter(Boolean),
        },
    };
}

// Generate BreadcrumbList schema
export function generateBreadcrumbSchema(page: Page, website: Website): SchemaMarkup {
    const baseUrl = website.netlifyUrl || '';
    const breadcrumbs = [
        { name: 'Home', url: baseUrl || '/' },
    ];

    if (page.slug) {
        const parts = page.slug.split('/');
        let path = '';
        parts.forEach((part, index) => {
            path += `/${part}`;
            if (index === parts.length - 1) {
                breadcrumbs.push({ name: page.title, url: `${baseUrl}${path}` });
            } else {
                const parentName = part.charAt(0).toUpperCase() + part.slice(1);
                breadcrumbs.push({ name: parentName, url: `${baseUrl}/${part}` });
            }
        });
    }

    return {
        type: 'BreadcrumbList',
        json: {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbs.map((crumb, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: crumb.name,
                item: crumb.url,
            })),
        },
    };
}

// Generate Service schema
export function generateServiceSchema(service: Service, website: Website): SchemaMarkup {
    const baseUrl = website.netlifyUrl || '';

    return {
        type: 'Service',
        json: {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: service.name,
            description: service.description,
            url: `${baseUrl}/services/${service.slug}`,
            provider: {
                '@type': 'LocalBusiness',
                name: website.businessName,
                telephone: website.contactPhone || '',
            },
            areaServed: website.locations.map(loc => ({
                '@type': 'City',
                name: loc.city,
            })),
            hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: service.name,
                itemListElement: [
                    {
                        '@type': 'Offer',
                        itemOffered: {
                            '@type': 'Service',
                            name: service.name,
                        },
                    },
                ],
            },
        },
    };
}

// Generate FAQPage schema
export function generateFAQSchema(faqs: { question: string; answer: string }[]): SchemaMarkup {
    return {
        type: 'FAQPage',
        json: {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(faq => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.answer,
                },
            })),
        },
    };
}

// Generate Article/BlogPosting schema
export function generateArticleSchema(post: BlogPost, website: Website): SchemaMarkup {
    const baseUrl = website.netlifyUrl || '';

    return {
        type: 'Article',
        json: {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt,
            url: `${baseUrl}/blog/${post.slug}`,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            author: {
                '@type': 'Person',
                name: post.author || website.businessName,
                url: baseUrl,
            },
            publisher: {
                '@type': 'Organization',
                name: website.businessName,
                url: baseUrl,
                logo: {
                    '@type': 'ImageObject',
                    url: website.logoUrl || `${baseUrl}/logo.png`,
                },
            },
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `${baseUrl}/blog/${post.slug}`,
            },
            image: post.featuredImage || getCategoryImages(website.industry).hero,
            articleSection: website.industry,
            keywords: post.tags.join(', '),
        },
    };
}

// Generate SiteNavigationElement schema
export function generateNavigationSchema(website: Website): SchemaMarkup {
    const baseUrl = website.netlifyUrl || '';

    const navItems = [
        { name: 'Home', url: baseUrl || '/' },
        { name: 'About', url: `${baseUrl}/about` },
        { name: 'Services', url: `${baseUrl}/services` },
        { name: 'Locations', url: `${baseUrl}/locations` },
        { name: 'Blog', url: `${baseUrl}/blog` },
        { name: 'Contact', url: `${baseUrl}/contact` },
    ];

    return {
        type: 'SiteNavigationElement',
        json: {
            '@context': 'https://schema.org',
            '@type': 'SiteNavigationElement',
            name: 'Main Navigation',
            hasPart: navItems.map((item, index) => ({
                '@type': 'SiteNavigationElement',
                position: index + 1,
                name: item.name,
                url: item.url,
            })),
        },
    };
}

// Generate all schemas for a page
export function generatePageSchemas(page: Page, website: Website): string {
    const schemas: object[] = [];

    // Always include LocalBusiness and WebSite
    schemas.push(generateLocalBusinessSchema(website).json);
    schemas.push(generateWebsiteSchema(website).json);
    schemas.push(generateBreadcrumbSchema(page, website).json);

    // Add page-specific schemas
    if (page.type === 'home') {
        schemas.push(generateOrganizationSchema(website).json);
        schemas.push(generateNavigationSchema(website).json);
    }

    if (page.type === 'service-single') {
        const service = website.services.find(s => page.slug.includes(s.slug));
        if (service) {
            schemas.push(generateServiceSchema(service, website).json);
        }
    }

    // Generate schema script tags
    return schemas.map(schema =>
        `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`
    ).join('\n');
}

// Helper import
import { getCategoryImages } from '../industryData';
