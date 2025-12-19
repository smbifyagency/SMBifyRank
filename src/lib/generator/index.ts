// AI Website Generator Engine
// Generates complete static HTML websites from intake form data

import {
    Website,
    IntakeFormData,
    Page,
    PageSection,
    Service,
    Location,
    BrandColors,
    BlogPost
} from '../types';
import { generateId } from '../storage';
import { getIndustryCategory, getDefaultServices, getCategoryImages } from '../industryData';
import { generateAiContent, isAiAvailable } from '../ai';

// Generate a complete website from intake form data
export function generateWebsite(formData: IntakeFormData): Website {
    const id = generateId();
    const now = new Date().toISOString();
    const category = getIndustryCategory(formData.industry);
    const images = getCategoryImages(formData.industry);

    // Generate services - use industry defaults if none provided
    let services: Service[];
    if (formData.services.length > 0 && formData.services[0].name) {
        services = formData.services.map((s) => ({
            id: generateId(),
            name: s.name,
            description: s.description || `Professional ${s.name} services`,
            slug: slugify(s.name),
            icon: getServiceIcon(s.name, formData.industry),
        }));
    } else if (category) {
        // Use industry default services
        services = category.defaultServices.slice(0, 6).map((s) => ({
            id: generateId(),
            name: s.name,
            description: s.description,
            slug: slugify(s.name),
            icon: s.icon,
        }));
    } else {
        services = [];
    }

    // Generate locations
    const locations: Location[] = formData.locations.map(l => ({
        id: generateId(),
        city: l.city,
        state: l.state,
        slug: slugify(l.city),
        description: generateLocationDescription(l.city, formData.businessName, formData.industry),
    }));

    // Generate pages
    const pages: Page[] = [
        generateHomePage(formData, services, locations),
        generateAboutPage(formData),
        generateServicesPage(formData, services),
        ...services.map(s => generateServiceSinglePage(formData, s)),
        generateContactPage(formData),
        generateBlogPage(formData),
        generateLocationsListPage(formData, locations),
        ...locations.map(l => generateLocationPage(formData, l, services)),
        // Legal and SEO pages
        generatePrivacyPolicyPage(formData),
        generateTermsOfServicePage(formData),
        generateSitemapPage(formData),
    ];

    // Add order to pages
    pages.forEach((page, index) => {
        page.order = index;
    });

    const website: Website = {
        id,
        name: formData.businessName,
        businessName: formData.businessName,
        industry: formData.industry,
        services,
        locations,
        colors: formData.colors,
        goal: formData.goal,
        keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean),
        pages,
        blogPosts: [],
        seoSettings: {
            siteName: formData.businessName,
            siteDescription: generateMetaDescription(formData),
            socialLinks: {},
        },
        createdAt: now,
        updatedAt: now,
        status: 'draft',
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        logoUrl: formData.logoUrl,
        businessAddress: formData.businessAddress,
    };

    return website;
}

