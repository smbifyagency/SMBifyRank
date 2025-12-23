// Types for the AI Website Builder CRM

export interface Website {
    id: string;
    userId?: string; // Owner of the website
    name: string;
    businessName: string;
    industry: string;
    services: Service[];
    locations: Location[];
    colors: BrandColors;
    goal: WebsiteGoal;
    keywords: string[];
    pages: Page[];
    blogPosts: BlogPost[];
    seoSettings: SEOSettings;
    createdAt: string;
    updatedAt: string;
    status: 'draft' | 'published';
    netlifyUrl?: string;
    netlifySiteId?: string;
    contactPhone?: string;
    contactEmail?: string;
    logoUrl?: string;
    faviconUrl?: string;
    // Content fields for rich text editing
    heroHeadline?: string;
    heroSubheadline?: string;
    aboutContent?: string;
    servicesDescription?: string;
    contactContent?: string;
    footerContent?: string;
    // Business address for NAP (Name, Address, Phone) SEO
    businessAddress?: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country?: string;
    };
    // Custom content overrides from editing (rich content fields)
    customContent?: Record<string, string>;
    // Custom image overrides from editing
    customImages?: Record<string, { src: string; alt: string }>;
}

export interface Service {
    id: string;
    name: string;
    description: string;
    slug: string;
    icon?: string;
}

export interface Location {
    id: string;
    city: string;
    state?: string;
    slug: string;
    description?: string;
}

export interface BrandColors {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
}

export type WebsiteGoal = 'leads' | 'seo' | 'info' | 'ecommerce';

export interface Page {
    id: string;
    title: string;
    slug: string;
    type: PageType;
    content: PageSection[];
    seo: PageSEO;
    order: number;
    isPublished: boolean;
}

export type PageType =
    | 'home'
    | 'about'
    | 'services'
    | 'service-single'
    | 'contact'
    | 'blog'
    | 'blog-post'
    | 'location'
    | 'locations'
    | 'custom';

// ==========================================
// SECTION CONTENT SCHEMAS (JSON-first architecture)
// Each section type has a defined structure
// ==========================================

export interface HeroSectionContent {
    headline: string;
    subheadline: string;
    ctaPrimary?: { text: string; link: string };
    ctaSecondary?: { text: string; link: string };
    backgroundImage?: string;
    showPhone?: boolean;
}

export interface ServicesSectionContent {
    title: string;
    subtitle?: string;
    services: Array<{
        id: string;
        name: string;
        description: string;
        icon?: string;
        link?: string;
    }>;
}

export interface AboutSectionContent {
    title: string;
    body: string; // HTML/Markdown content
    image?: string;
    features?: Array<{ icon: string; text: string }>;
}

export interface ContactSectionContent {
    title: string;
    subtitle?: string;
    phone?: string;
    email?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
    showMap?: boolean;
    formFields?: Array<{
        name: string;
        type: 'text' | 'email' | 'phone' | 'textarea' | 'select';
        label: string;
        required?: boolean;
        options?: string[];
    }>;
}

export interface CTASectionContent {
    headline: string;
    subheadline?: string;
    buttonText: string;
    buttonLink: string;
    variant?: 'primary' | 'secondary' | 'accent';
}

export interface TestimonialsSectionContent {
    title: string;
    subtitle?: string;
    testimonials: Array<{
        id: string;
        name: string;
        company?: string;
        quote: string;
        rating?: number;
        image?: string;
    }>;
}

export interface LocationsSectionContent {
    title: string;
    subtitle?: string;
    locations: Array<{
        id: string;
        city: string;
        state?: string;
        description?: string;
        link?: string;
    }>;
}

export interface GallerySectionContent {
    title?: string;
    columns?: 2 | 3 | 4;
    images: Array<{
        id: string;
        src: string;
        alt: string;
        caption?: string;
    }>;
}

export interface FAQSectionContent {
    title: string;
    subtitle?: string;
    faqs: Array<{
        id: string;
        question: string;
        answer: string;
    }>;
}

export interface FeaturesSectionContent {
    title: string;
    subtitle?: string;
    features: Array<{
        id: string;
        icon?: string;
        title: string;
        description: string;
    }>;
    layout?: 'grid' | 'list';
}

export interface TrustBadgesSectionContent {
    title?: string;
    badges: Array<{
        id: string;
        name: string;
        image?: string;
        icon?: string;
    }>;
}

export interface BlogListSectionContent {
    title: string;
    subtitle?: string;
    postsToShow?: number;
    showExcerpt?: boolean;
}

export interface TextBlockSectionContent {
    content: string; // Rich text/HTML
    alignment?: 'left' | 'center' | 'right';
}

