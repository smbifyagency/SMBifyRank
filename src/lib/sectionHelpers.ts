// Section Content Helpers
// Utility functions for working with typed section content

import {
    SectionType,
    SectionContent,
    HeroSectionContent,
    ServicesSectionContent,
    AboutSectionContent,
    ContactSectionContent,
    CTASectionContent,
    TestimonialsSectionContent,
    LocationsSectionContent,
    GallerySectionContent,
    FAQSectionContent,
    FeaturesSectionContent,
    TrustBadgesSectionContent,
    BlogListSectionContent,
    TextBlockSectionContent,
    ImageSectionContent,
    VideoSectionContent,
    CustomContentSectionContent,
    PageSection,
} from './types';

// ==========================================
// TYPE GUARDS - Check section content types
// ==========================================

export function isHeroContent(content: SectionContent | Record<string, unknown>): content is HeroSectionContent {
    return 'headline' in content && 'subheadline' in content;
}

export function isServicesContent(content: SectionContent | Record<string, unknown>): content is ServicesSectionContent {
    return 'services' in content && Array.isArray((content as ServicesSectionContent).services);
}

export function isAboutContent(content: SectionContent | Record<string, unknown>): content is AboutSectionContent {
    return 'body' in content && typeof (content as AboutSectionContent).body === 'string';
}

export function isContactContent(content: SectionContent | Record<string, unknown>): content is ContactSectionContent {
    return 'formFields' in content || ('title' in content && ('phone' in content || 'email' in content));
}

export function isCTAContent(content: SectionContent | Record<string, unknown>): content is CTASectionContent {
    return 'buttonText' in content && 'buttonLink' in content;
}

export function isTestimonialsContent(content: SectionContent | Record<string, unknown>): content is TestimonialsSectionContent {
    return 'testimonials' in content && Array.isArray((content as TestimonialsSectionContent).testimonials);
}

export function isLocationsContent(content: SectionContent | Record<string, unknown>): content is LocationsSectionContent {
    return 'locations' in content && Array.isArray((content as LocationsSectionContent).locations);
}

export function isGalleryContent(content: SectionContent | Record<string, unknown>): content is GallerySectionContent {
    return 'images' in content && Array.isArray((content as GallerySectionContent).images);
}

export function isFAQContent(content: SectionContent | Record<string, unknown>): content is FAQSectionContent {
    return 'faqs' in content && Array.isArray((content as FAQSectionContent).faqs);
}

export function isFeaturesContent(content: SectionContent | Record<string, unknown>): content is FeaturesSectionContent {
    return 'features' in content && Array.isArray((content as FeaturesSectionContent).features);
}

export function isTextBlockContent(content: SectionContent | Record<string, unknown>): content is TextBlockSectionContent {
    return 'content' in content && typeof (content as TextBlockSectionContent).content === 'string' && !('html' in content);
}

export function isImageContent(content: SectionContent | Record<string, unknown>): content is ImageSectionContent {
    return 'src' in content && 'alt' in content && !('images' in content);
}

export function isVideoContent(content: SectionContent | Record<string, unknown>): content is VideoSectionContent {
    return 'url' in content && !('link' in content);
}

// ==========================================
// DEFAULT CONTENT GENERATORS
// ==========================================

export function getDefaultSectionContent(type: SectionType): SectionContent {
    switch (type) {
        case 'hero':
            return {
                headline: 'Welcome to Our Business',
                subheadline: 'Professional services you can trust',
                ctaPrimary: { text: 'Get Started', link: '/contact' },
                ctaSecondary: { text: 'Learn More', link: '/about' },
                showPhone: true,
            } as HeroSectionContent;

        case 'services-grid':
            return {
                title: 'Our Services',
                subtitle: 'What we offer',
                services: [],
            } as ServicesSectionContent;

        case 'about-intro':
            return {
                title: 'About Us',
                body: '<p>Tell your story here...</p>',
                features: [],
            } as AboutSectionContent;

        case 'contact-form':
            return {
                title: 'Contact Us',
                subtitle: 'Get in touch with us today',
                formFields: [
                    { name: 'name', type: 'text', label: 'Your Name', required: true },
                    { name: 'email', type: 'email', label: 'Email Address', required: true },
                    { name: 'phone', type: 'phone', label: 'Phone Number', required: false },
                    { name: 'message', type: 'textarea', label: 'Message', required: true },
                ],
            } as ContactSectionContent;

        case 'cta':
            return {
                headline: 'Ready to Get Started?',
                subheadline: 'Contact us today for a free consultation',
                buttonText: 'Contact Us Now',
                buttonLink: '/contact',
                variant: 'primary',
            } as CTASectionContent;

        case 'testimonials':
            return {
                title: 'What Our Clients Say',
                subtitle: 'Trusted by customers across the region',
                testimonials: [],
            } as TestimonialsSectionContent;

        case 'locations-list':
            return {
                title: 'Areas We Serve',
                subtitle: 'Find us near you',
                locations: [],
            } as LocationsSectionContent;

        case 'gallery':
            return {
                title: 'Our Work',
                columns: 3,
                images: [],
            } as GallerySectionContent;

        case 'faq':
            return {
                title: 'Frequently Asked Questions',
                subtitle: 'Find answers to common questions',
                faqs: [],
            } as FAQSectionContent;

        case 'features':
            return {
                title: 'Why Choose Us',
                subtitle: 'What makes us different',
                features: [],
                layout: 'grid',
            } as FeaturesSectionContent;

        case 'trust-badges':
            return {
                title: 'Trusted & Certified',
                badges: [],
            } as TrustBadgesSectionContent;

        case 'blog-list':
            return {
                title: 'Latest News',
                subtitle: 'Stay updated with our blog',
                postsToShow: 6,
                showExcerpt: true,
            } as BlogListSectionContent;

        case 'text-block':
            return {
                content: '<p>Enter your content here...</p>',
                alignment: 'left',
            } as TextBlockSectionContent;

        case 'image':
            return {
                src: '',
                alt: 'Image',
                fullWidth: false,
            } as ImageSectionContent;

        case 'video':
            return {
                url: '',
                title: 'Video',
                autoplay: false,
            } as VideoSectionContent;

        case 'custom-content':
            return {
                html: '<div>Custom content here</div>',
            } as CustomContentSectionContent;

        default:
            return {
                content: '',
            } as TextBlockSectionContent;
    }
}