// Generate a website with AI-generated content
// This is an async version that generates SEO-optimized content for each page
export async function generateWebsiteWithAI(
    formData: IntakeFormData,
    onProgress?: (message: string, progress: number) => void
): Promise<Website> {
    // First create the base website
    const website = generateWebsite(formData);

    // If AI is not available, return the base website
    if (!isAiAvailable()) {
        onProgress?.('Using template content (no API key configured)', 100);
        return website;
    }

    const totalPages = 2 + website.services.length + website.locations.length; // about + contact + services + locations
    let completedPages = 0;

    const updateProgress = (message: string) => {
        completedPages++;
        onProgress?.(message, Math.round((completedPages / totalPages) * 100));
    };

    try {
        // Generate AI content for service pages
        for (const service of website.services) {
            updateProgress(`Generating ${service.name} page content...`);

            const aiContent = await generateAiContent({
                businessName: formData.businessName,
                industry: formData.industry,
                serviceName: service.name,
                pageType: 'service',
                targetWords: 800,
            });

            // Find the service page and update its content
            const servicePage = website.pages.find(p =>
                p.type === 'service-single' && p.slug === `services/${service.slug}`
            );

            if (servicePage) {
                // Find the custom-content section and update it
                const customSection = servicePage.content.find(s => s.type === 'custom-content');
                if (customSection) {
                    customSection.content = {
                        html: `<div class="service-content">${aiContent}</div>`
                    };
                }
            }
        }

        // Generate AI content for location pages
        for (const location of website.locations) {
            updateProgress(`Generating ${location.city} page content...`);

            const aiContent = await generateAiContent({
                businessName: formData.businessName,
                industry: formData.industry,
                locationCity: location.city,
                locationState: location.state,
                pageType: 'location',
                targetWords: 700,
            });

            // Find the location page and update its content
            const locationPage = website.pages.find(p =>
                p.type === 'location' && p.slug === `locations/${location.slug}`
            );

            if (locationPage) {
                // Find the custom-content section and update it
                const customSection = locationPage.content.find(s => s.type === 'custom-content');
                if (customSection) {
                    customSection.content = {
                        html: `<div class="location-content">${aiContent}</div>`
                    };
                }
            }
        }

        onProgress?.('Website generation complete!', 100);
        return website;
    } catch (error) {
        console.error('Error generating AI content:', error);
        onProgress?.('Error generating AI content, using templates', 100);
        // Return the base website if AI generation fails
        return website;
    }
}

// Utility: Convert string to URL slug
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// Generate service icon based on name/industry
function getServiceIcon(serviceName: string, industry: string): string {
    const iconMap: Record<string, string> = {
        'water': '💧',
        'fire': '🔥',
        'mold': '🦠',
        'smoke': '💨',
        'flood': '🌊',
        'restoration': '🔧',
        'plumbing': '🔧',
        'hvac': '❄️',
        'roofing': '🏠',
        'electrical': '⚡',
        'cleaning': '✨',
        'landscaping': '🌳',
        'construction': '🏗️',
    };

    const lowerName = serviceName.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
        if (lowerName.includes(key)) return icon;
    }

    return '✓';
}

// Generate meta description
function generateMetaDescription(formData: IntakeFormData): string {
    const locations = formData.locations.map(l => l.city).slice(0, 3).join(', ');
    const services = formData.services.map(s => s.name).slice(0, 3).join(', ');

    return `${formData.businessName} offers professional ${services} services in ${locations}. Contact us for a free estimate today!`;
}

// Generate location description
function generateLocationDescription(city: string, businessName: string, industry: string): string {
    return `${businessName} provides top-quality ${industry} services in ${city} and surrounding areas. Our experienced team is ready to help you 24/7.`;
}

// Page Generators
function generateHomePage(formData: IntakeFormData, services: Service[], locations: Location[]): Page {
    const sections: PageSection[] = [
        {
            id: generateId(),
            type: 'hero',
            content: {
                headline: `${formData.businessName}`,
                subheadline: `#1 ${getIndustryLabel(formData.industry)} Services in ${formData.locations[0]?.city || 'Your Area'}`,
                ctaText: 'Get Free Estimate',
                ctaLink: '/contact',
                phone: formData.contactPhone,
                backgroundImage: '',
            },
            order: 0,
        },
        {
            id: generateId(),
            type: 'services-grid',
            content: {
                title: 'Our Services',
                subtitle: 'Professional solutions for all your needs',
                services: services.slice(0, 6).map(s => ({
                    id: s.id,
                    name: s.name,
                    description: s.description.substring(0, 100) + '...',
                    icon: s.icon,
                    link: `/services/${s.slug}`,
                })),
            },
            order: 1,
        },
        {
            id: generateId(),
            type: 'about-intro',
            content: {
                title: `Why Choose ${formData.businessName}?`,
                description: `With years of experience in the ${formData.industry} industry, we provide reliable, professional, and affordable services. Our team is dedicated to your satisfaction.`,
                features: [
                    { icon: '✓', text: '24/7 Emergency Service' },
                    { icon: '✓', text: 'Licensed & Insured' },
                    { icon: '✓', text: 'Free Estimates' },
                    { icon: '✓', text: 'Satisfaction Guaranteed' },
                ],
            },
            order: 2,
        },
        {
            id: generateId(),
            type: 'locations-list',
            content: {
                title: 'Areas We Serve',
                subtitle: 'Providing services across multiple locations',
                locations: locations.map(l => ({
                    id: l.id,
                    city: l.city,
                    link: `/locations/${l.slug}`,
                })),
            },
            order: 3,
        },
        {
            id: generateId(),
            type: 'cta',
            content: {
                title: 'Ready to Get Started?',
                subtitle: 'Contact us today for a free consultation',
                ctaText: 'Call Now',
                ctaLink: `tel:${formData.contactPhone}`,
                secondaryCtaText: 'Request Quote',
                secondaryCtaLink: '/contact',
            },
            order: 4,
        },
    ];

    return {
        id: generateId(),
        title: 'Home',
        slug: '',
        type: 'home',
        content: sections,
        seo: {
            title: `${formData.businessName} | ${getIndustryLabel(formData.industry)} Services`,
            description: generateMetaDescription(formData),
            keywords: formData.keywords.split(',').map(k => k.trim()),
        },
        order: 0,
        isPublished: true,
    };
}