export interface ImageSectionContent {
    src: string;
    alt: string;
    caption?: string;
    fullWidth?: boolean;
}

export interface VideoSectionContent {
    url: string; // YouTube, Vimeo, or direct video URL
    title?: string;
    autoplay?: boolean;
}

export interface CustomContentSectionContent {
    html: string; // Raw HTML for custom sections
}

// Union type for all section content types
export type SectionContent =
    | HeroSectionContent
    | ServicesSectionContent
    | AboutSectionContent
    | ContactSectionContent
    | CTASectionContent
    | TestimonialsSectionContent
    | LocationsSectionContent
    | GallerySectionContent
    | FAQSectionContent
    | FeaturesSectionContent
    | TrustBadgesSectionContent
    | BlogListSectionContent
    | TextBlockSectionContent
    | ImageSectionContent
    | VideoSectionContent
    | CustomContentSectionContent;

export type SectionType =
    | 'hero'
    | 'services-grid'
    | 'about-intro'
    | 'testimonials'
    | 'cta'
    | 'contact-form'
    | 'locations-list'
    | 'blog-list'
    | 'custom-content'
    | 'gallery'
    | 'faq'
    | 'trust-badges'
    | 'image'
    | 'video'
    | 'text-block'
    | 'features';

// Updated PageSection with typed content and edit tracking
export interface PageSection {
    id: string;
    type: SectionType;
    content: SectionContent | Record<string, unknown>; // Support both typed and legacy
    order: number;
    // Edit tracking - prevents AI from overwriting user changes
    userEdited?: boolean;
    lastEditedAt?: string;
    lastEditedBy?: 'user' | 'ai' | 'system';
}

export interface PageSEO {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    author: string;
    publishedAt: string;
    updatedAt: string;
    status: 'draft' | 'published';
    tags: string[];
    seo: PageSEO;
    featuredImage?: string;
}

export interface SEOSettings {
    siteName: string;
    siteDescription: string;
    defaultImage?: string;
    googleAnalyticsId?: string;
    socialLinks: SocialLinks;
}

export interface SocialLinks {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
}

// Intake Form Types
export interface IntakeFormData {
    businessName: string;
    industry: string;
    customIndustry?: string;
    services: ServiceInput[];
    locations: LocationInput[];
    colors: BrandColors;
    goal: WebsiteGoal;
    keywords: string;
    contactEmail: string;
    contactPhone: string;
    additionalPages: string[];
    logoUrl?: string;
    isParasiteSite?: boolean; // Toggle for parasite site mode
    mainWebsiteUrl?: string; // For parasite sites - add backlinks to main site
    // Business address for NAP (Name, Address, Phone) SEO
    businessAddress?: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
}

export interface ServiceInput {
    name: string;
    description: string;
}

export interface LocationInput {
    city: string;
    state?: string;
}

