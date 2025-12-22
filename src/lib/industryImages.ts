// Industry-specific images for website generation
// High-quality, relevant images from Unsplash for each niche

export interface IndustryImages {
    hero: string;           // Main hero background/image
    about: string;          // About section image
    services: string[];     // Array of service-related images
    team: string;           // Team/professional image
    gallery: string[];      // Gallery images
    testimonial: string;    // Testimonial background
    cta: string;            // Call-to-action section background
}

// Map of industry slugs to their relevant images
export const INDUSTRY_IMAGES: Record<string, IndustryImages> = {
    // Plumbing Services
    'plumbing': {
        hero: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=1200&h=600&fit=crop',
        about: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=400&fit=crop',
        services: [
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1535391441671-c002cdd1f29a?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=250&fit=crop',
        ],
        team: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=400&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop',
        ],
        testimonial: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&h=400&fit=crop',
        cta: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&h=400&fit=crop',
    },

    // Roofing Services
    'roofing': {
        hero: 'https://images.unsplash.com/photo-1632759145354-523f9c035a25?w=1200&h=600&fit=crop',
        about: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&h=400&fit=crop',
        services: [
            'https://images.unsplash.com/photo-1632759145354-523f9c035a25?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1635274605638-d44babc08a4f?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=400&h=250&fit=crop',
        ],
        team: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1632759145354-523f9c035a25?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1635274605638-d44babc08a4f?w=400&h=300&fit=crop',
        ],
        testimonial: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=400&fit=crop',
        cta: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=1200&h=400&fit=crop',
    },

    // HVAC Services
    'hvac': {
        hero: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1200&h=600&fit=crop',
        about: 'https://images.unsplash.com/photo-1562932831-afcfe48b5786?w=600&h=400&fit=crop',
        services: [
            'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1504280317859-9bbdf78fd507?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1621460248083-6271cc4437a8?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1625604276145-0c0539163d42?w=400&h=250&fit=crop',
        ],
        team: 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?w=600&h=400&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1562932831-afcfe48b5786?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1621460248083-6271cc4437a8?w=400&h=300&fit=crop',
        ],
        testimonial: 'https://images.unsplash.com/photo-1504280317859-9bbdf78fd507?w=1200&h=400&fit=crop',
        cta: 'https://images.unsplash.com/photo-1625604276145-0c0539163d42?w=1200&h=400&fit=crop',
    },

    // Electrical Services
    'electrical': {
        hero: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1200&h=600&fit=crop',
        about: 'https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?w=600&h=400&fit=crop',
        services: [
            'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1509390144018-eeaf65052242?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&h=250&fit=crop',
        ],
        team: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=600&h=400&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=400&h=300&fit=crop',
        ],
        testimonial: 'https://images.unsplash.com/photo-1509390144018-eeaf65052242?w=1200&h=400&fit=crop',
        cta: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&h=400&fit=crop',
    },

    // Water Damage / Restoration
    'water-damage': {
        hero: 'https://images.unsplash.com/photo-1583845112203-29329902332e?w=1200&h=600&fit=crop',
        about: 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?w=600&h=400&fit=crop',
        services: [
            'https://images.unsplash.com/photo-1583845112203-29329902332e?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1612630741022-b26cd03e7e70?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1519558260268-cde7e03a0152?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=250&fit=crop',
        ],
        team: 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?w=600&h=400&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1583845112203-29329902332e?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1612630741022-b26cd03e7e70?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1519558260268-cde7e03a0152?w=400&h=300&fit=crop',
        ],
        testimonial: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&h=400&fit=crop',
        cta: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&h=400&fit=crop',
    },

    'restoration': {
        hero: 'https://images.unsplash.com/photo-1583845112203-29329902332e?w=1200&h=600&fit=crop',
        about: 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?w=600&h=400&fit=crop',
        services: [
            'https://images.unsplash.com/photo-1583845112203-29329902332e?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1612630741022-b26cd03e7e70?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1519558260268-cde7e03a0152?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=250&fit=crop',
        ],
        team: 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?w=600&h=400&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1583845112203-29329902332e?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1612630741022-b26cd03e7e70?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1519558260268-cde7e03a0152?w=400&h=300&fit=crop',
        ],
        testimonial: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&h=400&fit=crop',
        cta: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&h=400&fit=crop',
    },

    // Landscaping
    'landscaping': {
        hero: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=1200&h=600&fit=crop',
        about: 'https://images.unsplash.com/photo-1600566752547-33b25f1d4be8?w=600&h=400&fit=crop',
        services: [
            'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1600566752547-33b25f1d4be8?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1600566752229-250ed79470f8?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1599629954294-14df9ec8dfe8?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1534534573898-db5148bc8b0c?w=400&h=250&fit=crop',
        ],
        team: 'https://images.unsplash.com/photo-1599629954294-14df9ec8dfe8?w=600&h=400&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1600566752547-33b25f1d4be8?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=300&fit=crop',
        ],
        testimonial: 'https://images.unsplash.com/photo-1600566752229-250ed79470f8?w=1200&h=400&fit=crop',
        cta: 'https://images.unsplash.com/photo-1534534573898-db5148bc8b0c?w=1200&h=400&fit=crop',
    },

    // Cleaning Services
    'cleaning': {
        hero: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=1200&h=600&fit=crop',
        about: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop',
        services: [
            'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1527515545081-5db817172677?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=250&fit=crop',
        ],
        team: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1527515545081-5db817172677?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
        ],
        testimonial: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=400&fit=crop',
        cta: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=400&fit=crop',
    },

    // Pest Control
    'pest-control': {
        hero: 'https://images.unsplash.com/photo-1611235062716-a83c71e16bb1?w=1200&h=600&fit=crop',
        about: 'https://images.unsplash.com/photo-1599629954294-14df9ec8dfe8?w=600&h=400&fit=crop',
        services: [
            'https://images.unsplash.com/photo-1611235062716-a83c71e16bb1?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=250&fit=crop',
        ],
        team: 'https://images.unsplash.com/photo-1599629954294-14df9ec8dfe8?w=600&h=400&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1611235062716-a83c71e16bb1?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
        ],
        testimonial: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=400&fit=crop',
        cta: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=400&fit=crop',
    },

    // Dental
    'dental': {
        hero: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&h=600&fit=crop',
        about: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&h=400&fit=crop',
        services: [
            'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1629909615957-be38d48fbbe4?w=400&h=250&fit=crop',
        ],
        team: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&h=400&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=300&fit=crop',
        ],
        testimonial: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&h=400&fit=crop',
        cta: 'https://images.unsplash.com/photo-1629909615957-be38d48fbbe4?w=1200&h=400&fit=crop',
    },

    // Medical/Healthcare
    'medical': {
        hero: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=600&fit=crop',
        about: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop',
        services: [
            'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=250&fit=crop',
        ],
        team: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&h=400&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&h=300&fit=crop',
        ],
        testimonial: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&h=400&fit=crop',
        cta: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=1200&h=400&fit=crop',
    },

    // Legal Services
    'legal': {
        hero: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=600&fit=crop',
        about: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?w=600&h=400&fit=crop',
        services: [
            'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1521791055366-0d553872125f?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1436450412740-6b988f486c6b?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?w=400&h=250&fit=crop',
        ],
        team: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=400&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1521791055366-0d553872125f?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop',
        ],
        testimonial: 'https://images.unsplash.com/photo-1436450412740-6b988f486c6b?w=1200&h=400&fit=crop',
        cta: 'https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?w=1200&h=400&fit=crop',
    },

    // Real Estate
    'realestate': {
        hero: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=600&fit=crop',
        about: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=600&h=400&fit=crop',
        services: [
            'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=250&fit=crop',
        ],
        team: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=400&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
        ],
        testimonial: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=400&fit=crop',
        cta: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=400&fit=crop',
    },

    // Automotive
    'automotive': {
        hero: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200&h=600&fit=crop',
        about: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop',
        services: [
            'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=250&fit=crop',
        ],
        team: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop',
        ],
        testimonial: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=400&fit=crop',
        cta: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=400&fit=crop',
    },

    // Restaurant/Food
    'restaurant': {
        hero: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=600&fit=crop',
        about: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=400&fit=crop',
        services: [
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=250&fit=crop',
        ],
        team: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=600&h=400&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
        ],
        testimonial: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&h=400&fit=crop',
        cta: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1200&h=400&fit=crop',
    },

    // Fitness/Gym
    'fitness': {
        hero: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=600&fit=crop',
        about: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
        services: [
            'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&h=250&fit=crop',
        ],
        team: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=400&h=300&fit=crop',
        ],
        testimonial: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&h=400&fit=crop',
        cta: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=1200&h=400&fit=crop',
    },

    // Construction
    'construction': {
        hero: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=600&fit=crop',
        about: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=400&fit=crop',
        services: [
            'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1541123603104-512919d6a96c?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=250&fit=crop',
        ],
        team: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1541123603104-512919d6a96c?w=400&h=300&fit=crop',
        ],
        testimonial: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=400&fit=crop',
        cta: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&h=400&fit=crop',
    },

    // Technology/IT
    'technology': {
        hero: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=600&fit=crop',
        about: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=400&fit=crop',
        services: [
            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=250&fit=crop',
        ],
        team: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop',
        ],
        testimonial: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=400&fit=crop',
        cta: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&h=400&fit=crop',
    },

    // Moving Services
    'moving': {
        hero: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&h=600&fit=crop',
        about: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
        services: [
            'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=250&fit=crop',
        ],
        team: 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?w=600&h=400&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
        ],
        testimonial: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&h=400&fit=crop',
        cta: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=400&fit=crop',
    },

    // Pool Service
    'pool-service': {
        hero: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=1200&h=600&fit=crop',
        about: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
        services: [
            'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1572331165267-854da2b021aa?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=250&fit=crop',
        ],
        team: 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?w=600&h=400&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1572331165267-854da2b021aa?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
        ],
        testimonial: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=400&fit=crop',
        cta: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=400&fit=crop',
    },

    // Salon/Beauty
    'salon': {
        hero: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&h=600&fit=crop',
        about: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop',
        services: [
            'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1562322140-8baeacacf1df?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=400&h=250&fit=crop',
        ],
        team: 'https://images.unsplash.com/photo-1562322140-8baeacacf1df?w=600&h=400&fit=crop',
        gallery: [
            'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&h=300&fit=crop',
        ],
        testimonial: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=1200&h=400&fit=crop',
        cta: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=1200&h=400&fit=crop',
    },
};

