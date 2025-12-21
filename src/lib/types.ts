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
    // Business address for NAP (Name, Address, Phone) SEO
    businessAddress?: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country?: string;
    };
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

export interface PageSection {
    id: string;
    type: SectionType;
    content: Record<string, unknown>;
    order: number;
}

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
