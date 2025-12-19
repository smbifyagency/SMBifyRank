// AI Content Generation for Website Pages
// Uses OpenAI or OpenRouter to generate SEO-optimized content

interface ApiConfig {
    openaiApiKey?: string;
    openrouterApiKey?: string;
}

interface ContentGenerationParams {
    businessName: string;
    industry: string;
    serviceName?: string;
    locationCity?: string;
    locationState?: string;
    pageType: 'home' | 'about' | 'service' | 'location' | 'contact';
    targetWords?: number;
    services?: Array<{ name: string; slug?: string }>;
    locations?: Array<{ city: string; state: string; slug?: string }>;
}

// Get API config from localStorage
export function getApiConfig(): ApiConfig {
    if (typeof window === 'undefined') return {};
    const saved = localStorage.getItem('api-config');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch {
            return {};
        }
    }
    return {};
}

// Save API config to localStorage
export function saveApiConfig(config: ApiConfig): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('api-config', JSON.stringify(config));
}

// Check if AI is available
export function isAiAvailable(): boolean {
    const config = getApiConfig();
    return !!(config.openaiApiKey || config.openrouterApiKey);
}

// Generate content using AI
export async function generateAiContent(params: ContentGenerationParams): Promise<string> {
    const config = getApiConfig();
    const targetWords = params.targetWords || 800;

    const prompt = buildPrompt(params, targetWords);

    // Try OpenAI first, then OpenRouter
    if (config.openaiApiKey) {
        return await callOpenAI(config.openaiApiKey, prompt);
    } else if (config.openrouterApiKey) {
        return await callOpenRouter(config.openrouterApiKey, prompt);
    }

    // Fallback to template content if no API key
    return generateFallbackContent(params);
}