// Industry options - Sorted A-Z for easy browsing
export const INDUSTRIES = [
    { value: 'ac-repair', label: 'AC Repair & Installation' },
    { value: 'accounting', label: 'Accounting & Tax' },
    { value: 'air-duct-cleaning', label: 'Air Duct Cleaning' },
    { value: 'appliance-repair', label: 'Appliance Repair' },
    { value: 'asphalt', label: 'Asphalt Paving' },
    { value: 'auto-body', label: 'Auto Body Shop' },
    { value: 'automotive', label: 'Auto Repair' },
    { value: 'basement-remodeling', label: 'Basement Remodeling' },
    { value: 'bathroom-remodeling', label: 'Bathroom Remodeling' },
    { value: 'bed-bug', label: 'Bed Bug Exterminator' },
    { value: 'car-detailing', label: 'Car Detailing' },
    { value: 'carpet-cleaning', label: 'Carpet Cleaning' },
    { value: 'chimney', label: 'Chimney Sweep & Repair' },
    { value: 'chiropractic', label: 'Chiropractic' },
    { value: 'cleaning', label: 'Cleaning Services' },
    { value: 'concrete', label: 'Concrete & Pavers' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'deck-builder', label: 'Deck Builder' },
    { value: 'dental', label: 'Dental' },
    { value: 'door', label: 'Door Installation' },
    { value: 'drain-cleaning', label: 'Drain Cleaning' },
    { value: 'driveway-paving', label: 'Driveway Paving' },
    { value: 'drywall', label: 'Drywall Repair' },
    { value: 'electrical', label: 'Electrical Services' },
    { value: 'electrician', label: 'Electrician' },
    { value: 'epoxy-flooring', label: 'Epoxy Flooring' },
    { value: 'exterior-painting', label: 'Exterior Painting' },
    { value: 'family-law', label: 'Family Law' },
    { value: 'fence', label: 'Fence Installation' },
    { value: 'fire-damage', label: 'Fire Damage Restoration' },
    { value: 'fitness', label: 'Fitness/Gym' },
    { value: 'flooring', label: 'Flooring Installation' },
    { value: 'garage-door', label: 'Garage Door Services' },
    { value: 'general-contractor', label: 'General Contractor' },
    { value: 'generator', label: 'Generator Installation' },
    { value: 'glass-repair', label: 'Glass Repair' },
    { value: 'gutters', label: 'Gutter Installation & Repair' },
    { value: 'handyman', label: 'Handyman Services' },
    { value: 'hardscape', label: 'Hardscaping & Pavers' },
    { value: 'heating-repair', label: 'Heating & Furnace Repair' },
    { value: 'home-builder', label: 'Home Builder' },
    { value: 'home-inspection', label: 'Home Inspection' },
    { value: 'home-security', label: 'Home Security Systems' },
    { value: 'hvac', label: 'HVAC (Heating & Cooling)' },
    { value: 'insulation', label: 'Insulation Services' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'interior-painting', label: 'Interior Painting' },
    { value: 'junk-removal', label: 'Junk Removal' },
    { value: 'kitchen-remodeling', label: 'Kitchen Remodeling' },
    { value: 'landscaping', label: 'Landscaping' },
    { value: 'lawn-care', label: 'Lawn Care & Mowing' },
    { value: 'leak-detection', label: 'Leak Detection' },
    { value: 'legal', label: 'Legal Services' },
    { value: 'locksmith', label: 'Locksmith' },
    { value: 'medical', label: 'Medical/Healthcare' },
    { value: 'metal-roofing', label: 'Metal Roofing' },
    { value: 'mold-removal', label: 'Mold Removal & Remediation' },
    { value: 'moving', label: 'Moving Services' },
    { value: 'painting', label: 'Painting Services' },
    { value: 'personal-injury', label: 'Personal Injury Law' },
    { value: 'pest-control', label: 'Pest Control' },
    { value: 'photography', label: 'Photography' },
    { value: 'physical-therapy', label: 'Physical Therapy' },
    { value: 'plumbing', label: 'Plumbing Services' },
    { value: 'pool-service', label: 'Pool Cleaning & Repair' },
    { value: 'pressure-washing', label: 'Pressure Washing' },
    { value: 'realestate', label: 'Real Estate' },
    { value: 'restaurant', label: 'Restaurant/Food' },
    { value: 'restoration', label: 'Restoration (Water/Fire)' },
    { value: 'roof-repair', label: 'Roof Repair' },
    { value: 'roof-replacement', label: 'Roof Replacement' },
    { value: 'roofing', label: 'Roofing Contractor' },
    { value: 'salon', label: 'Salon/Beauty' },
    { value: 'septic', label: 'Septic Tank Services' },
    { value: 'solar-panel', label: 'Solar Panel Installation' },
    { value: 'sprinkler', label: 'Sprinkler & Irrigation' },
    { value: 'technology', label: 'Technology/IT' },
    { value: 'termite', label: 'Termite Control' },
    { value: 'tile-installation', label: 'Tile Installation' },
    { value: 'tire-shop', label: 'Tire Shop' },
    { value: 'towing', label: 'Towing Services' },
    { value: 'tree-service', label: 'Tree Trimming & Removal' },
    { value: 'veterinary', label: 'Veterinary' },
    { value: 'water-damage', label: 'Water Damage Restoration' },
    { value: 'water-heater', label: 'Water Heater Services' },
    { value: 'wildlife-removal', label: 'Wildlife Removal' },
    { value: 'windows', label: 'Window Installation & Repair' },
    { value: 'other', label: 'Other' },
] as const;

export const WEBSITE_GOALS = [
    { value: 'leads', label: 'Generate Leads', description: 'Focus on contact forms and CTAs' },
    { value: 'seo', label: 'SEO & Ranking', description: 'Optimize for search engines' },
    { value: 'info', label: 'Informational', description: 'Showcase services and info' },
    { value: 'ecommerce', label: 'E-commerce', description: 'Sell products online' },
] as const;

// Default brand colors
export const DEFAULT_COLORS: BrandColors = {
    primary: '#2563eb',
    secondary: '#1e40af',
    accent: '#f59e0b',
    background: '#ffffff',
    text: '#1f2937',
};

// Export/Deploy Types
export interface ExportedWebsite {
    files: ExportedFile[];
    totalSize: number;
}

export interface ExportedFile {
    path: string;
    content: string;
    type: 'html' | 'css' | 'js' | 'image' | 'other';
}

export interface NetlifyDeployment {
    siteId: string;
    siteName: string;
    url: string;
    deployId: string;
    status: 'building' | 'ready' | 'error';
}