// ==========================================
// SECTION CREATION HELPER
// ==========================================

export function createSection(type: SectionType, order: number): PageSection {
    return {
        id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        content: getDefaultSectionContent(type),
        order,
        userEdited: false,
        lastEditedAt: new Date().toISOString(),
        lastEditedBy: 'system',
    };
}

// ==========================================
// SECTION LOCKING (AI protection)
// ==========================================

export function isUserEdited(section: PageSection): boolean {
    return section.userEdited === true;
}

export function markAsUserEdited(section: PageSection): PageSection {
    return {
        ...section,
        userEdited: true,
        lastEditedAt: new Date().toISOString(),
        lastEditedBy: 'user',
    };
}

export function markAsAIGenerated(section: PageSection): PageSection {
    return {
        ...section,
        userEdited: false,
        lastEditedAt: new Date().toISOString(),
        lastEditedBy: 'ai',
    };
}

export function resetSectionLock(section: PageSection): PageSection {
    return {
        ...section,
        userEdited: false,
        lastEditedAt: new Date().toISOString(),
        lastEditedBy: 'system',
    };
}

// ==========================================
// CONTENT UPDATE HELPER
// ==========================================

export function updateSectionContent<T extends SectionContent>(
    section: PageSection,
    updates: Partial<T>
): PageSection {
    return {
        ...section,
        content: {
            ...section.content,
            ...updates,
        },
        userEdited: true,
        lastEditedAt: new Date().toISOString(),
        lastEditedBy: 'user',
    };
}

// ==========================================
// SCHEMA FOR AI PROMPTS
// ==========================================

export function getSchemaDescription(type: SectionType): string {
    const schemas: Record<SectionType, string> = {
        'hero': `{
  "headline": "string - Main headline",
  "subheadline": "string - Supporting text",
  "ctaPrimary": { "text": "string", "link": "string" },
  "ctaSecondary": { "text": "string", "link": "string" } (optional)
}`,
        'services-grid': `{
  "title": "string",
  "subtitle": "string (optional)",
  "services": [{ "id": "string", "name": "string", "description": "string", "icon": "string" }]
}`,
        'about-intro': `{
  "title": "string",
  "body": "string - HTML content",
  "features": [{ "icon": "string", "text": "string" }] (optional)
}`,
        'contact-form': `{
  "title": "string",
  "subtitle": "string (optional)",
  "phone": "string (optional)",
  "email": "string (optional)"
}`,
        'cta': `{
  "headline": "string",
  "subheadline": "string (optional)",
  "buttonText": "string",
  "buttonLink": "string"
}`,
        'testimonials': `{
  "title": "string",
  "testimonials": [{ "id": "string", "name": "string", "quote": "string", "rating": 5 }]
}`,
        'locations-list': `{
  "title": "string",
  "locations": [{ "id": "string", "city": "string", "state": "string" }]
}`,
        'gallery': `{
  "title": "string (optional)",
  "images": [{ "id": "string", "src": "string", "alt": "string" }]
}`,
        'faq': `{
  "title": "string",
  "faqs": [{ "id": "string", "question": "string", "answer": "string" }]
}`,
        'features': `{
  "title": "string",
  "features": [{ "id": "string", "icon": "string", "title": "string", "description": "string" }]
}`,
        'trust-badges': `{
  "title": "string (optional)",
  "badges": [{ "id": "string", "name": "string", "icon": "string" }]
}`,
        'blog-list': `{
  "title": "string",
  "subtitle": "string (optional)"
}`,
        'text-block': `{
  "content": "string - HTML content"
}`,
        'image': `{
  "src": "string - image URL",
  "alt": "string - accessibility text"
}`,
        'video': `{
  "url": "string - video URL",
  "title": "string (optional)"
}`,
        'custom-content': `{
  "html": "string - raw HTML"
}`,
    };

    return schemas[type] || '{}';
}