function generateAboutPage(formData: IntakeFormData): Page {
    const sections: PageSection[] = [
        {
            id: generateId(),
            type: 'hero',
            content: {
                headline: `About ${formData.businessName}`,
                subheadline: 'Your trusted partner for all your needs',
                showCta: false,
            },
            order: 0,
        },
        {
            id: generateId(),
            type: 'custom-content',
            content: {
                html: `
          <div class="about-content">
            <h2>Our Story</h2>
            <p>${formData.businessName} has been serving the ${formData.locations[0]?.city || 'local'} community with dedication and excellence. Our mission is to provide top-quality ${formData.industry} services that exceed expectations.</p>
            
            <h2>Our Values</h2>
            <ul>
              <li><strong>Integrity:</strong> We believe in honest, transparent service</li>
              <li><strong>Quality:</strong> We never cut corners on quality</li>
              <li><strong>Customer Focus:</strong> Your satisfaction is our priority</li>
              <li><strong>Reliability:</strong> We're there when you need us</li>
            </ul>
            
            <h2>Why Choose Us?</h2>
            <p>With experienced professionals, state-of-the-art equipment, and a commitment to excellence, we deliver results that speak for themselves. Contact us today to experience the difference.</p>
          </div>
        `,
            },
            order: 1,
        },
        {
            id: generateId(),
            type: 'trust-badges',
            content: {
                badges: [
                    { icon: '🏆', text: 'Award Winning Service' },
                    { icon: '📜', text: 'Fully Licensed' },
                    { icon: '🛡️', text: 'Insured & Bonded' },
                    { icon: '⭐', text: '5-Star Rated' },
                ],
            },
            order: 2,
        },
    ];

    return {
        id: generateId(),
        title: 'About Us',
        slug: 'about',
        type: 'about',
        content: sections,
        seo: {
            title: `About ${formData.businessName} | Our Story`,
            description: `Learn about ${formData.businessName}, your trusted ${formData.industry} experts. Serving ${formData.locations.map(l => l.city).join(', ')} with quality service.`,
            keywords: ['about us', formData.businessName, formData.industry],
        },
        order: 1,
        isPublished: true,
    };
}

function generateServicesPage(formData: IntakeFormData, services: Service[]): Page {
    const sections: PageSection[] = [
        {
            id: generateId(),
            type: 'hero',
            content: {
                headline: 'Our Services',
                subheadline: `Professional ${formData.industry} solutions for every need`,
                showCta: true,
                ctaText: 'Get Free Quote',
                ctaLink: '/contact',
            },
            order: 0,
        },
        {
            id: generateId(),
            type: 'services-grid',
            content: {
                title: 'What We Offer',
                services: services.map(s => ({
                    id: s.id,
                    name: s.name,
                    description: s.description,
                    icon: s.icon,
                    link: `/services/${s.slug}`,
                })),
            },
            order: 1,
        },
        {
            id: generateId(),
            type: 'cta',
            content: {
                title: 'Need Our Services?',
                subtitle: 'Get in touch for a free consultation',
                ctaText: 'Contact Us',
                ctaLink: '/contact',
            },
            order: 2,
        },
    ];

    return {
        id: generateId(),
        title: 'Services',
        slug: 'services',
        type: 'services',
        content: sections,
        seo: {
            title: `Our Services | ${formData.businessName}`,
            description: `Explore our range of ${formData.industry} services including ${services.map(s => s.name).slice(0, 3).join(', ')}. Professional service guaranteed.`,
            keywords: services.map(s => s.name),
        },
        order: 2,
        isPublished: true,
    };
}