function buildPrompt(params: ContentGenerationParams, targetWords: number): string {
    const { businessName, industry, serviceName, locationCity, locationState, pageType, services, locations } = params;
    const location = locationState ? `${locationCity}, ${locationState}` : locationCity || 'local area';

    // Build internal linking context
    const serviceLinks = services?.map(s => `- ${s.name} (/services/${slugify(s.name)})`).join('\n') || '';
    const locationLinks = locations?.map(l => `- ${l.city}, ${l.state} (/locations/${slugify(l.city)})`).join('\n') || '';

    const semanticEntityGuidance = `
SEMANTIC ENTITIES REQUIREMENT:
Include relevant semantic entities naturally throughout the content. These are related concepts, attributes, and entities that search engines use to understand topic depth. Examples:
- For water damage: moisture detection, structural drying, dehumidification, water extraction, mold prevention
- For HVAC: energy efficiency, SEER rating, indoor air quality, ductwork, thermostat
- For plumbing: pipe repair, drain cleaning, water heater, sewer line, leak detection

INTERNAL LINKING REQUIREMENT:
Naturally work in contextual references to other pages. Use this format: [INTERNAL_LINK: anchor text | /path/to/page]
Available internal pages:
${serviceLinks}
${locationLinks}
- About Us (/about)
- Contact Us (/contact)
- All Services (/services)
`;

    switch (pageType) {
        case 'home':
            return `Write a compelling, SEO-optimized homepage content for "${businessName}", a ${industry} company serving ${location}.

${semanticEntityGuidance}

Requirements:
- Write approximately ${targetWords} words
- Use H2 and H3 headings appropriately  
- Include relevant keywords naturally with 1-2% density
- Focus on lead generation and trust building
- Highlight key benefits and unique value propositions
- Include a strong call-to-action focus
- Write in a professional but approachable tone
- Do NOT include the business name in every sentence
- Include 5-10 semantic entities related to ${industry}
- Add 2-3 internal links to service pages

Structure the content with:
1. A compelling introduction about the company
2. Why choose this company (trust factors, credentials)
3. Overview of services offered (with internal links)
4. Service area coverage (with location links)
5. Social proof elements (reviews mention, certifications)
6. Call to action

Return ONLY the HTML content (using h2, h3, p, ul, li tags). Do not include doctype, html, head, or body tags.`;

        case 'about':
            return `Write a compelling, SEO-optimized About Us page for "${businessName}", a ${industry} company serving ${location}.

${semanticEntityGuidance}

Requirements:
- Write approximately ${targetWords} words
- Include company story and mission
- Highlight experience and expertise
- Mention certifications, licenses, awards if applicable
- Include team/culture information
- Use professional but warm tone
- Include trust indicators
- Add 2-3 internal links to service and contact pages
- Include semantic entities related to ${industry} expertise

Return ONLY the HTML content (using h2, h3, p, ul, li tags). Do not include doctype, html, head, or body tags.`;

        case 'service':
            return `Write a comprehensive, SEO-optimized service page for "${serviceName}" offered by "${businessName}", a ${industry} company serving ${location}.

${semanticEntityGuidance}

Requirements:
- Write approximately ${targetWords} words
- Target the keyword "${serviceName}" and related long-tail variations
- Explain what the service includes in detail
- Describe the step-by-step process customers can expect
- List 5+ benefits of choosing this company for this service
- Include FAQ-style content (3-4 questions)
- Add a strong call-to-action for quotes/consultation
- Be specific and detailed with technical terminology
- Include 8-12 semantic entities related to this specific service
- Add internal links to related services and location pages
- Mention the service area naturally

Structure:
1. Introduction with keyword
2. What this service includes
3. Our process (numbered steps)
4. Benefits of choosing us
5. FAQ section
6. Call to action

Return ONLY the HTML content (using h2, h3, p, ul, li, ol tags). Do not include doctype, html, head, or body tags.`;

        case 'location':
            return `Write a comprehensive, SEO-optimized location page for "${businessName}" serving "${location}".

${semanticEntityGuidance}

Requirements:
- Write approximately ${targetWords} words  
- Target local SEO keywords: "${industry} in ${location}", "${industry} near ${location}", "${location} ${industry}"
- Mention ALL services available in this area with internal links
- Include local benefits (fast response, knowledge of local regulations, nearby team)
- Add trust indicators and social proof specific to this location
- Include local landmarks, neighborhoods, or areas we serve
- Strong call-to-action with local phone emphasis
- Make it feel personalized for the ${location} community
- Include 8-12 semantic entities related to ${industry}
- Link to at least 3 service pages

Structure:
1. Introduction about serving ${location}
2. Services available in ${location} (with internal links)
3. Why local customers choose us
4. Areas we serve near ${location}
5. Call to action

Return ONLY the HTML content (using h2, h3, p, ul, li tags). Do not include doctype, html, head, or body tags.`;

        case 'contact':
            return `Write a brief but effective Contact page introduction for "${businessName}", a ${industry} company serving ${location}.

Requirements:
- Write approximately 200 words
- Encourage visitors to get in touch for free quotes
- Mention response time expectations (e.g., "We respond within 1 hour")
- Be friendly and professional
- Include reassurance about no-obligation consultations
- Mention multiple ways to contact (phone, email, form)
- Add urgency for emergency services if applicable

Return ONLY the HTML content (using h2, h3, p tags). Do not include doctype, html, head, or body tags.`;

        default:
            return `Write ${targetWords} words of SEO-optimized content for "${businessName}", a ${industry} company serving ${location}.`;
    }
}

// Helper function to create URL-friendly slugs
function slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function callOpenAI(apiKey: string, prompt: string): Promise<string> {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert SEO copywriter specializing in local business websites. You write compelling, keyword-rich content that converts visitors into leads.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 2000,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI API error:', error);
        throw error;
    }
}

async function callOpenRouter(apiKey: string, prompt: string): Promise<string> {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
            },
            body: JSON.stringify({
                model: 'openai/gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert SEO copywriter specializing in local business websites. You write compelling, keyword-rich content that converts visitors into leads.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 2000,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('OpenRouter API error:', error);
        throw error;
    }
}

