// Color Palettes for AI Site Builder
// Pre-built palettes with category-based defaults

import { BrandColors } from './types';

export interface ColorPalette {
    id: string;
    name: string;
    colors: BrandColors;
    categories: string[]; // Industry values that match this palette
}

// Pre-built color palettes
export const COLOR_PALETTES: ColorPalette[] = [
    // Blue/Trust Palettes
    {
        id: 'ocean-blue',
        name: 'Ocean Blue',
        colors: {
            primary: '#0284c7',
            secondary: '#0369a1',
            accent: '#38bdf8',
            background: '#ffffff',
            text: '#1e293b'
        },
        categories: ['plumbing', 'water-damage', 'restoration', 'pool-service', 'hvac', 'ac-repair', 'water-heater']
    },
    {
        id: 'professional-navy',
        name: 'Professional Navy',
        colors: {
            primary: '#1e3a5f',
            secondary: '#2c5282',
            accent: '#4299e1',
            background: '#ffffff',
            text: '#1a202c'
        },
        categories: ['legal', 'personal-injury', 'family-law', 'insurance', 'accounting', 'consulting']
    },
    // Green/Nature Palettes
    {
        id: 'forest-green',
        name: 'Forest Green',
        colors: {
            primary: '#166534',
            secondary: '#15803d',
            accent: '#22c55e',
            background: '#ffffff',
            text: '#1f2937'
        },
        categories: ['landscaping', 'lawn-care', 'tree-service', 'sprinkler', 'fence', 'hardscape']
    },
    {
        id: 'eco-fresh',
        name: 'Eco Fresh',
        colors: {
            primary: '#059669',
            secondary: '#047857',
            accent: '#10b981',
            background: '#ffffff',
            text: '#1f2937'
        },
        categories: ['cleaning', 'pressure-washing', 'carpet-cleaning', 'mold-removal']
    },
    // Orange/Energy Palettes
    {
        id: 'sunset-orange',
        name: 'Sunset Orange',
        colors: {
            primary: '#ea580c',
            secondary: '#c2410c',
            accent: '#fb923c',
            background: '#ffffff',
            text: '#1c1917'
        },
        categories: ['roofing', 'roof-repair', 'roof-replacement', 'metal-roofing', 'solar-panel']
    },
    {
        id: 'warm-amber',
        name: 'Warm Amber',
        colors: {
            primary: '#d97706',
            secondary: '#b45309',
            accent: '#fbbf24',
            background: '#ffffff',
            text: '#1c1917'
        },
        categories: ['electrical', 'electrician', 'generator', 'home-security']
    },
    // Red/Urgent Palettes
    {
        id: 'fire-red',
        name: 'Fire Red',
        colors: {
            primary: '#dc2626',
            secondary: '#b91c1c',
            accent: '#f87171',
            background: '#ffffff',
            text: '#1f2937'
        },
        categories: ['fire-damage', 'towing', 'locksmith']
    },
    // Gray/Industrial Palettes
    {
        id: 'steel-gray',
        name: 'Steel Gray',
        colors: {
            primary: '#475569',
            secondary: '#334155',
            accent: '#94a3b8',
            background: '#ffffff',
            text: '#1e293b'
        },
        categories: ['automotive', 'auto-body', 'tire-shop', 'garage-door', 'asphalt', 'driveway-paving', 'concrete']
    },
    {
        id: 'industrial-dark',
        name: 'Industrial Dark',
        colors: {
            primary: '#1f2937',
            secondary: '#374151',
            accent: '#6b7280',
            background: '#ffffff',
            text: '#111827'
        },
        categories: ['general-contractor', 'home-builder', 'flooring', 'tile-installation', 'drywall']
    },
    // Purple/Premium Palettes
    {
        id: 'royal-purple',
        name: 'Royal Purple',
        colors: {
            primary: '#7c3aed',
            secondary: '#6d28d9',
            accent: '#a78bfa',
            background: '#ffffff',
            text: '#1f2937'
        },
        categories: ['technology', 'photography', 'consulting']
    },
    // Medical/Health Palettes
    {
        id: 'medical-teal',
        name: 'Medical Teal',
        colors: {
            primary: '#0d9488',
            secondary: '#0f766e',
            accent: '#2dd4bf',
            background: '#ffffff',
            text: '#1f2937'
        },
        categories: ['medical', 'dental', 'chiropractic', 'physical-therapy', 'veterinary']
    },
    // Pastel/Beauty Palettes
    {
        id: 'blush-pink',
        name: 'Blush Pink',
        colors: {
            primary: '#ec4899',
            secondary: '#db2777',
            accent: '#f472b6',
            background: '#ffffff',
            text: '#1f2937'
        },
        categories: ['salon', 'photography']
    },
    // Warm/Hospitality Palettes
    {
        id: 'warm-terracotta',
        name: 'Warm Terracotta',
        colors: {
            primary: '#c2410c',
            secondary: '#9a3412',
            accent: '#fb923c',
            background: '#ffffff',
            text: '#1c1917'
        },
        categories: ['restaurant', 'realestate', 'moving']
    },
    // Yellow/Optimistic Palettes
    {
        id: 'golden-yellow',
        name: 'Golden Yellow',
        colors: {
            primary: '#ca8a04',
            secondary: '#a16207',
            accent: '#eab308',
            background: '#ffffff',
            text: '#1c1917'
        },
        categories: ['pest-control', 'termite', 'bed-bug', 'wildlife-removal']
    },
    // Fitness/Energy Palettes
    {
        id: 'power-red',
        name: 'Power Red',
        colors: {
            primary: '#be123c',
            secondary: '#9f1239',
            accent: '#fb7185',
            background: '#ffffff',
            text: '#1f2937'
        },
        categories: ['fitness']
    },
    // Brown/Home Palettes
    {
        id: 'earthy-brown',
        name: 'Earthy Brown',
        colors: {
            primary: '#78350f',
            secondary: '#92400e',
            accent: '#d97706',
            background: '#ffffff',
            text: '#1c1917'
        },
        categories: ['deck-builder', 'handyman', 'chimney', 'home-inspection']
    },
    // Default/General
    {
        id: 'modern-blue',
        name: 'Modern Blue',
        colors: {
            primary: '#2563eb',
            secondary: '#1e40af',
            accent: '#f59e0b',
            background: '#ffffff',
            text: '#1f2937'
        },
        categories: ['other'] // Default fallback
    }
];

// Get palette for an industry
export function getPaletteForIndustry(industryValue: string): ColorPalette {
    const palette = COLOR_PALETTES.find(p => p.categories.includes(industryValue));
    return palette || COLOR_PALETTES.find(p => p.id === 'modern-blue')!;
}

// Get all palettes
export function getAllPalettes(): ColorPalette[] {
    return COLOR_PALETTES;
}
