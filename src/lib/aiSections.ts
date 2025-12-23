// AI Section Content Generation - JSON-first approach
// AI generates structured JSON data, not HTML

import {
    SectionType,
    SectionContent,
    HeroSectionContent,
    ServicesSectionContent,
    AboutSectionContent,
    ContactSectionContent,
    CTASectionContent,
    TestimonialsSectionContent,
    FAQSectionContent,
    FeaturesSectionContent,
    PageSection,
} from './types';
import { getSchemaDescription, isUserEdited } from './sectionHelpers';
import { getApiConfig } from './ai';

// ==========================================
// TYPES
// ==========================================

interface BusinessContext {
    businessName: string;
    industry: string;
    phone?: string;
    email?: string;
    city?: string;
    state?: string;
    services?: Array<{ name: string; description?: string }>;
    locations?: Array<{ city: string; state?: string }>;
}

interface AIGenerationOptions {
    temperature?: number;
    forceRegenerate?: boolean; // Override user lock
}

// ==========================================
// MAIN GENERATION FUNCTION
// ==========================================

export async function generateSectionJSON(
    sectionType: SectionType,
    context: BusinessContext,
    options?: AIGenerationOptions
): Promise<SectionContent | null> {
    const config = getApiConfig();

    if (!config.openaiApiKey) {
        console.log('No OpenAI API key - using fallback content');
        return generateFallbackSectionContent(sectionType, context);
    }

    try {
        const prompt = buildSectionPrompt(sectionType, context);
        const response = await callOpenAIForJSON(config.openaiApiKey, prompt, options?.temperature);

        // Parse and validate
        const parsed = JSON.parse(response);
        return parsed as SectionContent;
    } catch (error) {
        console.error(`Failed to generate ${sectionType} section:`, error);
        return generateFallbackSectionContent(sectionType, context);
    }
}

// ==========================================
// SECTION-SPECIFIC PROMPTS
// ==========================================

function buildSectionPrompt(type: SectionType, context: BusinessContext): string {
    const { businessName, industry, city, state, phone, email, services, locations } = context;
    const location = state ? `${city}, ${state}` : city || 'your area';

    const baseInstructions = `You are generating content for a ${industry} business called "${businessName}" serving ${location}.

IMPORTANT: Return ONLY valid JSON matching the schema below. No explanations, no markdown formatting, just the JSON object.

Schema:
${getSchemaDescription(type)}
`;

    switch (type) {
        case 'hero':
            return `${baseInstructions}

Generate a compelling hero section with:
- A clear, benefit-focused headline (max 10 words)
- A subheadline that expands on the promise (1-2 sentences)
- Primary CTA button (action-oriented, link to /contact)
- Optional secondary CTA (informational, link to /about)

Focus on what makes this ${industry} business stand out. Be specific to the industry.`;

        case 'services-grid':
            const servicesList = services?.map(s => s.name).join(', ') || 'general services';
            return `${baseInstructions}

Generate a services section for these services: ${servicesList}

For each service include:
- An appropriate emoji icon
- A compelling 1-sentence description highlighting the benefit
- Link to /services/service-slug

Make descriptions specific to ${industry}, not generic.`;

        case 'about-intro':
            return `${baseInstructions}

Generate an about section that:
- Tells the company story authentically (body field - use <p> tags for paragraphs)
- Includes 4-5 trust-building features (licensed, experienced, local, etc.)
- Uses icons that match the features

The body should be 2-3 paragraphs of HTML. Be specific to ${industry}.`;

        case 'contact-form':
            return `${baseInstructions}

Generate a contact section with:
- An inviting title encouraging visitors to reach out
- A subtitle mentioning fast response time
- Phone: ${phone || '(555) 123-4567'}
- Email: ${email || 'info@business.com'}

Keep it friendly and emphasize quick response.`;

        case 'cta':
            return `${baseInstructions}

Generate a call-to-action section with:
- An action-oriented headline (max 8 words)
- A subheadline creating urgency or highlighting value
- A clear button text (e.g., "Get Your Free Quote")
- Link to /contact

Make it specific to ${industry} services.`;

        case 'testimonials':
            return `${baseInstructions}

Generate 3 realistic testimonials for a ${industry} business:
- Each has a realistic name
- Each has a specific, believable quote about the service
- Each has a 5-star rating
- Include company names for 1-2 of them

Quotes should mention specific aspects of ${industry} work.`;

        case 'faq':
            return `${baseInstructions}

Generate 5 frequently asked questions for a ${industry} business:
- Focus on common customer concerns
- Include questions about pricing, process, timeline
- Answers should be helpful and specific (2-3 sentences each)

Make questions specific to ${industry}.`;

        case 'features':
            return `${baseInstructions}

Generate 4-6 compelling reasons to choose this ${industry} business:
- Each feature has an appropriate emoji icon
- Each has a short, punchy title (2-4 words)
- Each has a 1-sentence description

Focus on trust factors: experience, licensing, guarantees, availability, etc.`;

        default:
            return `${baseInstructions}

Generate appropriate content for a "${type}" section for this ${industry} business.`;
    }
}