// Generate fallback template content when AI is not available
function generateFallbackContent(params: ContentGenerationParams): string {
    const { businessName, industry, serviceName, locationCity, locationState, pageType } = params;
    const location = locationState ? `${locationCity}, ${locationState}` : locationCity || 'your area';

    switch (pageType) {
        case 'home':
            return `
<h2>Welcome to ${businessName}</h2>
<p>${businessName} is your trusted partner for professional ${industry} services in ${location}. With years of experience and a commitment to excellence, we deliver outstanding results that exceed your expectations.</p>

<h3>Why Choose ${businessName}?</h3>
<p>When you need reliable ${industry} services, you deserve a company that puts your needs first. Here's what sets us apart:</p>
<ul>
    <li><strong>Experienced Professionals</strong> - Our team brings years of expertise to every project</li>
    <li><strong>24/7 Availability</strong> - We're here when you need us, including emergencies</li>
    <li><strong>Transparent Pricing</strong> - No hidden fees or surprise charges</li>
    <li><strong>Quality Guaranteed</strong> - We stand behind our work with satisfaction guarantees</li>
    <li><strong>Licensed & Insured</strong> - Full coverage for your peace of mind</li>
</ul>

<h3>Our Services</h3>
<p>We offer comprehensive ${industry} solutions tailored to your specific needs. From routine maintenance to complex projects, our skilled technicians handle it all with professionalism and care.</p>

<h3>Serving ${location} and Surrounding Areas</h3>
<p>${businessName} proudly serves ${location} and the surrounding communities. Our local team understands the unique needs of our area and is committed to providing fast, responsive service.</p>

<h3>Get Started Today</h3>
<p>Ready to experience the ${businessName} difference? Contact us now for a free consultation and estimate. Our friendly team is standing by to help with all your ${industry} needs.</p>`;

        case 'about':
            return `
<h2>About ${businessName}</h2>
<p>${businessName} has been serving the ${location} community with dedication and excellence. Our mission is to provide top-quality ${industry} services that exceed expectations and build lasting relationships with our customers.</p>

<h3>Our Story</h3>
<p>Founded with a commitment to quality and customer service, ${businessName} has grown to become a trusted name in the ${industry} industry. We take pride in every project we complete and treat every customer like family.</p>

<h3>Our Values</h3>
<ul>
    <li><strong>Integrity</strong> - We believe in honest, transparent service</li>
    <li><strong>Quality</strong> - We never cut corners on quality</li>
    <li><strong>Customer Focus</strong> - Your satisfaction is our top priority</li>
    <li><strong>Reliability</strong> - We're there when you need us</li>
</ul>

<h3>Our Team</h3>
<p>Our team consists of highly trained, certified professionals who bring years of experience to every job. We invest in ongoing training to ensure our team stays current with the latest techniques and best practices.</p>

<h3>Community Commitment</h3>
<p>As a local business, we believe in giving back to the community that has supported us. We actively participate in local events and strive to be a positive force in our neighborhood.</p>`;

        case 'service':
            return `
<h2>Professional ${serviceName} Services</h2>
<p>${businessName} offers comprehensive ${serviceName} services designed to meet your specific needs. Our experienced team uses the latest techniques and equipment to deliver exceptional results.</p>

<h3>What We Offer</h3>
<p>Our ${serviceName} service includes:</p>
<ul>
    <li>Thorough assessment and consultation</li>
    <li>Professional-grade equipment and materials</li>
    <li>Experienced, certified technicians</li>
    <li>Complete project management</li>
    <li>Quality assurance and follow-up</li>
</ul>

<h3>Our Process</h3>
<ol>
    <li><strong>Free Consultation</strong> - We assess your needs and provide a detailed quote</li>
    <li><strong>Planning</strong> - We develop a customized plan for your project</li>
    <li><strong>Professional Execution</strong> - Our team delivers quality workmanship</li>
    <li><strong>Quality Check</strong> - We verify everything meets our high standards</li>
    <li><strong>Follow-Up</strong> - We ensure your complete satisfaction</li>
</ol>

<h3>Why Choose Us for ${serviceName}?</h3>
<ul>
    <li>Years of experience in ${serviceName}</li>
    <li>Licensed and insured professionals</li>
    <li>Competitive pricing with no hidden fees</li>
    <li>Satisfaction guaranteed on all work</li>
    <li>Fast response times</li>
</ul>

<h3>Ready to Get Started?</h3>
<p>Contact ${businessName} today for a free estimate on your ${serviceName} project. Our friendly team is ready to help!</p>`;

        case 'location':
            return `
<h2>${industry} Services in ${location}</h2>
<p>${businessName} proudly serves ${location} with professional ${industry} services. Our local team understands the unique needs of our community and is ready to help 24/7.</p>

<h3>Your Local ${industry} Experts</h3>
<p>When you need ${industry} services in ${location}, choose a company that's part of your community. ${businessName} has built strong relationships with residents and businesses throughout the area.</p>

<h3>Services Available in ${location}</h3>
<p>We offer a full range of ${industry} services to meet your needs, including emergency services, routine maintenance, and major projects.</p>

<h3>Why ${location} Chooses ${businessName}</h3>
<ul>
    <li><strong>Local Knowledge</strong> - We understand ${location}'s unique needs</li>
    <li><strong>Fast Response</strong> - Being local means we get there quickly</li>
    <li><strong>Community Trust</strong> - We're your neighbors first</li>
    <li><strong>24/7 Availability</strong> - Emergencies don't wait, and neither do we</li>
</ul>

<h3>Contact Us in ${location}</h3>
<p>Ready to get started? Our ${location} team is standing by to help with all your ${industry} needs. Call now for a free consultation!</p>`;

        case 'contact':
            return `
<h2>Get In Touch</h2>
<p>We'd love to hear from you! Whether you have a question about our services, need a quote, or want to schedule an appointment, our team is ready to help.</p>

<h3>Fast Response Guaranteed</h3>
<p>We understand your time is valuable. Our team responds to all inquiries within 24 hours, and often much sooner. For emergencies, call us directly for immediate assistance.</p>`;

        default:
            return `<p>Welcome to ${businessName}. Contact us for ${industry} services in ${location}.</p>`;
    }
}