// Default fallback images for industries not specifically defined
const DEFAULT_IMAGES: IndustryImages = {
    hero: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=600&fit=crop',
    about: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop',
    services: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=250&fit=crop',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=250&fit=crop',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=250&fit=crop',
        'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=250&fit=crop',
        'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&h=250&fit=crop',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=250&fit=crop',
    ],
    team: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
    gallery: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
    ],
    testimonial: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&h=400&fit=crop',
    cta: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=400&fit=crop',
};

/**
 * Get images for a specific industry
 * Falls back to default images if industry not found
 */
export function getIndustryImages(industry: string): IndustryImages {
    // Try exact match first
    if (INDUSTRY_IMAGES[industry]) {
        return INDUSTRY_IMAGES[industry];
    }

    // Try partial matches for common variations
    const industryLower = industry.toLowerCase();

    // Map common variations to their canonical versions
    const industryMappings: Record<string, string> = {
        'plumber': 'plumbing',
        'plumbers': 'plumbing',
        'roofer': 'roofing',
        'roofers': 'roofing',
        'ac-repair': 'hvac',
        'heating-repair': 'hvac',
        'heating': 'hvac',
        'cooling': 'hvac',
        'air-conditioning': 'hvac',
        'electrician': 'electrical',
        'electricians': 'electrical',
        'water-damage-restoration': 'water-damage',
        'mold-removal': 'restoration',
        'fire-damage': 'restoration',
        'lawn-care': 'landscaping',
        'lawn': 'landscaping',
        'garden': 'landscaping',
        'tree-service': 'landscaping',
        'house-cleaning': 'cleaning',
        'office-cleaning': 'cleaning',
        'carpet-cleaning': 'cleaning',
        'pressure-washing': 'cleaning',
        'pest': 'pest-control',
        'exterminator': 'pest-control',
        'termite': 'pest-control',
        'dentist': 'dental',
        'dentistry': 'dental',
        'doctor': 'medical',
        'healthcare': 'medical',
        'clinic': 'medical',
        'chiropractic': 'medical',
        'physical-therapy': 'medical',
        'attorney': 'legal',
        'lawyer': 'legal',
        'law': 'legal',
        'personal-injury': 'legal',
        'family-law': 'legal',
        'real-estate': 'realestate',
        'realtor': 'realestate',
        'auto': 'automotive',
        'auto-repair': 'automotive',
        'car-repair': 'automotive',
        'mechanic': 'automotive',
        'car-detailing': 'automotive',
        'tire-shop': 'automotive',
        'towing': 'automotive',
        'cafe': 'restaurant',
        'food': 'restaurant',
        'catering': 'restaurant',
        'gym': 'fitness',
        'personal-trainer': 'fitness',
        'yoga': 'fitness',
        'general-contractor': 'construction',
        'contractor': 'construction',
        'remodeling': 'construction',
        'home-builder': 'construction',
        'kitchen-remodeling': 'construction',
        'bathroom-remodeling': 'construction',
        'basement-remodeling': 'construction',
        'deck-builder': 'construction',
        'concrete': 'construction',
        'drywall': 'construction',
        'flooring': 'construction',
        'it': 'technology',
        'tech': 'technology',
        'software': 'technology',
        'saas': 'technology',
        'movers': 'moving',
        'relocation': 'moving',
        'pool': 'pool-service',
        'pool-cleaning': 'pool-service',
        'beauty': 'salon',
        'spa': 'salon',
        'hair': 'salon',
        'nails': 'salon',
        'barber': 'salon',
    };

    // Check for mapped industry
    if (industryMappings[industryLower] && INDUSTRY_IMAGES[industryMappings[industryLower]]) {
        return INDUSTRY_IMAGES[industryMappings[industryLower]];
    }

    // Return default images
    return DEFAULT_IMAGES;
}

/**
 * Get a specific service image for an industry
 */
export function getServiceImage(industry: string, serviceIndex: number): string {
    const images = getIndustryImages(industry);
    const index = serviceIndex % images.services.length;
    return images.services[index];
}