function generateServiceSinglePage(formData: IntakeFormData, service: Service): Page {
    const sections: PageSection[] = [
        {
            id: generateId(),
            type: 'hero',
            content: {
                headline: service.name,
                subheadline: `Professional ${service.name} services by ${formData.businessName}`,
                showCta: true,
                ctaText: 'Get Free Estimate',
                ctaLink: '/contact',
                phone: formData.contactPhone,
            },
            order: 0,
        },
        {
            id: generateId(),
            type: 'custom-content',
            content: {
                html: `
          <div class="service-content">
            <h2>About Our ${service.name} Service</h2>
            <p>${service.description}</p>
            
            <h3>Why Choose Our ${service.name} Service?</h3>
            <ul>
              <li>Experienced and certified professionals</li>
              <li>State-of-the-art equipment</li>
              <li>Fast response times</li>
              <li>Competitive pricing</li>
              <li>100% satisfaction guarantee</li>
            </ul>
            
            <h3>Our ${service.name} Process</h3>
            <ol>
              <li><strong>Free Consultation:</strong> We assess your needs and provide a detailed quote</li>
              <li><strong>Professional Service:</strong> Our team delivers quality work efficiently</li>
              <li><strong>Follow-up:</strong> We ensure your complete satisfaction</li>
            </ol>
          </div>
        `,
            },
            order: 1,
        },
        {
            id: generateId(),
            type: 'cta',
            content: {
                title: `Need ${service.name}?`,
                subtitle: 'Contact us now for immediate assistance',
                ctaText: 'Call Now',
                ctaLink: `tel:${formData.contactPhone}`,
                secondaryCtaText: 'Get Quote',
                secondaryCtaLink: '/contact',
            },
            order: 2,
        },
    ];

    return {
        id: generateId(),
        title: service.name,
        slug: `services/${service.slug}`,
        type: 'service-single',
        content: sections,
        seo: {
            title: `${service.name} | ${formData.businessName}`,
            description: `Professional ${service.name} services by ${formData.businessName}. ${service.description.substring(0, 100)}`,
            keywords: [service.name, formData.industry, formData.businessName],
        },
        order: 10,
        isPublished: true,
    };
}

