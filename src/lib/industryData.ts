// Industry Data - Comprehensive category definitions with services, images, and metadata

export interface IndustryCategory {
    id: string;
    name: string;
    icon: string;
    description: string;
    defaultServices: ServiceTemplate[];
    images: CategoryImages;
    keywords: string[];
    schemaType: string;
    faqTopics: string[];
}

export interface ServiceTemplate {
    name: string;
    description: string;
    icon: string;
    features: string[];
    process: string[];
}

export interface CategoryImages {
    hero: string;
    about: string;
    services: string[];
    gallery: string[];
}

// Unsplash image URLs for each category
const IMAGES = {
    restoration: {
        hero: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
        services: [
            'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
            'https://images.unsplash.com/photo-1613323593608-abc90fec84ff?w=600&q=80',
        ],
        gallery: [
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
            'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80',
        ],
    },
    plumbing: {
        hero: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&q=80',
        services: [
            'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&q=80',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
            'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80',
        ],
        gallery: [],
    },
    hvac: {
        hero: 'https://images.unsplash.com/photo-1631545806609-cc7fca629494?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80',
        services: [
            'https://images.unsplash.com/photo-1631545806609-cc7fca629494?w=600&q=80',
            'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
        ],
        gallery: [],
    },
    roofing: {
        hero: 'https://images.unsplash.com/photo-1632759145351-1d592919f522?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
        services: [
            'https://images.unsplash.com/photo-1632759145351-1d592919f522?w=600&q=80',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
        ],
        gallery: [],
    },
    electrical: {
        hero: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        services: [
            'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80',
        ],
        gallery: [],
    },
    landscaping: {
        hero: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
        services: [
            'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=600&q=80',
            'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80',
        ],
        gallery: [],
    },
    cleaning: {
        hero: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&q=80',
        services: [
            'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
            'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&q=80',
        ],
        gallery: [],
    },
    pest: {
        hero: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        services: [],
        gallery: [],
    },
    legal: {
        hero: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?w=800&q=80',
        services: [
            'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80',
            'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80',
        ],
        gallery: [],
    },
    dental: {
        hero: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80',
        services: [
            'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&q=80',
            'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&q=80',
        ],
        gallery: [],
    },
    automotive: {
        hero: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80',
        services: [
            'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80',
            'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=600&q=80',
        ],
        gallery: [],
    },
    realestate: {
        hero: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&q=80',
        services: [
            'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
        ],
        gallery: [],
    },
    // Additional industry-specific images
    solar: {
        hero: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80',
        services: [
            'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80',
            'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&q=80',
        ],
        gallery: [],
    },
    painting: {
        hero: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        services: [
            'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&q=80',
            'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80',
        ],
        gallery: [],
    },
    pool: {
        hero: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80',
        services: [
            'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&q=80',
            'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=600&q=80',
        ],
        gallery: [],
    },
    fence: {
        hero: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        services: [
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
        ],
        gallery: [],
    },
    tree: {
        hero: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80',
        services: [
            'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80',
            'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&q=80',
        ],
        gallery: [],
    },
    garage: {
        hero: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        services: [
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
        ],
        gallery: [],
    },
    handyman: {
        hero: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
        services: [
            'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80',
            'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
        ],
        gallery: [],
    },
    towing: {
        hero: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        services: [
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
        ],
        gallery: [],
    },
    moving: {
        hero: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80',
        services: [
            'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=600&q=80',
            'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&q=80',
        ],
        gallery: [],
    },
    locksmith: {
        hero: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        services: [
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
        ],
        gallery: [],
    },
    chiropractic: {
        hero: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
        services: [
            'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80',
            'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
        ],
        gallery: [],
    },
    remodeling: {
        hero: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1556909211-36987daf7b4d?w=800&q=80',
        services: [
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
            'https://images.unsplash.com/photo-1556909211-36987daf7b4d?w=600&q=80',
        ],
        gallery: [],
    },
    flooring: {
        hero: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80',
        services: [
            'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600&q=80',
        ],
        gallery: [],
    },
    carpet: {
        hero: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80',
        services: [
            'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&q=80',
        ],
        gallery: [],
    },
    pressure: {
        hero: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        services: [
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
        ],
        gallery: [],
    },
    window: {
        hero: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        services: [
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
        ],
        gallery: [],
    },
    concrete: {
        hero: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        services: [
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
        ],
        gallery: [],
    },
    appliance: {
        hero: 'https://images.unsplash.com/photo-1556909114-4f3c2f6f1c3c?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1556909114-4f3c2f6f1c3c?w=800&q=80',
        services: [
            'https://images.unsplash.com/photo-1556909114-4f3c2f6f1c3c?w=600&q=80',
        ],
        gallery: [],
    },
    default: {
        hero: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80',
        about: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
        services: [
            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
        ],
        gallery: [],
    },
};