// Generate all page content for a website
export async function generateAllPageContent(
    businessName: string,
    industry: string,
    services: Array<{ name: string }>,
    locations: Array<{ city: string; state?: string }>,
    onProgress?: (message: string, progress: number) => void
): Promise<{
    homeContent: string;
    aboutContent: string;
    serviceContents: Map<string, string>;
    locationContents: Map<string, string>;
    contactContent: string;
}> {
    const totalSteps = 3 + services.length + locations.length;
    let currentStep = 0;

    const reportProgress = (message: string) => {
        currentStep++;
        onProgress?.(message, Math.round((currentStep / totalSteps) * 100));
    };

    // Generate home content
    reportProgress('Generating home page content...');
    const homeContent = await generateAiContent({
        businessName,
        industry,
        pageType: 'home',
        targetWords: 800,
    });

    // Generate about content
    reportProgress('Generating about page content...');
    const aboutContent = await generateAiContent({
        businessName,
        industry,
        pageType: 'about',
        targetWords: 600,
    });

    // Generate service contents
    const serviceContents = new Map<string, string>();
    for (const service of services) {
        reportProgress(`Generating ${service.name} page...`);
        const content = await generateAiContent({
            businessName,
            industry,
            serviceName: service.name,
            pageType: 'service',
            targetWords: 800,
        });
        serviceContents.set(service.name, content);
    }

    // Generate location contents
    const locationContents = new Map<string, string>();
    for (const location of locations) {
        reportProgress(`Generating ${location.city} page...`);
        const content = await generateAiContent({
            businessName,
            industry,
            locationCity: location.city,
            locationState: location.state,
            pageType: 'location',
            targetWords: 700,
        });
        locationContents.set(location.city, content);
    }

    // Generate contact content
    reportProgress('Generating contact page content...');
    const contactContent = await generateAiContent({
        businessName,
        industry,
        pageType: 'contact',
        targetWords: 200,
    });

    return {
        homeContent,
        aboutContent,
        serviceContents,
        locationContents,
        contactContent,
    };
}