function generateContactPage(formData: IntakeFormData): Page {
    const address = formData.businessAddress;
    const mapQuery = address
        ? encodeURIComponent(`${address.street}, ${address.city}, ${address.state} ${address.zip}`)
        : '';

    // Generate NAP (Name, Address, Phone) HTML with Schema.org markup
    const napHtml = address ? `
        <div class="contact-nap" itemscope itemtype="https://schema.org/LocalBusiness">
            <meta itemprop="name" content="${formData.businessName}" />
            <h3>Visit Our Office</h3>
            <div class="nap-details" itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
                <p class="address">
                    <strong>📍 Address:</strong><br>
                    <span itemprop="streetAddress">${address.street}</span><br>
                    <span itemprop="addressLocality">${address.city}</span>, 
                    <span itemprop="addressRegion">${address.state}</span> 
                    <span itemprop="postalCode">${address.zip}</span>
                </p>
            </div>
            <p><strong>📞 Phone:</strong> <a href="tel:${formData.contactPhone}" itemprop="telephone">${formData.contactPhone}</a></p>
            <p><strong>✉️ Email:</strong> <a href="mailto:${formData.contactEmail}" itemprop="email">${formData.contactEmail}</a></p>
            <p><strong>🕐 Hours:</strong> 24/7 Emergency Service Available</p>
        </div>
    ` : `
        <div class="contact-info">
            <h3>Contact Information</h3>
            <p><strong>Phone:</strong> <a href="tel:${formData.contactPhone}">${formData.contactPhone}</a></p>
            <p><strong>Email:</strong> <a href="mailto:${formData.contactEmail}">${formData.contactEmail}</a></p>
            <p><strong>Hours:</strong> 24/7 Emergency Service Available</p>
        </div>
    `;

    // Map embed section
    const mapHtml = address ? `
        <div class="contact-map">
            <h3>Find Us on the Map</h3>
            <iframe 
                src="https://www.google.com/maps?q=${mapQuery}&output=embed"
                width="100%" 
                height="400" 
                style="border:0; border-radius: 12px;" 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade"
                title="Our Location - ${formData.businessName}"
            ></iframe>
        </div>
    ` : '';

    const sections: PageSection[] = [
        {
            id: generateId(),
            type: 'hero',
            content: {
                headline: 'Contact Us',
                subheadline: 'Get in touch for a free consultation',
                showCta: false,
            },
            order: 0,
        },
        {
            id: generateId(),
            type: 'contact-form',
            content: {
                title: 'Send Us a Message',
                fields: ['name', 'email', 'phone', 'service', 'message'],
                email: formData.contactEmail,
                phone: formData.contactPhone,
                showMap: false,
            },
            order: 1,
        },
        {
            id: generateId(),
            type: 'custom-content',
            content: {
                html: napHtml,
            },
            order: 2,
        },
        {
            id: generateId(),
            type: 'custom-content',
            content: {
                html: mapHtml,
            },
            order: 3,
        },
    ];

    return {
        id: generateId(),
        title: 'Contact',
        slug: 'contact',
        type: 'contact',
        content: sections,
        seo: {
            title: `Contact ${formData.businessName} | Get a Free Quote`,
            description: `Contact ${formData.businessName} for professional ${formData.industry} services. Call ${formData.contactPhone} or fill out our form for a free estimate.`,
            keywords: ['contact', 'free quote', formData.businessName],
        },
        order: 5,
        isPublished: true,
    };
}

function generateBlogPage(formData: IntakeFormData): Page {
    const sections: PageSection[] = [
        {
            id: generateId(),
            type: 'hero',
            content: {
                headline: 'Blog',
                subheadline: 'Tips, news, and insights from our experts',
                showCta: false,
            },
            order: 0,
        },
        {
            id: generateId(),
            type: 'blog-list',
            content: {
                title: 'Latest Articles',
                postsPerPage: 10,
            },
            order: 1,
        },
    ];

    return {
        id: generateId(),
        title: 'Blog',
        slug: 'blog',
        type: 'blog',
        content: sections,
        seo: {
            title: `Blog | ${formData.businessName}`,
            description: `Read the latest tips, news, and insights about ${formData.industry} from ${formData.businessName}.`,
            keywords: ['blog', formData.industry, 'tips', 'news'],
        },
        order: 6,
        isPublished: true,
    };
}

function generateLocationsListPage(formData: IntakeFormData, locations: Location[]): Page {
    const sections: PageSection[] = [
        {
            id: generateId(),
            type: 'hero',
            content: {
                headline: 'Service Areas',
                subheadline: `Serving ${formData.locations[0]?.city || 'Your Area'} and Surrounding Communities`,
                showCta: true,
                ctaText: 'Call Now',
                phone: formData.contactPhone,
            },
            order: 0,
        },
        {
            id: generateId(),
            type: 'locations-list',
            content: {
                title: 'Areas We Serve',
                locations: locations.map(l => ({
                    id: l.id,
                    city: l.city,
                    state: l.state,
                    link: `/locations/${l.slug}`,
                })),
            },
            order: 1,
        },
    ];

    return {
        id: generateId(),
        title: 'Service Areas',
        slug: 'locations',
        type: 'locations',
        content: sections,
        seo: {
            title: `Service Areas | ${formData.businessName}`,
            description: `${formData.businessName} serves ${formData.locations.map(l => l.city).slice(0, 5).join(', ')} and surrounding areas. Call for ${formData.industry} services.`,
            keywords: ['service areas', ...formData.locations.map(l => l.city)],
        },
        order: 7,
        isPublished: true,
    };
}