// Comprehensive industry categories
export const INDUSTRY_CATEGORIES: IndustryCategory[] = [
    // === HOME SERVICES ===
    {
        id: 'water-restoration',
        name: 'Water Damage Restoration',
        icon: '💧',
        description: 'Professional water damage restoration and flood cleanup services',
        schemaType: 'HomeAndConstructionBusiness',
        keywords: ['water damage', 'flood restoration', 'water extraction', 'emergency water removal', 'water mitigation'],
        faqTopics: ['How long does water damage restoration take?', 'Does insurance cover water damage?', 'Signs of hidden water damage', 'Cost of water damage restoration'],
        images: IMAGES.restoration,
        defaultServices: [
            {
                name: 'Water Extraction',
                description: 'Professional water extraction and removal services using industrial-grade pumps and equipment. We respond 24/7 to minimize damage and prevent mold growth.',
                icon: '💧',
                features: ['24/7 Emergency Response', 'Industrial Equipment', 'Complete Water Removal', 'Moisture Detection'],
                process: ['Initial Assessment', 'Water Extraction', 'Drying & Dehumidification', 'Final Inspection'],
            },
            {
                name: 'Flood Cleanup',
                description: 'Comprehensive flood damage cleanup and restoration. Our certified technicians handle everything from water removal to structural drying.',
                icon: '🌊',
                features: ['Storm Damage Repair', 'Sewage Cleanup', 'Content Restoration', 'Structural Drying'],
                process: ['Emergency Response', 'Flood Assessment', 'Water Removal', 'Sanitization', 'Restoration'],
            },
            {
                name: 'Moisture Detection',
                description: 'Advanced moisture detection services to identify hidden water damage in walls, floors, and ceilings before it causes major problems.',
                icon: '🔍',
                features: ['Thermal Imaging', 'Moisture Meters', 'Hidden Leak Detection', 'Detailed Reports'],
                process: ['Property Scan', 'Moisture Mapping', 'Source Identification', 'Documentation'],
            },
            {
                name: 'Structural Drying',
                description: 'Complete structural drying services to restore your property to pre-loss condition. We use commercial dehumidifiers and air movers.',
                icon: '🏠',
                features: ['Industrial Dehumidifiers', 'Air Circulation', 'Progress Monitoring', 'Documentation for Insurance'],
                process: ['Setup Equipment', 'Monitor Progress', 'Adjust as Needed', 'Verify Completion'],
            },
        ],
    },
    {
        id: 'fire-restoration',
        name: 'Fire & Smoke Restoration',
        icon: '🔥',
        description: 'Complete fire damage restoration and smoke cleanup services',
        schemaType: 'HomeAndConstructionBusiness',
        keywords: ['fire damage', 'smoke damage', 'fire restoration', 'soot removal', 'odor elimination'],
        faqTopics: ['Fire damage restoration process', 'Smoke odor removal', 'Insurance claims for fire damage'],
        images: IMAGES.restoration,
        defaultServices: [
            {
                name: 'Fire Damage Restoration',
                description: 'Complete fire damage restoration services from initial assessment to final reconstruction. We restore your property to pre-fire condition.',
                icon: '🔥',
                features: ['Board-Up Services', 'Debris Removal', 'Structural Repairs', 'Content Restoration'],
                process: ['Emergency Board-Up', 'Assessment', 'Cleanup', 'Restoration', 'Reconstruction'],
            },
            {
                name: 'Smoke & Soot Removal',
                description: 'Professional smoke and soot cleanup using specialized equipment and techniques to eliminate damage and odors.',
                icon: '💨',
                features: ['Air Scrubbing', 'Surface Cleaning', 'Content Cleaning', 'HVAC Cleaning'],
                process: ['Assessment', 'Air Purification', 'Surface Treatment', 'Verification'],
            },
            {
                name: 'Odor Elimination',
                description: 'Advanced odor elimination services using ozone treatment and thermal fogging to permanently remove smoke smells.',
                icon: '🌬️',
                features: ['Ozone Treatment', 'Thermal Fogging', 'Hydroxyl Generators', 'Guaranteed Results'],
                process: ['Source Identification', 'Treatment Application', 'Air Circulation', 'Final Testing'],
            },
        ],
    },
    {
        id: 'mold-remediation',
        name: 'Mold Remediation',
        icon: '🦠',
        description: 'Professional mold inspection, testing, and removal services',
        schemaType: 'HomeAndConstructionBusiness',
        keywords: ['mold removal', 'mold remediation', 'mold testing', 'black mold', 'mold inspection'],
        faqTopics: ['How dangerous is mold?', 'Mold remediation cost', 'Signs of mold in your home', 'Mold prevention tips'],
        images: IMAGES.restoration,
        defaultServices: [
            {
                name: 'Mold Inspection',
                description: 'Comprehensive mold inspection and testing services. We identify mold types, extent of contamination, and source of moisture.',
                icon: '🔬',
                features: ['Visual Inspection', 'Air Quality Testing', 'Surface Sampling', 'Detailed Reports'],
                process: ['Initial Consultation', 'Property Inspection', 'Sample Collection', 'Lab Analysis', 'Report Delivery'],
            },
            {
                name: 'Mold Removal',
                description: 'Safe and effective mold removal using industry-approved methods. Our certified technicians follow strict containment protocols.',
                icon: '🦠',
                features: ['Containment Setup', 'HEPA Filtration', 'Safe Removal', 'Disposal'],
                process: ['Containment', 'Air Filtration', 'Removal', 'Cleaning', 'Verification'],
            },
            {
                name: 'Mold Prevention',
                description: 'Preventive treatments and recommendations to stop mold from returning. We address the root cause of moisture problems.',
                icon: '🛡️',
                features: ['Moisture Control', 'Ventilation Solutions', 'Antimicrobial Treatment', 'Maintenance Plans'],
                process: ['Assessment', 'Recommendation', 'Treatment', 'Follow-Up'],
            },
        ],
    },
    {
        id: 'plumbing',
        name: 'Plumbing',
        icon: '🔧',
        description: 'Complete plumbing services for residential and commercial properties',
        schemaType: 'Plumber',
        keywords: ['plumber', 'plumbing repair', 'drain cleaning', 'water heater', 'pipe repair', 'leak detection'],
        faqTopics: ['Emergency plumbing services', 'Water heater lifespan', 'Signs of a plumbing leak', 'Drain cleaning frequency'],
        images: IMAGES.plumbing,
        defaultServices: [
            {
                name: 'Drain Cleaning',
                description: 'Professional drain cleaning services to clear clogs, remove buildup, and restore proper flow. We handle all drain types.',
                icon: '🚿',
                features: ['Hydro Jetting', 'Snake/Auger Service', 'Video Inspection', 'Preventive Maintenance'],
                process: ['Inspection', 'Method Selection', 'Cleaning', 'Testing', 'Recommendations'],
            },
            {
                name: 'Water Heater Services',
                description: 'Complete water heater installation, repair, and maintenance for tank and tankless systems.',
                icon: '🔥',
                features: ['Installation', 'Repairs', 'Maintenance', 'Tankless Conversion'],
                process: ['Assessment', 'Recommendation', 'Installation/Repair', 'Testing', 'Warranty'],
            },
            {
                name: 'Leak Detection & Repair',
                description: 'Advanced leak detection services using electronic equipment to find hidden leaks without damaging your property.',
                icon: '💧',
                features: ['Electronic Detection', 'Non-Invasive Methods', 'Pipe Repair', 'Prevention'],
                process: ['Detection', 'Location', 'Repair Plan', 'Repair', 'Verification'],
            },
            {
                name: 'Pipe Repair & Replacement',
                description: 'Expert pipe repair and repiping services. We handle all pipe materials including copper, PEX, and PVC.',
                icon: '🔩',
                features: ['Pipe Repair', 'Repiping', 'Trenchless Options', 'All Materials'],
                process: ['Inspection', 'Options', 'Repair/Replace', 'Testing', 'Cleanup'],
            },
            {
                name: 'Sewer Line Services',
                description: 'Complete sewer line inspection, repair, and replacement services using the latest technology.',
                icon: '🏗️',
                features: ['Video Inspection', 'Hydro Jetting', 'Trenchless Repair', 'Line Replacement'],
                process: ['Video Inspection', 'Diagnosis', 'Repair Method', 'Completion', 'Warranty'],
            },
        ],
    },
    {
        id: 'hvac',
        name: 'HVAC',
        icon: '❄️',
        description: 'Heating, ventilation, and air conditioning services',
        schemaType: 'HVACBusiness',
        keywords: ['hvac', 'air conditioning', 'heating', 'furnace repair', 'ac installation', 'hvac maintenance'],
        faqTopics: ['AC maintenance frequency', 'Signs you need a new HVAC', 'Energy efficient HVAC', 'HVAC filter replacement'],
        images: IMAGES.hvac,
        defaultServices: [
            {
                name: 'AC Repair & Installation',
                description: 'Expert air conditioning repair and installation services. We work with all major brands and offer 24/7 emergency service.',
                icon: '❄️',
                features: ['All Brands', '24/7 Service', 'Energy Efficient Options', 'Financing Available'],
                process: ['Diagnosis', 'Quote', 'Repair/Install', 'Testing', 'Warranty'],
            },
            {
                name: 'Heating Services',
                description: 'Complete heating system installation, repair, and maintenance for furnaces, heat pumps, and boilers.',
                icon: '🔥',
                features: ['Furnace Repair', 'Heat Pumps', 'Boilers', 'Maintenance Plans'],
                process: ['Inspection', 'Diagnosis', 'Repair/Replace', 'Testing', 'Follow-Up'],
            },
            {
                name: 'HVAC Maintenance',
                description: 'Preventive HVAC maintenance to extend equipment life, improve efficiency, and prevent breakdowns.',
                icon: '🔧',
                features: ['Seasonal Tune-Ups', 'Filter Changes', 'Efficiency Testing', 'Priority Service'],
                process: ['Inspection', 'Cleaning', 'Adjustments', 'Report', 'Recommendations'],
            },
            {
                name: 'Indoor Air Quality',
                description: 'Improve your indoor air quality with air purifiers, humidifiers, and duct cleaning services.',
                icon: '🌬️',
                features: ['Air Purifiers', 'Humidifiers', 'Duct Cleaning', 'UV Systems'],
                process: ['Air Quality Test', 'Recommendation', 'Installation', 'Verification'],
            },
        ],
    },
    {
        id: 'roofing',
        name: 'Roofing',
        icon: '🏠',
        description: 'Professional roofing installation, repair, and maintenance',
        schemaType: 'RoofingContractor',
        keywords: ['roofing', 'roof repair', 'roof replacement', 'roof installation', 'roofing contractor', 'shingle repair'],
        faqTopics: ['How long does a roof last?', 'Signs you need a new roof', 'Roof repair vs replacement', 'Roofing materials comparison'],
        images: IMAGES.roofing,
        defaultServices: [
            {
                name: 'Roof Repair',
                description: 'Fast and reliable roof repair services for leaks, storm damage, and general wear. We repair all roof types.',
                icon: '🔨',
                features: ['Leak Repair', 'Storm Damage', 'Shingle Replacement', 'Flashing Repair'],
                process: ['Inspection', 'Assessment', 'Repair', 'Cleanup', 'Warranty'],
            },
            {
                name: 'Roof Replacement',
                description: 'Complete roof replacement with quality materials and expert installation. Multiple options available.',
                icon: '🏠',
                features: ['All Materials', 'Warranty Options', 'Insurance Assistance', 'Financing'],
                process: ['Inspection', 'Estimate', 'Material Selection', 'Installation', 'Final Inspection'],
            },
            {
                name: 'Roof Inspection',
                description: 'Comprehensive roof inspection to identify problems before they become expensive repairs.',
                icon: '🔍',
                features: ['Detailed Reports', 'Photo Documentation', 'Recommendations', 'Free Estimates'],
                process: ['Exterior Check', 'Interior Check', 'Documentation', 'Report'],
            },
            {
                name: 'Gutter Services',
                description: 'Gutter installation, repair, and cleaning to protect your home from water damage.',
                icon: '🔧',
                features: ['Installation', 'Repair', 'Cleaning', 'Guards'],
                process: ['Assessment', 'Quote', 'Service', 'Testing'],
            },
        ],
    },
    {
        id: 'electrical',
        name: 'Electrical',
        icon: '⚡',
        description: 'Licensed electrical services for homes and businesses',
        schemaType: 'Electrician',
        keywords: ['electrician', 'electrical repair', 'wiring', 'panel upgrade', 'lighting installation'],
        faqTopics: ['Signs of electrical problems', 'When to upgrade electrical panel', 'Electrical safety tips'],
        images: IMAGES.electrical,
        defaultServices: [
            {
                name: 'Electrical Repair',
                description: 'Expert electrical repair services for outlets, switches, wiring, and more. Licensed and insured electricians.',
                icon: '⚡',
                features: ['Troubleshooting', 'Outlet Repair', 'Switch Repair', 'Safety Inspection'],
                process: ['Diagnosis', 'Quote', 'Repair', 'Testing', 'Documentation'],
            },
            {
                name: 'Panel Upgrades',
                description: 'Electrical panel upgrades to support modern electrical demands and improve safety.',
                icon: '🔌',
                features: ['Capacity Increase', 'Safety Upgrade', 'Code Compliance', 'Permit Handling'],
                process: ['Assessment', 'Permit', 'Installation', 'Inspection', 'Documentation'],
            },
            {
                name: 'Lighting Installation',
                description: 'Professional lighting installation including recessed, outdoor, and smart lighting systems.',
                icon: '💡',
                features: ['Indoor Lighting', 'Outdoor Lighting', 'Smart Systems', 'LED Upgrades'],
                process: ['Design Consultation', 'Material Selection', 'Installation', 'Testing'],
            },
            {
                name: 'Whole Home Rewiring',
                description: 'Complete rewiring services for older homes to meet modern safety standards and electrical needs.',
                icon: '🏠',
                features: ['Safety Upgrade', 'Code Compliance', 'Increased Capacity', 'Future-Proofing'],
                process: ['Assessment', 'Planning', 'Rewiring', 'Testing', 'Inspection'],
            },
        ],
    },
    {
        id: 'landscaping',
        name: 'Landscaping',
        icon: '🌳',
        description: 'Professional landscaping and lawn care services',
        schemaType: 'LandscapingBusiness',
        keywords: ['landscaping', 'lawn care', 'tree service', 'garden design', 'hardscaping', 'irrigation'],
        faqTopics: ['Lawn care schedule', 'Best plants for your area', 'Landscaping cost', 'Irrigation system benefits'],
        images: IMAGES.landscaping,
        defaultServices: [
            {
                name: 'Landscape Design',
                description: 'Custom landscape design to transform your outdoor space. From concept to completion.',
                icon: '🎨',
                features: ['3D Design', 'Plant Selection', 'Hardscape Design', 'Irrigation Planning'],
                process: ['Consultation', 'Design', 'Proposal', 'Installation', 'Maintenance Plan'],
            },
            {
                name: 'Lawn Care',
                description: 'Complete lawn care services including mowing, fertilization, weed control, and aeration.',
                icon: '🌿',
                features: ['Mowing', 'Fertilization', 'Weed Control', 'Aeration'],
                process: ['Assessment', 'Program Design', 'Regular Service', 'Monitoring'],
            },
            {
                name: 'Tree Services',
                description: 'Professional tree trimming, removal, and stump grinding by certified arborists.',
                icon: '🌲',
                features: ['Trimming', 'Removal', 'Stump Grinding', 'Health Assessment'],
                process: ['Assessment', 'Quote', 'Service', 'Cleanup'],
            },
            {
                name: 'Irrigation Systems',
                description: 'Sprinkler system installation, repair, and maintenance for efficient watering.',
                icon: '💦',
                features: ['Installation', 'Repair', 'Smart Controllers', 'Winterization'],
                process: ['Design', 'Installation', 'Programming', 'Training'],
            },
        ],
    },
    {
        id: 'cleaning',
        name: 'Cleaning Services',
        icon: '✨',
        description: 'Professional cleaning services for homes and businesses',
        schemaType: 'HousekeepingService',
        keywords: ['cleaning service', 'house cleaning', 'commercial cleaning', 'deep cleaning', 'move out cleaning'],
        faqTopics: ['Cleaning frequency', 'What to expect from cleaning service', 'Deep cleaning vs regular cleaning'],
        images: IMAGES.cleaning,
        defaultServices: [
            {
                name: 'Residential Cleaning',
                description: 'Regular house cleaning services to keep your home spotless. Customized to your needs.',
                icon: '🏠',
                features: ['Weekly/Bi-Weekly', 'Customized Plans', 'Trusted Cleaners', 'Satisfaction Guaranteed'],
                process: ['Consultation', 'Quote', 'Scheduling', 'Service', 'Follow-Up'],
            },
            {
                name: 'Deep Cleaning',
                description: 'Thorough deep cleaning that reaches every corner. Perfect for spring cleaning or special occasions.',
                icon: '🧹',
                features: ['Top to Bottom', 'Behind Appliances', 'Inside Cabinets', 'Baseboards'],
                process: ['Assessment', 'Prep', 'Deep Clean', 'Final Walk-Through'],
            },
            {
                name: 'Move In/Out Cleaning',
                description: 'Complete move-in or move-out cleaning to ensure you get your deposit back or start fresh.',
                icon: '📦',
                features: ['Deposit Guarantee', 'All Surfaces', 'Appliances', 'Windows'],
                process: ['Scheduling', 'Full Clean', 'Inspection', 'Touch-ups'],
            },
            {
                name: 'Commercial Cleaning',
                description: 'Professional commercial cleaning for offices, retail, and industrial spaces.',
                icon: '🏢',
                features: ['After Hours', 'Daily/Weekly', 'Customized', 'Insured'],
                process: ['Consultation', 'Proposal', 'Service', 'Quality Check'],
            },
        ],
    },
    {
        id: 'pest-control',
        name: 'Pest Control',
        icon: '🐜',
        description: 'Professional pest control and extermination services',
        schemaType: 'HomeAndConstructionBusiness',
        keywords: ['pest control', 'exterminator', 'termite treatment', 'rodent control', 'bed bugs'],
        faqTopics: ['Signs of pest infestation', 'Pest prevention tips', 'Is pest control safe for pets?'],
        images: IMAGES.pest,
        defaultServices: [
            {
                name: 'General Pest Control',
                description: 'Comprehensive pest control for common household pests including ants, roaches, spiders, and more.',
                icon: '🐜',
                features: ['Initial Treatment', 'Quarterly Service', 'Indoor/Outdoor', 'Pet Safe'],
                process: ['Inspection', 'Treatment Plan', 'Initial Service', 'Follow-Up'],
            },
            {
                name: 'Termite Treatment',
                description: 'Effective termite treatment and prevention to protect your largest investment.',
                icon: '🪲',
                features: ['Inspection', 'Treatment', 'Monitoring', 'Warranty'],
                process: ['Inspection', 'Assessment', 'Treatment', 'Monitoring', 'Annual Inspection'],
            },
            {
                name: 'Rodent Control',
                description: 'Humane and effective rodent control including mice, rats, and other wildlife.',
                icon: '🐭',
                features: ['Exclusion', 'Trapping', 'Removal', 'Prevention'],
                process: ['Inspection', 'Exclusion', 'Removal', 'Seal Entry Points'],
            },
            {
                name: 'Bed Bug Treatment',
                description: 'Specialized bed bug treatment using heat and chemical methods for complete elimination.',
                icon: '🛏️',
                features: ['Heat Treatment', 'Chemical Treatment', 'Inspection', 'Follow-Up'],
                process: ['Inspection', 'Preparation', 'Treatment', 'Verification'],
            },
        ],
    },
    {
        id: 'garage-door',
        name: 'Garage Door',
        icon: '🚗',
        description: 'Garage door installation, repair, and maintenance',
        schemaType: 'HomeAndConstructionBusiness',
        keywords: ['garage door repair', 'garage door installation', 'garage door opener', 'spring repair'],
        faqTopics: ['Garage door maintenance tips', 'When to replace garage door', 'Garage door safety'],
        images: IMAGES.default,
        defaultServices: [
            {
                name: 'Garage Door Repair',
                description: 'Fast garage door repair for springs, cables, openers, and panels. Same-day service available.',
                icon: '🔧',
                features: ['Spring Repair', 'Cable Repair', 'Opener Repair', 'Panel Replacement'],
                process: ['Diagnosis', 'Quote', 'Repair', 'Testing', 'Safety Check'],
            },
            {
                name: 'Garage Door Installation',
                description: 'New garage door installation with a variety of styles and materials to choose from.',
                icon: '🚗',
                features: ['Multiple Styles', 'Insulated Options', 'Opener Included', 'Warranty'],
                process: ['Measurement', 'Selection', 'Removal', 'Installation', 'Testing'],
            },
            {
                name: 'Opener Services',
                description: 'Garage door opener installation, repair, and smart home integration.',
                icon: '📱',
                features: ['Installation', 'Repair', 'Smart Features', 'Battery Backup'],
                process: ['Assessment', 'Selection', 'Installation', 'Programming'],
            },
        ],
    },
    {
        id: 'locksmith',
        name: 'Locksmith',
        icon: '🔑',
        description: 'Professional locksmith services for homes, autos, and businesses',
        schemaType: 'Locksmith',
        keywords: ['locksmith', 'lock repair', 'key replacement', 'lockout service', 'lock installation'],
        faqTopics: ['Locked out of car', 'When to rekey locks', 'Smart lock installation'],
        images: IMAGES.default,
        defaultServices: [
            {
                name: 'Emergency Lockout',
                description: '24/7 emergency lockout service for homes, cars, and businesses. Fast response times.',
                icon: '🚨',
                features: ['24/7 Service', 'Fast Response', 'All Lock Types', 'Damage-Free Entry'],
                process: ['Call', 'Dispatch', 'Arrival', 'Entry', 'Verification'],
            },
            {
                name: 'Lock Installation',
                description: 'Professional lock installation and upgrade services for enhanced security.',
                icon: '🔒',
                features: ['Smart Locks', 'High Security', 'Deadbolts', 'Keyless Entry'],
                process: ['Consultation', 'Selection', 'Installation', 'Programming'],
            },
            {
                name: 'Rekeying Services',
                description: 'Rekey your locks for a fresh start. Perfect for new homeowners or after losing keys.',
                icon: '🔑',
                features: ['Same Day', 'All Locks', 'Master Key', 'Key Copies'],
                process: ['Assessment', 'Rekeying', 'New Keys', 'Testing'],
            },
        ],
    },
    // === PROFESSIONAL SERVICES ===
    {
        id: 'personal-injury',
        name: 'Personal Injury Law',
        icon: '⚖️',
        description: 'Personal injury attorneys fighting for maximum compensation',
        schemaType: 'Attorney',
        keywords: ['personal injury lawyer', 'accident attorney', 'injury claim', 'car accident lawyer'],
        faqTopics: ['How much is my case worth?', 'How long does a personal injury case take?', 'What if I cant afford a lawyer?'],
        images: IMAGES.legal,
        defaultServices: [
            {
                name: 'Car Accident Claims',
                description: 'Experienced car accident attorneys fighting for the compensation you deserve. No fee unless we win.',
                icon: '🚗',
                features: ['Free Consultation', 'No Win No Fee', 'Maximum Compensation', 'Insurance Negotiations'],
                process: ['Free Consultation', 'Investigation', 'Claim Filing', 'Negotiation', 'Resolution'],
            },
            {
                name: 'Slip & Fall Cases',
                description: 'Premises liability experts handling slip and fall injuries. We hold property owners accountable.',
                icon: '⚠️',
                features: ['Investigation', 'Evidence Gathering', 'Expert Witnesses', 'Trial Ready'],
                process: ['Case Review', 'Investigation', 'Filing', 'Discovery', 'Settlement/Trial'],
            },
            {
                name: 'Medical Malpractice',
                description: 'Medical malpractice attorneys with the resources to take on hospitals and insurance companies.',
                icon: '🏥',
                features: ['Medical Experts', 'Thorough Investigation', 'Maximum Recovery', 'Trial Experience'],
                process: ['Case Evaluation', 'Medical Review', 'Expert Consultation', 'Filing', 'Litigation'],
            },
        ],
    },
    {
        id: 'family-law',
        name: 'Family Law',
        icon: '👨‍👩‍👧‍👦',
        description: 'Compassionate family law attorneys for divorce, custody, and more',
        schemaType: 'Attorney',
        keywords: ['family lawyer', 'divorce attorney', 'child custody', 'alimony', 'family court'],
        faqTopics: ['How long does divorce take?', 'Child custody factors', 'Alimony calculation'],
        images: IMAGES.legal,
        defaultServices: [
            {
                name: 'Divorce',
                description: 'Experienced divorce attorneys guiding you through this difficult time with compassion and skill.',
                icon: '📋',
                features: ['Asset Division', 'Debt Allocation', 'Mediation', 'Litigation'],
                process: ['Consultation', 'Filing', 'Discovery', 'Negotiation', 'Finalization'],
            },
            {
                name: 'Child Custody',
                description: 'Child custody attorneys focused on the best interests of your children.',
                icon: '👶',
                features: ['Custody Plans', 'Visitation', 'Modifications', 'Enforcement'],
                process: ['Assessment', 'Proposal', 'Negotiation', 'Court Approval'],
            },
            {
                name: 'Child Support',
                description: 'Child support calculation and enforcement to ensure your children are provided for.',
                icon: '💰',
                features: ['Calculation', 'Modification', 'Enforcement', 'Arrears'],
                process: ['Financial Review', 'Calculation', 'Filing', 'Enforcement'],
            },
        ],
    },
    {
        id: 'dental',
        name: 'Dental',
        icon: '🦷',
        description: 'Comprehensive dental care for the whole family',
        schemaType: 'Dentist',
        keywords: ['dentist', 'dental care', 'teeth cleaning', 'dental implants', 'cosmetic dentistry'],
        faqTopics: ['How often should I see a dentist?', 'Dental implant process', 'Teeth whitening options'],
        images: IMAGES.dental,
        defaultServices: [
            {
                name: 'General Dentistry',
                description: 'Comprehensive dental exams, cleanings, and preventive care for healthy smiles.',
                icon: '🦷',
                features: ['Exams', 'Cleanings', 'X-Rays', 'Fillings'],
                process: ['Check-In', 'Exam', 'Cleaning', 'Treatment', 'Follow-Up'],
            },
            {
                name: 'Cosmetic Dentistry',
                description: 'Transform your smile with veneers, whitening, and cosmetic bonding.',
                icon: '✨',
                features: ['Veneers', 'Whitening', 'Bonding', 'Smile Design'],
                process: ['Consultation', 'Planning', 'Treatment', 'Follow-Up'],
            },
            {
                name: 'Dental Implants',
                description: 'Permanent tooth replacement with dental implants. Natural look and feel.',
                icon: '🔩',
                features: ['Single Implants', 'Implant Bridges', 'All-on-4', '3D Planning'],
                process: ['Consultation', 'Planning', 'Surgery', 'Healing', 'Restoration'],
            },
            {
                name: 'Emergency Dental',
                description: 'Same-day emergency dental care for toothaches, broken teeth, and dental injuries.',
                icon: '🚨',
                features: ['Same Day', 'Pain Relief', 'Trauma Care', 'After Hours'],
                process: ['Call', 'Assessment', 'Treatment', 'Follow-Up'],
            },
        ],
    },
    {
        id: 'chiropractic',
        name: 'Chiropractic',
        icon: '🦴',
        description: 'Chiropractic care for pain relief and wellness',
        schemaType: 'Chiropractor',
        keywords: ['chiropractor', 'back pain', 'neck pain', 'spinal adjustment', 'chiropractic care'],
        faqTopics: ['Is chiropractic safe?', 'How often should I see a chiropractor?', 'Benefits of chiropractic'],
        images: IMAGES.default,
        defaultServices: [
            {
                name: 'Spinal Adjustment',
                description: 'Precise spinal adjustments to relieve pain, improve mobility, and optimize nervous system function.',
                icon: '🦴',
                features: ['Pain Relief', 'Improved Mobility', 'Natural Healing', 'Preventive Care'],
                process: ['Exam', 'X-Rays', 'Adjustment', 'Follow-Up'],
            },
            {
                name: 'Auto Accident Injury',
                description: 'Specialized care for auto accident injuries including whiplash and soft tissue damage.',
                icon: '🚗',
                features: ['Whiplash Treatment', 'Documentation', 'Personal Injury Support', 'Payment Plans'],
                process: ['Evaluation', 'Treatment Plan', 'Treatment', 'Progress Monitoring'],
            },
            {
                name: 'Sports Injury',
                description: 'Sports chiropractic to treat injuries and enhance athletic performance.',
                icon: '⚽',
                features: ['Injury Treatment', 'Performance Enhancement', 'Prevention', 'Rehabilitation'],
                process: ['Assessment', 'Treatment', 'Rehabilitation', 'Prevention Plan'],
            },
        ],
    },
    {
        id: 'auto-repair',
        name: 'Auto Repair',
        icon: '🚗',
        description: 'Complete auto repair and maintenance services',
        schemaType: 'AutoRepair',
        keywords: ['auto repair', 'car repair', 'mechanic', 'oil change', 'brake repair', 'transmission'],
        faqTopics: ['How often should I change my oil?', 'Signs of brake problems', 'Check engine light meaning'],
        images: IMAGES.automotive,
        defaultServices: [
            {
                name: 'General Repair',
                description: 'Comprehensive auto repair for all makes and models. Factory-trained technicians.',
                icon: '🔧',
                features: ['All Makes/Models', 'Diagnostics', 'Warranty Work', 'Loaner Cars'],
                process: ['Drop Off', 'Diagnosis', 'Approval', 'Repair', 'Quality Check'],
            },
            {
                name: 'Brake Service',
                description: 'Complete brake system inspection, repair, and replacement. Safety is our priority.',
                icon: '🛑',
                features: ['Inspection', 'Pad Replacement', 'Rotor Service', 'Fluid Flush'],
                process: ['Inspection', 'Quote', 'Service', 'Testing', 'Warranty'],
            },
            {
                name: 'Oil Change',
                description: 'Quick and professional oil change with multi-point inspection.',
                icon: '🛢️',
                features: ['Conventional', 'Synthetic', 'High Mileage', 'Diesel'],
                process: ['Check In', 'Service', 'Inspection', 'Check Out'],
            },
            {
                name: 'Transmission Service',
                description: 'Transmission repair, rebuild, and replacement by certified specialists.',
                icon: '⚙️',
                features: ['Diagnosis', 'Repair', 'Rebuild', 'Replacement'],
                process: ['Diagnosis', 'Estimate', 'Approval', 'Service', 'Warranty'],
            },
        ],
    },
    {
        id: 'real-estate',
        name: 'Real Estate',
        icon: '🏠',
        description: 'Real estate agents helping you buy, sell, or invest',
        schemaType: 'RealEstateAgent',
        keywords: ['real estate agent', 'realtor', 'homes for sale', 'buy house', 'sell house'],
        faqTopics: ['How to choose a real estate agent', 'Home buying process', 'Selling your home tips'],
        images: IMAGES.realestate,
        defaultServices: [
            {
                name: 'Buyer Representation',
                description: 'Expert buyer representation to find your perfect home at the best price.',
                icon: '🏡',
                features: ['Home Search', 'Negotiations', 'Inspections', 'Closing Support'],
                process: ['Consultation', 'Pre-Approval', 'Home Search', 'Offer', 'Closing'],
            },
            {
                name: 'Seller Representation',
                description: 'Full-service listing to sell your home for top dollar in minimum time.',
                icon: '📋',
                features: ['Market Analysis', 'Staging', 'Marketing', 'Negotiations'],
                process: ['Evaluation', 'Preparation', 'Listing', 'Showings', 'Closing'],
            },
            {
                name: 'Investment Properties',
                description: 'Investment property expertise to build your real estate portfolio.',
                icon: '📈',
                features: ['Market Analysis', 'ROI Analysis', 'Property Management', 'Portfolio Strategy'],
                process: ['Consultation', 'Search', 'Analysis', 'Acquisition', 'Management'],
            },
        ],
    },
];

