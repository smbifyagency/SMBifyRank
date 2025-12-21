// Industry-specific color templates with light and dark mode options
// Each template includes primary, secondary, accent, background, and text colors

export interface IndustryTemplate {
    id: string;
    name: string;
    industry: string;
    description: string;
    light: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
    };
    dark: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
    };
    fonts?: {
        heading: string;
        body: string;
    };
}

export const INDUSTRY_TEMPLATES: IndustryTemplate[] = [
    // Service Industries
    {
        id: 'home-services',
        name: 'Home Services Pro',
        industry: 'home-services',
        description: 'Clean and trustworthy design for plumbing, HVAC, electrical',
        light: {
            primary: '#1E40AF',
            secondary: '#3B82F6',
            accent: '#F59E0B',
            background: '#F8FAFC',
            text: '#1E293B',
        },
        dark: {
            primary: '#3B82F6',
            secondary: '#60A5FA',
            accent: '#FBBF24',
            background: '#0F172A',
            text: '#F1F5F9',
        },
    },
    {
        id: 'water-damage',
        name: 'Restoration Expert',
        industry: 'water-damage',
        description: 'Professional restoration and emergency services',
        light: {
            primary: '#0369A1',
            secondary: '#0EA5E9',
            accent: '#DC2626',
            background: '#F0F9FF',
            text: '#0C4A6E',
        },
        dark: {
            primary: '#0EA5E9',
            secondary: '#38BDF8',
            accent: '#EF4444',
            background: '#082F49',
            text: '#E0F2FE',
        },
    },
    {
        id: 'roofing',
        name: 'Roofing Pro',
        industry: 'roofing',
        description: 'Sturdy and reliable design for roofing contractors',
        light: {
            primary: '#78350F',
            secondary: '#B45309',
            accent: '#15803D',
            background: '#FFFBEB',
            text: '#451A03',
        },
        dark: {
            primary: '#D97706',
            secondary: '#F59E0B',
            accent: '#22C55E',
            background: '#1C1917',
            text: '#FEF3C7',
        },
    },
    {
        id: 'cleaning',
        name: 'Clean & Fresh',
        industry: 'cleaning',
        description: 'Bright and fresh design for cleaning services',
        light: {
            primary: '#059669',
            secondary: '#10B981',
            accent: '#06B6D4',
            background: '#F0FDF4',
            text: '#064E3B',
        },
        dark: {
            primary: '#10B981',
            secondary: '#34D399',
            accent: '#22D3EE',
            background: '#022C22',
            text: '#D1FAE5',
        },
    },
    {
        id: 'landscaping',
        name: 'Green Garden',
        industry: 'landscaping',
        description: 'Natural earthy tones for landscaping businesses',
        light: {
            primary: '#166534',
            secondary: '#22C55E',
            accent: '#CA8A04',
            background: '#F0FDF4',
            text: '#14532D',
        },
        dark: {
            primary: '#22C55E',
            secondary: '#4ADE80',
            accent: '#EAB308',
            background: '#052E16',
            text: '#DCFCE7',
        },
    },
    // Healthcare & Wellness
    {
        id: 'medical',
        name: 'Medical Care',
        industry: 'medical',
        description: 'Clean and calming design for healthcare providers',
        light: {
            primary: '#0D9488',
            secondary: '#14B8A6',
            accent: '#2563EB',
            background: '#F0FDFA',
            text: '#134E4A',
        },
        dark: {
            primary: '#14B8A6',
            secondary: '#2DD4BF',
            accent: '#3B82F6',
            background: '#042F2E',
            text: '#CCFBF1',
        },
    },
    {
        id: 'dental',
        name: 'Dental Smile',
        industry: 'dental',
        description: 'Bright and welcoming design for dental practices',
        light: {
            primary: '#0891B2',
            secondary: '#06B6D4',
            accent: '#8B5CF6',
            background: '#ECFEFF',
            text: '#164E63',
        },
        dark: {
            primary: '#06B6D4',
            secondary: '#22D3EE',
            accent: '#A78BFA',
            background: '#083344',
            text: '#CFFAFE',
        },
    },
    // Legal & Professional
    {
        id: 'legal',
        name: 'Law Firm',
        industry: 'legal',
        description: 'Authoritative and professional design for law firms',
        light: {
            primary: '#1E3A5F',
            secondary: '#2563EB',
            accent: '#B8860B',
            background: '#F8FAFC',
            text: '#1E293B',
        },
        dark: {
            primary: '#3B82F6',
            secondary: '#60A5FA',
            accent: '#DAA520',
            background: '#0F172A',
            text: '#E2E8F0',
        },
    },
    {
        id: 'finance',
        name: 'Financial Trust',
        industry: 'finance',
        description: 'Secure and trustworthy for financial services',
        light: {
            primary: '#0F4C75',
            secondary: '#1B262C',
            accent: '#10B981',
            background: '#F9FAFB',
            text: '#111827',
        },
        dark: {
            primary: '#3B82F6',
            secondary: '#1E40AF',
            accent: '#34D399',
            background: '#0D1117',
            text: '#F3F4F6',
        },
    },
    // Real Estate & Construction
    {
        id: 'real-estate',
        name: 'Real Estate Luxury',
        industry: 'real-estate',
        description: 'Elegant design for real estate agencies',
        light: {
            primary: '#7C3AED',
            secondary: '#8B5CF6',
            accent: '#F59E0B',
            background: '#FAF5FF',
            text: '#3B0764',
        },
        dark: {
            primary: '#A78BFA',
            secondary: '#C4B5FD',
            accent: '#FBBF24',
            background: '#1C1132',
            text: '#EDE9FE',
        },
    },
    {
        id: 'construction',
        name: 'Build Strong',
        industry: 'construction',
        description: 'Bold and industrial for construction companies',
        light: {
            primary: '#DC2626',
            secondary: '#EF4444',
            accent: '#F59E0B',
            background: '#FFFBEB',
            text: '#1C1917',
        },
        dark: {
            primary: '#EF4444',
            secondary: '#F87171',
            accent: '#FBBF24',
            background: '#1C1917',
            text: '#FEF3C7',
        },
    },
    // Technology & SaaS
    {
        id: 'tech',
        name: 'Tech Modern',
        industry: 'technology',
        description: 'Sleek and modern design for tech companies',
        light: {
            primary: '#6366F1',
            secondary: '#818CF8',
            accent: '#EC4899',
            background: '#F9FAFB',
            text: '#1F2937',
        },
        dark: {
            primary: '#818CF8',
            secondary: '#A5B4FC',
            accent: '#F472B6',
            background: '#0F0F23',
            text: '#F3F4F6',
        },
    },
    {
        id: 'saas',
        name: 'SaaS Startup',
        industry: 'saas',
        description: 'Vibrant and engaging for SaaS products',
        light: {
            primary: '#4F46E5',
            secondary: '#7C3AED',
            accent: '#06B6D4',
            background: '#FFFFFF',
            text: '#111827',
        },
        dark: {
            primary: '#6366F1',
            secondary: '#8B5CF6',
            accent: '#22D3EE',
            background: '#0A0A0F',
            text: '#F9FAFB',
        },
    },
    // Food & Hospitality
    {
        id: 'restaurant',
        name: 'Restaurant Warm',
        industry: 'restaurant',
        description: 'Warm and inviting for restaurants and cafes',
        light: {
            primary: '#B91C1C',
            secondary: '#DC2626',
            accent: '#CA8A04',
            background: '#FFFBEB',
            text: '#1C1917',
        },
        dark: {
            primary: '#EF4444',
            secondary: '#F87171',
            accent: '#EAB308',
            background: '#1C1917',
            text: '#FEF2F2',
        },
    },
    {
        id: 'fitness',
        name: 'Fitness Energy',
        industry: 'fitness',
        description: 'Energetic and bold for gyms and fitness centers',
        light: {
            primary: '#EA580C',
            secondary: '#F97316',
            accent: '#14B8A6',
            background: '#FFF7ED',
            text: '#1C1917',
        },
        dark: {
            primary: '#F97316',
            secondary: '#FB923C',
            accent: '#2DD4BF',
            background: '#1C0C0C',
            text: '#FFEDD5',
        },
    },
    // E-commerce & Retail
    {
        id: 'ecommerce',
        name: 'Shop Modern',
        industry: 'ecommerce',
        description: 'Clean and conversion-focused for online stores',
        light: {
            primary: '#000000',
            secondary: '#4B5563',
            accent: '#16A34A',
            background: '#FFFFFF',
            text: '#111827',
        },
        dark: {
            primary: '#F9FAFB',
            secondary: '#D1D5DB',
            accent: '#22C55E',
            background: '#111111',
            text: '#F3F4F6',
        },
    },
];

// Get template by industry
export function getTemplateByIndustry(industry: string): IndustryTemplate | undefined {
    return INDUSTRY_TEMPLATES.find(t => t.industry === industry);
}

// Get all templates for a specific mode
export function getTemplateColors(template: IndustryTemplate, mode: 'light' | 'dark') {
    return mode === 'dark' ? template.dark : template.light;
}

// Convert template colors to BrandColors format
export function templateToBrandColors(template: IndustryTemplate, mode: 'light' | 'dark') {
    const colors = getTemplateColors(template, mode);
    return {
        primary: colors.primary,
        secondary: colors.secondary,
        accent: colors.accent,
        background: colors.background,
        text: colors.text,
    };
}