function generateLocationPage(formData: IntakeFormData, location: Location, services: Service[]): Page {
    const sections: PageSection[] = [
        {
            id: generateId(),
            type: 'hero',
            content: {
                headline: `${formData.industry} Services in ${location.city}`,
                subheadline: `${formData.businessName} - Your local ${formData.industry} experts`,
                showCta: true,
                ctaText: 'Get Free Estimate',
                ctaLink: '/contact',
                phone: formData.contactPhone,
            },
            order: 0,
        },
        {
            id: generateId(),
            type: 'custom-content',
            content: {
                html: `
          <div class="location-content">
            <h2>${formData.industry} Services in ${location.city}${location.state ? `, ${location.state}` : ''}</h2>
            <p>${formData.businessName} proudly serves ${location.city} and surrounding areas with professional ${formData.industry} services. Our local team understands the unique needs of our ${location.city} customers and is ready to help 24/7.</p>
            
            <h3>Services Available in ${location.city}</h3>
            <ul>
              ${services.map(s => `<li><a href="/services/${s.slug}">${s.name}</a></li>`).join('\n')}
            </ul>
            
            <h3>Why Choose Us in ${location.city}?</h3>
            <ul>
              <li>Fast response times - We're local!</li>
              <li>Knowledge of local building codes</li>
              <li>Trusted by ${location.city} residents</li>
              <li>Emergency services available 24/7</li>
            </ul>
          </div>
        `,
            },
            order: 1,
        },
        {
            id: generateId(),
            type: 'cta',
            content: {
                title: `Need Help in ${location.city}?`,
                subtitle: 'Our local team is ready to assist you',
                ctaText: 'Call Now',
                ctaLink: `tel:${formData.contactPhone}`,
                secondaryCtaText: 'Request Quote',
                secondaryCtaLink: '/contact',
            },
            order: 2,
        },
    ];

    return {
        id: generateId(),
        title: `${location.city} Services`,
        slug: `locations/${location.slug}`,
        type: 'location',
        content: sections,
        seo: {
            title: `${formData.industry} Services in ${location.city} | ${formData.businessName}`,
            description: `Professional ${formData.industry} services in ${location.city}${location.state ? `, ${location.state}` : ''}. ${formData.businessName} offers ${services.slice(0, 3).map(s => s.name).join(', ')} and more. Call now!`,
            keywords: [location.city, formData.industry, ...services.map(s => s.name)],
        },
        order: 20,
        isPublished: true,
    };
}

// Get readable industry label
function getIndustryLabel(industry: string): string {
    const labels: Record<string, string> = {
        'restoration': 'Restoration',
        'plumbing': 'Plumbing',
        'hvac': 'HVAC',
        'roofing': 'Roofing',
        'landscaping': 'Landscaping',
        'cleaning': 'Cleaning',
        'electrical': 'Electrical',
        'construction': 'Construction',
        'realestate': 'Real Estate',
        'legal': 'Legal',
        'medical': 'Medical',
        'dental': 'Dental',
        'automotive': 'Automotive',
        'restaurant': 'Restaurant',
        'fitness': 'Fitness',
        'salon': 'Beauty',
        'photography': 'Photography',
        'consulting': 'Consulting',
        'technology': 'Technology',
    };

    return labels[industry] || industry;
}

// Generate blog post
export function generateBlogPost(
    title: string,
    content: string,
    websiteId: string
): BlogPost {
    const now = new Date().toISOString();

    return {
        id: generateId(),
        title,
        slug: slugify(title),
        content,
        excerpt: content.substring(0, 160).replace(/<[^>]*>/g, '') + '...',
        author: 'Admin',
        publishedAt: now,
        updatedAt: now,
        status: 'draft',
        tags: [],
        seo: {
            title,
            description: content.substring(0, 160).replace(/<[^>]*>/g, ''),
            keywords: [],
        },
    };
}

