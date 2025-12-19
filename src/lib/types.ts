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

// Industry options - Comprehensive list for home services and local businesses
export const INDUSTRIES = [
    // Air and Energy
    { value: 'hvac', label: 'HVAC (Heating & Cooling)' },
    { value: 'ac-repair', label: 'AC Repair & Installation' },
    { value: 'heating-repair', label: 'Heating & Furnace Repair' },
    { value: 'air-duct-cleaning', label: 'Air Duct Cleaning' },
    { value: 'insulation', label: 'Insulation Services' },
    { value: 'solar-panel', label: 'Solar Panel Installation' },

    // Plumbing and Drainage
    { value: 'plumbing', label: 'Plumbing Services' },
    { value: 'drain-cleaning', label: 'Drain Cleaning' },
    { value: 'water-heater', label: 'Water Heater Services' },
    { value: 'septic', label: 'Septic Tank Services' },
    { value: 'leak-detection', label: 'Leak Detection' },

    // Electrical
    { value: 'electrical', label: 'Electrical Services' },
    { value: 'electrician', label: 'Electrician' },
    { value: 'generator', label: 'Generator Installation' },

    // Home Construction and Remodeling
    { value: 'general-contractor', label: 'General Contractor' },
    { value: 'bathroom-remodeling', label: 'Bathroom Remodeling' },
    { value: 'kitchen-remodeling', label: 'Kitchen Remodeling' },
    { value: 'basement-remodeling', label: 'Basement Remodeling' },
    { value: 'home-builder', label: 'Home Builder' },
    { value: 'deck-builder', label: 'Deck Builder' },
    { value: 'flooring', label: 'Flooring Installation' },
    { value: 'tile-installation', label: 'Tile Installation' },
    { value: 'concrete', label: 'Concrete & Pavers' },

    // Painting and Surface Work
    { value: 'painting', label: 'Painting Services' },
    { value: 'interior-painting', label: 'Interior Painting' },
    { value: 'exterior-painting', label: 'Exterior Painting' },
    { value: 'epoxy-flooring', label: 'Epoxy Flooring' },
    { value: 'drywall', label: 'Drywall Repair' },

    // Roofing and Gutters
    { value: 'roofing', label: 'Roofing Contractor' },
    { value: 'roof-repair', label: 'Roof Repair' },
    { value: 'roof-replacement', label: 'Roof Replacement' },
    { value: 'gutters', label: 'Gutter Installation & Repair' },
    { value: 'metal-roofing', label: 'Metal Roofing' },

    // Cleaning and Restoration
    { value: 'restoration', label: 'Water/Fire Restoration' },
    { value: 'water-damage', label: 'Water Damage Restoration' },
    { value: 'fire-damage', label: 'Fire Damage Restoration' },
    { value: 'mold-removal', label: 'Mold Removal & Remediation' },
    { value: 'cleaning', label: 'Cleaning Services' },
    { value: 'carpet-cleaning', label: 'Carpet Cleaning' },
    { value: 'pressure-washing', label: 'Pressure Washing' },
    { value: 'junk-removal', label: 'Junk Removal' },

    // Doors and Windows
    { value: 'windows', label: 'Window Installation & Repair' },
    { value: 'doors', label: 'Door Installation' },
    { value: 'garage-door', label: 'Garage Door Services' },
    { value: 'glass-repair', label: 'Glass Repair' },

    // Pest and Wildlife Control
    { value: 'pest-control', label: 'Pest Control' },
    { value: 'termite', label: 'Termite Control' },
    { value: 'bed-bug', label: 'Bed Bug Exterminator' },
    { value: 'wildlife-removal', label: 'Wildlife Removal' },

    // Yard and Outdoor Services
    { value: 'landscaping', label: 'Landscaping' },
    { value: 'lawn-care', label: 'Lawn Care & Mowing' },
    { value: 'tree-service', label: 'Tree Trimming & Removal' },
    { value: 'sprinkler', label: 'Sprinkler & Irrigation' },
    { value: 'fence', label: 'Fence Installation' },
    { value: 'hardscape', label: 'Hardscaping & Pavers' },
    { value: 'pool-service', label: 'Pool Cleaning & Repair' },

    // Garage and Driveway
    { value: 'driveway-paving', label: 'Driveway Paving' },
    { value: 'asphalt', label: 'Asphalt Paving' },

    // Other Home Services
    { value: 'handyman', label: 'Handyman Services' },
    { value: 'locksmith', label: 'Locksmith' },
    { value: 'appliance-repair', label: 'Appliance Repair' },
    { value: 'chimney', label: 'Chimney Sweep & Repair' },
    { value: 'home-inspection', label: 'Home Inspection' },
    { value: 'home-security', label: 'Home Security Systems' },
    { value: 'moving', label: 'Moving Services' },
    { value: 'towing', label: 'Towing Services' },

    // Professional Services
    { value: 'legal', label: 'Legal Services' },
    { value: 'personal-injury', label: 'Personal Injury Law' },
    { value: 'family-law', label: 'Family Law' },
    { value: 'realestate', label: 'Real Estate' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'accounting', label: 'Accounting & Tax' },
    { value: 'consulting', label: 'Consulting' },

    // Health and Medical
    { value: 'dental', label: 'Dental' },
    { value: 'chiropractic', label: 'Chiropractic' },
    { value: 'medical', label: 'Medical/Healthcare' },
    { value: 'physical-therapy', label: 'Physical Therapy' },
    { value: 'veterinary', label: 'Veterinary' },

    // Automotive
    { value: 'automotive', label: 'Auto Repair' },
    { value: 'auto-body', label: 'Auto Body Shop' },
    { value: 'tire-shop', label: 'Tire Shop' },
    { value: 'car-detailing', label: 'Car Detailing' },

    // Other
    { value: 'restaurant', label: 'Restaurant/Food' },
    { value: 'fitness', label: 'Fitness/Gym' },
    { value: 'salon', label: 'Salon/Beauty' },
    { value: 'photography', label: 'Photography' },
    { value: 'technology', label: 'Technology/IT' },
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