// ==========================================
// OPENAI API CALL FOR JSON
// ==========================================

async function callOpenAIForJSON(
    apiKey: string,
    prompt: string,
    temperature = 0.7
): Promise<string> {
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
                    content: 'You are a JSON generator. You output ONLY valid JSON objects, never explanations or markdown. Your JSON must be parseable.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: 1500,
            temperature,
            response_format: { type: 'json_object' }, // Force JSON response
        }),
    });

    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

// ==========================================
// REGENERATE SECTION (with lock check)
// ==========================================

export async function regenerateSection(
    section: PageSection,
    context: BusinessContext,
    options?: AIGenerationOptions
): Promise<PageSection | null> {
    // Check if user has locked this section
    if (isUserEdited(section) && !options?.forceRegenerate) {
        console.log(`Section ${section.id} is locked - skipping regeneration`);
        return null;
    }

    const newContent = await generateSectionJSON(section.type, context, options);

    if (!newContent) {
        return null;
    }

    return {
        ...section,
        content: newContent,
        userEdited: false,
        lastEditedAt: new Date().toISOString(),
        lastEditedBy: 'ai',
    };
}

// ==========================================
// FALLBACK CONTENT (when no API key)
// ==========================================

function generateFallbackSectionContent(
    type: SectionType,
    context: BusinessContext
): SectionContent {
    const { businessName, industry, city, phone, email, services, locations } = context;

    switch (type) {
        case 'hero':
            return {
                headline: `Professional ${industry} Services`,
                subheadline: `${businessName} delivers quality ${industry} services you can trust. Contact us today for a free estimate.`,
                ctaPrimary: { text: 'Get Free Quote', link: '/contact' },
                ctaSecondary: { text: 'Our Services', link: '/services' },
                showPhone: true,
            } as HeroSectionContent;

        case 'services-grid':
            return {
                title: 'Our Services',
                subtitle: `Professional ${industry} solutions tailored to your needs`,
                services: services?.map((s, i) => ({
                    id: `service-${i}`,
                    name: s.name,
                    description: s.description || `Quality ${s.name.toLowerCase()} services for your home or business.`,
                    icon: '✓',
                    link: `/services/${s.name.toLowerCase().replace(/\s+/g, '-')}`,
                })) || [],
            } as ServicesSectionContent;

        case 'about-intro':
            return {
                title: `About ${businessName}`,
                body: `<p>${businessName} is a trusted ${industry} company serving ${city || 'our community'}. We take pride in delivering exceptional service and quality workmanship on every project.</p>
<p>With years of experience in the industry, our team has the expertise and dedication to handle all your ${industry} needs. We're committed to customer satisfaction and stand behind our work.</p>`,
                features: [
                    { icon: '✓', text: 'Licensed & Insured' },
                    { icon: '✓', text: 'Experienced Professionals' },
                    { icon: '✓', text: 'Quality Guaranteed' },
                    { icon: '✓', text: 'Fast Response Times' },
                ],
            } as AboutSectionContent;

        case 'contact-form':
            return {
                title: 'Contact Us',
                subtitle: 'Get in touch for a free consultation',
                phone: phone || '(555) 123-4567',
                email: email || 'info@business.com',
                formFields: [
                    { name: 'name', type: 'text', label: 'Your Name', required: true },
                    { name: 'email', type: 'email', label: 'Email Address', required: true },
                    { name: 'phone', type: 'phone', label: 'Phone Number', required: false },
                    { name: 'message', type: 'textarea', label: 'How can we help?', required: true },
                ],
            } as ContactSectionContent;

        case 'cta':
            return {
                headline: 'Ready to Get Started?',
                subheadline: 'Contact us today for a free, no-obligation quote.',
                buttonText: 'Request Free Quote',
                buttonLink: '/contact',
                variant: 'primary',
            } as CTASectionContent;

        case 'testimonials':
            return {
                title: 'What Our Customers Say',
                subtitle: 'Trusted by homeowners and businesses alike',
                testimonials: [
                    {
                        id: 't1',
                        name: 'John D.',
                        quote: 'Excellent service! Professional, on-time, and the quality exceeded my expectations.',
                        rating: 5,
                    },
                    {
                        id: 't2',
                        name: 'Sarah M.',
                        company: 'Local Business Owner',
                        quote: 'They went above and beyond. Highly recommend for any project.',
                        rating: 5,
                    },
                    {
                        id: 't3',
                        name: 'Mike R.',
                        quote: 'Fair pricing and great communication throughout the project.',
                        rating: 5,
                    },
                ],
            } as TestimonialsSectionContent;

        case 'faq':
            return {
                title: 'Frequently Asked Questions',
                subtitle: 'Find answers to common questions',
                faqs: [
                    {
                        id: 'faq1',
                        question: 'How much does your service cost?',
                        answer: 'Pricing varies based on the scope of work. Contact us for a free, no-obligation estimate.',
                    },
                    {
                        id: 'faq2',
                        question: 'Are you licensed and insured?',
                        answer: 'Yes, we are fully licensed and carry comprehensive insurance for your protection.',
                    },
                    {
                        id: 'faq3',
                        question: 'How long does a typical project take?',
                        answer: 'Project timelines vary. We provide estimated completion times with every quote.',
                    },
                    {
                        id: 'faq4',
                        question: 'Do you offer free estimates?',
                        answer: 'Yes! We provide free, no-obligation estimates for all projects.',
                    },
                ],
            } as FAQSectionContent;

        case 'features':
            return {
                title: 'Why Choose Us',
                subtitle: 'What sets us apart',
                features: [
                    { id: 'f1', icon: '🏆', title: 'Experienced Team', description: 'Years of industry experience you can trust.' },
                    { id: 'f2', icon: '✓', title: 'Quality Guaranteed', description: 'We stand behind every project we complete.' },
                    { id: 'f3', icon: '⚡', title: 'Fast Response', description: 'Quick turnaround and responsive service.' },
                    { id: 'f4', icon: '💰', title: 'Fair Pricing', description: 'Competitive rates with no hidden fees.' },
                ],
                layout: 'grid',
            } as FeaturesSectionContent;

        default:
            return {
                content: `<p>Content for ${type} section.</p>`,
            } as SectionContent;
    }
}

// ==========================================
// GENERATE ALL PAGE SECTIONS
// ==========================================

export async function generatePageSections(
    pageType: 'home' | 'about' | 'services' | 'contact',
    context: BusinessContext,
    onProgress?: (message: string, progress: number) => void
): Promise<PageSection[]> {
    const sections: PageSection[] = [];
    let step = 0;

    const sectionTypes: Record<string, SectionType[]> = {
        home: ['hero', 'features', 'services-grid', 'testimonials', 'cta'],
        about: ['about-intro', 'features', 'cta'],
        services: ['services-grid', 'cta'],
        contact: ['contact-form'],
    };

    const types = sectionTypes[pageType] || ['text-block'];
    const totalSteps = types.length;

    for (const type of types) {
        step++;
        onProgress?.(`Generating ${type} section...`, Math.round((step / totalSteps) * 100));

        const content = await generateSectionJSON(type, context);

        if (content) {
            sections.push({
                id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                type,
                content,
                order: sections.length,
                userEdited: false,
                lastEditedAt: new Date().toISOString(),
                lastEditedBy: 'ai',
            });
        }
    }

    return sections;
}
