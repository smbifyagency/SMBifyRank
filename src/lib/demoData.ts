// Demo data for testing the AI Website Builder

import { Website } from './types';
import { generateId } from './storage';

export function generateDemoWebsite(): Website {
    const now = new Date().toISOString();
    const id = generateId();

    return {
        id,
        userId: 'demo-user',
        name: 'Acme Restoration Services',
        businessName: 'Acme Restoration Services',
        industry: 'restoration',
        services: [
            { id: generateId(), name: 'Water Damage Restoration', description: 'Fast response water damage restoration services', slug: 'water-damage-restoration', icon: '💧' },
            { id: generateId(), name: 'Fire Damage Restoration', description: 'Expert fire and smoke damage restoration', slug: 'fire-damage-restoration', icon: '🔥' },
            { id: generateId(), name: 'Mold Remediation', description: 'Professional mold inspection and remediation', slug: 'mold-remediation', icon: '🦠' },
            { id: generateId(), name: 'Storm Damage Repair', description: '24/7 emergency storm damage repair', slug: 'storm-damage-repair', icon: '⛈️' },
        ],
        locations: [
            { id: generateId(), city: 'Los Angeles', state: 'CA', slug: 'los-angeles', description: 'Serving Los Angeles and surrounding areas' },
            { id: generateId(), city: 'San Diego', state: 'CA', slug: 'san-diego', description: 'Professional restoration services in San Diego' },
            { id: generateId(), city: 'San Francisco', state: 'CA', slug: 'san-francisco', description: 'Bay Area restoration experts' },
        ],
        colors: {
            primary: '#2563eb',
            secondary: '#1e40af',
            accent: '#f59e0b',
            background: '#ffffff',
            text: '#1f2937',
        },
        goal: 'leads',
        keywords: ['water damage', 'restoration', 'fire damage', 'mold remediation', 'emergency services'],
        pages: [
            {
                id: generateId(),
                title: 'Home',
                slug: '',
                type: 'home',
                content: [
                    { id: generateId(), type: 'hero', content: { headline: 'Professional Restoration Services', subheadline: '24/7 Emergency Response', ctaText: 'Get Free Quote', ctaLink: '/contact' }, order: 0 },
                    { id: generateId(), type: 'services-grid', content: { title: 'Our Services' }, order: 1 },
                    { id: generateId(), type: 'cta', content: { title: 'Need Emergency Help?', description: 'We\'re available 24/7', buttonText: 'Call Now' }, order: 2 },
                ],
                seo: { title: 'Acme Restoration Services | Water, Fire, Mold Restoration', description: 'Professional restoration services for water damage, fire damage, and mold remediation.', keywords: ['restoration', 'water damage', 'fire damage'] },
                order: 0,
                isPublished: true,
            },
            {
                id: generateId(),
                title: 'About Us',
                slug: 'about',
                type: 'about',
                content: [
                    { id: generateId(), type: 'about-intro', content: { title: 'About Acme Restoration', description: 'With over 20 years of experience, we are your trusted restoration partner.' }, order: 0 },
                ],
                seo: { title: 'About Us | Acme Restoration', description: 'Learn about our experienced restoration team.', keywords: ['about', 'restoration company'] },
                order: 1,
                isPublished: true,
            },
            {
                id: generateId(),
                title: 'Services',
                slug: 'services',
                type: 'services',
                content: [
                    { id: generateId(), type: 'services-grid', content: { title: 'Our Services' }, order: 0 },
                ],
                seo: { title: 'Services | Acme Restoration', description: 'Full range of restoration services.', keywords: ['services', 'restoration'] },
                order: 2,
                isPublished: true,
            },
            {
                id: generateId(),
                title: 'Contact',
                slug: 'contact',
                type: 'contact',
                content: [
                    { id: generateId(), type: 'contact-form', content: { title: 'Contact Us' }, order: 0 },
                ],
                seo: { title: 'Contact | Acme Restoration', description: 'Get in touch for a free quote.', keywords: ['contact', 'quote'] },
                order: 3,
                isPublished: true,
            },
            {
                id: generateId(),
                title: 'Blog',
                slug: 'blog',
                type: 'blog',
                content: [
                    { id: generateId(), type: 'blog-list', content: { title: 'Latest Articles' }, order: 0 },
                ],
                seo: { title: 'Blog | Acme Restoration', description: 'Restoration tips and news.', keywords: ['blog', 'restoration'] },
                order: 4,
                isPublished: true,
            },
            {
                id: generateId(),
                title: 'Service Areas',
                slug: 'locations',
                type: 'locations',
                content: [
                    { id: generateId(), type: 'locations-list', content: { title: 'Areas We Serve' }, order: 0 },
                ],
                seo: { title: 'Service Areas | Acme Restoration', description: 'Serving Los Angeles, San Diego, San Francisco and surrounding areas.', keywords: ['service areas', 'locations'] },
                order: 5,
                isPublished: true,
            },
        ],
        blogPosts: [
            {
                id: generateId(),
                title: '5 Warning Signs of Water Damage in Your Home',
                slug: '5-signs-water-damage',
                content: `<h2>How to Spot Water Damage Early</h2>
<p>Water damage can be sneaky and cause major problems if left unchecked. Here are the 5 most common signs to watch for:</p>

<h3>1. Discoloration and Stains</h3>
<p>Yellow or brown stains on ceilings and walls often indicate water damage from above. These stains typically spread over time if the leak continues.</p>

<h3>2. Musty Odors</h3>
<p>A persistent musty smell, especially in basements or bathrooms, can indicate hidden moisture and potential mold growth.</p>

<h3>3. Warped or Buckled Flooring</h3>
<p>Hardwood floors that are warping, tiles that are loose, or laminate that's buckling are all signs of water damage beneath the surface.</p>

<h3>4. Peeling Paint or Wallpaper</h3>
<p>When paint starts bubbling or wallpaper peels away from the wall, moisture is often the culprit.</p>

<h3>5. Increased Water Bills</h3>
<p>A sudden spike in your water bill without increased usage could indicate a hidden leak.</p>

<h2>What to Do Next</h2>
<p>If you notice any of these signs, <a href="/contact">contact us immediately</a> for a free inspection. Early detection can save you thousands in repairs.</p>`,
                excerpt: 'Learn to identify water damage before it becomes a major problem with these 5 warning signs.',
                author: 'Acme Restoration Team',
                featuredImage: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800',
                publishedAt: now,
                updatedAt: now,
                status: 'published',
                tags: ['water damage', 'tips', 'home maintenance'],
                seo: { title: '5 Warning Signs of Water Damage in Your Home', description: 'Learn to identify water damage early with these 5 warning signs. Protect your home from costly repairs.', keywords: ['water damage', 'signs', 'home'] },
            },
            {
                id: generateId(),
                title: 'What to Do Immediately After a House Fire',
                slug: 'what-to-do-after-fire',
                content: `<h2>Steps to Take After a Fire</h2>
<p>Experiencing a house fire is traumatic. Here's a comprehensive guide on what to do in the aftermath to ensure safety and begin recovery.</p>

<h3>1. Ensure Everyone's Safety</h3>
<p>Do not re-enter the building until fire officials have declared it safe. Check that all family members and pets are accounted for.</p>

<h3>2. Contact Your Insurance Company</h3>
<p>Notify your homeowner's insurance as soon as possible. Document everything with photos and videos before cleanup begins.</p>

<h3>3. Secure Your Property</h3>
<p>If your home is exposed, contact a board-up service to prevent further damage from weather or theft.</p>

<h3>4. Document All Damage</h3>
<ul>
    <li>Take photographs of all damage</li>
    <li>Make a list of damaged or destroyed items</li>
    <li>Keep all receipts for emergency expenses</li>
    <li>Do not throw anything away until insurance adjustor approves</li>
</ul>

<h3>5. Call Professional Restoration Services</h3>
<p>Fire damage restoration requires specialized equipment and expertise. <a href="/contact">Contact our 24/7 emergency team</a> for immediate assistance.</p>`,
                excerpt: 'Essential steps to take immediately after experiencing a fire to ensure safety and begin recovery.',
                author: 'Acme Restoration Team',
                featuredImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
                publishedAt: now,
                updatedAt: now,
                status: 'published',
                tags: ['fire damage', 'emergency', 'recovery'],
                seo: { title: 'What to Do Immediately After a House Fire', description: 'A comprehensive guide on what to do after a house fire. Learn the essential steps for safety and recovery.', keywords: ['fire', 'recovery', 'emergency'] },
            },
            {
                id: generateId(),
                title: 'The Complete Guide to Mold Prevention',
                slug: 'complete-guide-mold-prevention',
                content: `<h2>Preventing Mold in Your Home</h2>
<p>Mold can cause serious health problems and property damage. Prevention is always easier and cheaper than remediation.</p>

<h3>Understanding Mold Growth</h3>
<p>Mold needs three things to grow: moisture, organic material, and warmth. By controlling moisture, you can prevent most mold problems.</p>

<h3>Top Prevention Strategies</h3>

<h4>Control Humidity</h4>
<p>Keep indoor humidity below 60% (ideally 30-50%). Use dehumidifiers in basements and other damp areas.</p>

<h4>Fix Leaks Immediately</h4>
<p>Any water leak, no matter how small, can lead to mold growth within 24-48 hours. Repair plumbing issues promptly.</p>

<h4>Improve Ventilation</h4>
<ul>
    <li>Use exhaust fans in bathrooms and kitchens</li>
    <li>Open windows when weather permits</li>
    <li>Ensure dryers vent to the outside</li>
    <li>Keep air circulating in closets and storage areas</li>
</ul>

<h4>Regular Inspections</h4>
<p>Check areas prone to moisture regularly: under sinks, around windows, in attics, and basements.</p>

<h3>When to Call Professionals</h3>
<p>If you discover mold covering more than 10 square feet, or if you smell mold but can't find it, <a href="/services/mold-remediation">contact our mold remediation experts</a>.</p>`,
                excerpt: 'Learn how to prevent mold growth in your home with these proven strategies and tips.',
                author: 'Acme Restoration Team',
                featuredImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800',
                publishedAt: now,
                updatedAt: now,
                status: 'published',
                tags: ['mold', 'prevention', 'health'],
                seo: { title: 'Complete Guide to Mold Prevention in Your Home', description: 'Learn proven strategies to prevent mold growth and protect your family\'s health.', keywords: ['mold prevention', 'home tips'] },
            },
            {
                id: generateId(),
                title: 'How to Prepare Your Home for Storm Season',
                slug: 'prepare-home-storm-season',
                content: `<h2>Storm Preparedness Checklist</h2>
<p>With storm season approaching, now is the time to prepare your home to minimize potential damage.</p>

<h3>Exterior Preparation</h3>

<h4>Roof Inspection</h4>
<p>Check for loose or missing shingles, damaged flashing, and clogged gutters. Address any issues before storms arrive.</p>

<h4>Tree Maintenance</h4>
<ul>
    <li>Trim dead or overhanging branches</li>
    <li>Remove dead trees near your home</li>
    <li>Secure loose outdoor furniture and decorations</li>
</ul>

<h4>Windows and Doors</h4>
<p>Inspect weatherstripping, consider storm shutters for vulnerable windows, and reinforce garage doors.</p>

<h3>Emergency Supplies</h3>
<p>Prepare an emergency kit with:</p>
<ul>
    <li>Flashlights and batteries</li>
    <li>First aid supplies</li>
    <li>Non-perishable food and water (3-day supply)</li>
    <li>Important documents in waterproof container</li>
    <li>Battery-powered radio</li>
</ul>

<h3>Insurance Review</h3>
<p>Review your homeowner's insurance policy and understand your coverage for storm damage.</p>

<h3>After the Storm</h3>
<p>If your home sustains damage, <a href="/contact">contact us for 24/7 emergency restoration services</a>.</p>`,
                excerpt: 'Prepare your home for storm season with this comprehensive checklist of preventive measures.',
                author: 'Acme Restoration Team',
                featuredImage: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800',
                publishedAt: now,
                updatedAt: now,
                status: 'published',
                tags: ['storm damage', 'preparation', 'emergency'],
                seo: { title: 'How to Prepare Your Home for Storm Season', description: 'Complete storm preparedness checklist to protect your home and family during storm season.', keywords: ['storm', 'preparation', 'home safety'] },
            },
            {
                id: generateId(),
                title: 'Understanding the Restoration Process: What to Expect',
                slug: 'understanding-restoration-process',
                content: `<h2>The Professional Restoration Process Explained</h2>
<p>When disaster strikes, knowing what to expect from the restoration process can help reduce stress and ensure a smooth recovery.</p>

<h3>Phase 1: Emergency Response (0-24 Hours)</h3>
<p>Our team arrives quickly to assess damage and begin emergency measures:</p>
<ul>
    <li>Damage assessment and documentation</li>
    <li>Water extraction (for water damage)</li>
    <li>Board-up services if needed</li>
    <li>Initial cleaning and debris removal</li>
</ul>

<h3>Phase 2: Mitigation (1-3 Days)</h3>
<p>Prevent further damage and begin drying/cleaning:</p>
<ul>
    <li>Industrial drying equipment deployment</li>
    <li>Moisture monitoring and documentation</li>
    <li>Antimicrobial treatment</li>
    <li>Content pack-out if necessary</li>
</ul>

<h3>Phase 3: Restoration (Days to Weeks)</h3>
<p>Repair and restore your property:</p>
<ul>
    <li>Structural repairs</li>
    <li>Drywall replacement</li>
    <li>Painting and finishing</li>
    <li>Flooring installation</li>
    <li>Final inspection</li>
</ul>

<h3>Working with Insurance</h3>
<p>We work directly with your insurance company to streamline the claims process and maximize your coverage.</p>

<h3>Our Guarantee</h3>
<p>We stand behind our work with industry-leading guarantees. <a href="/contact">Contact us today</a> to learn more about our restoration services.</p>`,
                excerpt: 'A detailed guide to understanding the professional restoration process from emergency response to completion.',
                author: 'Acme Restoration Team',
                featuredImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
                publishedAt: now,
                updatedAt: now,
                status: 'published',
                tags: ['restoration', 'process', 'guide'],
                seo: { title: 'Understanding the Restoration Process: What to Expect', description: 'Learn what to expect during the professional restoration process from emergency response to final completion.', keywords: ['restoration', 'process', 'guide'] },
            },
        ],
        seoSettings: {
            siteName: 'Acme Restoration Services',
            siteDescription: 'Professional water, fire, and mold restoration services. 24/7 emergency response.',
            socialLinks: {},
        },
        createdAt: now,
        updatedAt: now,
        status: 'draft',
        contactPhone: '(555) 123-4567',
        contactEmail: 'info@acmerestoration.com',
    };
}