// Helper function to get category by ID
export function getIndustryCategory(id: string): IndustryCategory | undefined {
    return INDUSTRY_CATEGORIES.find(cat => cat.id === id);
}

// Helper function to get images for a category
// Supports exact match and partial matching for industry IDs
export function getCategoryImages(categoryId: string): CategoryImages {
    // First try exact match on INDUSTRY_CATEGORIES
    const category = getIndustryCategory(categoryId);
    if (category?.images) {
        return category.images;
    }

    // Try direct lookup in IMAGES object
    const imagesKey = categoryId as keyof typeof IMAGES;
    if (IMAGES[imagesKey]) {
        return IMAGES[imagesKey];
    }

    // Try partial matching - look for keyword in category ID
    const keywords = categoryId.toLowerCase().split('-');
    for (const keyword of keywords) {
        // Check if any IMAGES key contains this keyword
        const matchingKey = Object.keys(IMAGES).find(key =>
            keyword.includes(key) || key.includes(keyword)
        ) as keyof typeof IMAGES | undefined;

        if (matchingKey && IMAGES[matchingKey]) {
            return IMAGES[matchingKey];
        }
    }

    // Fall back to default
    return IMAGES.default;
}

// Get all industry IDs for dropdown
export function getIndustryOptions(): { value: string; label: string; icon: string }[] {
    return INDUSTRY_CATEGORIES.map(cat => ({
        value: cat.id,
        label: cat.name,
        icon: cat.icon,
    }));
}

// Get default services for an industry
export function getDefaultServices(industryId: string): ServiceTemplate[] {
    const category = getIndustryCategory(industryId);
    return category?.defaultServices || [];
}