// Generate Privacy Policy Page
function generatePrivacyPolicyPage(formData: IntakeFormData): Page {
    return {
        id: generateId(),
        title: 'Privacy Policy',
        slug: 'privacy-policy',
        type: 'custom',
        content: [
            {
                id: generateId(),
                type: 'custom-content',
                content: {
                    html: `
                        <h1>Privacy Policy</h1>
                        <p class="last-updated">Last Updated: ${new Date().toLocaleDateString()}</p>
                        
                        <h2>Introduction</h2>
                        <p>${formData.businessName} is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information.</p>
                        
                        <h2>Information We Collect</h2>
                        <p>We may collect personal information including name, email, phone number, and address when you contact us or request services.</p>
                        
                        <h2>How We Use Your Information</h2>
                        <p>We use your information to provide services, respond to inquiries, and improve our offerings.</p>
                        
                        <h2>Data Security</h2>
                        <p>We implement appropriate security measures to protect your personal information.</p>
                        
                        <h2>Contact Us</h2>
                        <p>For questions about this Privacy Policy, contact us at ${formData.contactEmail || 'our office'}.</p>
                    `,
                },
                order: 0,
            },
        ],
        seo: {
            title: `Privacy Policy | ${formData.businessName}`,
            description: `Privacy Policy for ${formData.businessName}. Learn how we collect, use, and protect your personal information.`,
            keywords: ['privacy policy', 'data protection', formData.businessName],
        },
        order: 100,
        isPublished: true,
    };
}

// Generate Terms of Service Page
function generateTermsOfServicePage(formData: IntakeFormData): Page {
    return {
        id: generateId(),
        title: 'Terms of Service',
        slug: 'terms-of-service',
        type: 'custom',
        content: [
            {
                id: generateId(),
                type: 'custom-content',
                content: {
                    html: `
                        <h1>Terms of Service</h1>
                        <p class="last-updated">Last Updated: ${new Date().toLocaleDateString()}</p>
                        
                        <h2>Agreement to Terms</h2>
                        <p>By using the services of ${formData.businessName}, you agree to these Terms of Service.</p>
                        
                        <h2>Services</h2>
                        <p>${formData.businessName} provides professional ${getIndustryLabel(formData.industry)} services. Specific terms will be detailed in individual service agreements.</p>
                        
                        <h2>Estimates and Pricing</h2>
                        <p>All estimates are provided in good faith. Final pricing may vary based on actual work required.</p>
                        
                        <h2>Warranties</h2>
                        <p>We stand behind our work with warranties on workmanship. Specific terms vary by service.</p>
                        
                        <h2>Limitation of Liability</h2>
                        <p>Our liability is limited to the amount paid for the specific service.</p>
                        
                        <h2>Contact</h2>
                        <p>Questions? Contact us at ${formData.contactPhone || 'our office'}.</p>
                    `,
                },
                order: 0,
            },
        ],
        seo: {
            title: `Terms of Service | ${formData.businessName}`,
            description: `Terms of Service for ${formData.businessName}. Read our terms and conditions for using our services.`,
            keywords: ['terms of service', 'terms and conditions', formData.businessName],
        },
        order: 101,
        isPublished: true,
    };
}

// Generate Sitemap Page
function generateSitemapPage(formData: IntakeFormData): Page {
    return {
        id: generateId(),
        title: 'Sitemap',
        slug: 'sitemap',
        type: 'custom',
        content: [
            {
                id: generateId(),
                type: 'custom-content',
                content: {
                    html: `
                        <h1>Sitemap</h1>
                        <p>Browse all pages on our website:</p>
                        <div class="sitemap-links">
                            <h2>Main Pages</h2>
                            <ul>
                                <li><a href="/">Home</a></li>
                                <li><a href="/about">About Us</a></li>
                                <li><a href="/services">Services</a></li>
                                <li><a href="/contact">Contact</a></li>
                                <li><a href="/blog">Blog</a></li>
                            </ul>
                            <h2>Legal</h2>
                            <ul>
                                <li><a href="/privacy-policy">Privacy Policy</a></li>
                                <li><a href="/terms-of-service">Terms of Service</a></li>
                            </ul>
                        </div>
                    `,
                },
                order: 0,
            },
        ],
        seo: {
            title: `Sitemap | ${formData.businessName}`,
            description: `Sitemap for ${formData.businessName}. Find all pages on our website.`,
            keywords: ['sitemap', formData.businessName],
        },
        order: 102,
        isPublished: true,
    };
}
