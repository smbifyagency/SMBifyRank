// Content Blocks Generator - Reusable rich content sections for pages

import { ServiceTemplate, getIndustryCategory, getCategoryImages } from '../industryData';

export interface ContentBlock {
    type: string;
    html: string;
}

// Generate "Why Choose Us" section with 6-8 compelling reasons
export function generateWhyChooseUs(businessName: string, industry: string): ContentBlock {
    const category = getIndustryCategory(industry);
    const industryName = category?.name || industry;

    return {
        type: 'why-choose-us',
        html: `
      <section class="why-choose-us">
        <div class="container">
          <h2>Why Choose ${businessName}?</h2>
          <p class="section-intro">When you need professional ${industryName.toLowerCase()} services, you deserve a company that puts your needs first. Here's why homeowners and businesses trust us for their most important projects.</p>
          
          <div class="features-grid">
            <div class="feature-item">
              <div class="feature-icon">✓</div>
              <h3>Licensed & Insured</h3>
              <p>Fully licensed, bonded, and insured for your complete peace of mind. We meet all state and local requirements.</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">⏰</div>
              <h3>24/7 Emergency Service</h3>
              <p>Problems don't wait for business hours. Our team is available around the clock for emergency situations.</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">💰</div>
              <h3>Upfront Pricing</h3>
              <p>No hidden fees or surprise charges. We provide detailed written estimates before any work begins.</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">⭐</div>
              <h3>5-Star Reviews</h3>
              <p>Our commitment to excellence shows in our reviews. Thousands of satisfied customers recommend us.</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🏆</div>
              <h3>Experienced Professionals</h3>
              <p>Our technicians have years of hands-on experience and ongoing training in the latest techniques.</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">✅</div>
              <h3>Satisfaction Guaranteed</h3>
              <p>We stand behind our work. If you're not completely satisfied, we'll make it right.</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🚚</div>
              <h3>Fast Response Times</h3>
              <p>We value your time. Our team arrives promptly and completes work efficiently without cutting corners.</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">📞</div>
              <h3>Local & Family-Owned</h3>
              <p>We're part of this community. When you call, you talk to real people who care about your project.</p>
            </div>
          </div>
        </div>
      </section>
    `,
    };
}

// Generate "Our Process" section with detailed steps
export function generateOurProcess(businessName: string, service: ServiceTemplate): ContentBlock {
    const steps = service.process.length > 0 ? service.process : [
        'Initial Consultation',
        'Assessment & Planning',
        'Professional Execution',
        'Quality Verification',
        'Final Walkthrough',
    ];

    return {
        type: 'our-process',
        html: `
      <section class="our-process">
        <div class="container">
          <h2>Our ${service.name} Process</h2>
          <p class="section-intro">We follow a proven process to ensure exceptional results every time. From your first call to project completion, here's what you can expect when working with ${businessName}.</p>
          
          <div class="process-timeline">
            ${steps.map((step, index) => `
              <div class="process-step">
                <div class="step-number">${index + 1}</div>
                <div class="step-content">
                  <h3>${step}</h3>
                  <p>${getProcessStepDescription(step, service.name)}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `,
    };
}

// Generate FAQ section with industry-relevant questions
export function generateFAQSection(businessName: string, industry: string, serviceName?: string): ContentBlock {
    const category = getIndustryCategory(industry);
    const faqs = category?.faqTopics || [];

    const defaultFaqs = [
        { q: `How much does ${serviceName || 'your service'} cost?`, a: `The cost varies depending on the scope of work, property size, and specific requirements. We provide free, no-obligation estimates for all projects. Contact us today for a personalized quote within 24 hours.` },
        { q: `Do you offer free estimates?`, a: `Yes! We offer completely free, no-obligation estimates for all our services. Our expert technicians will assess your needs and provide detailed pricing before any work begins.` },
        { q: `What areas do you serve?`, a: `${businessName} proudly serves the local area and surrounding communities. Contact us to confirm service availability in your location.` },
        { q: `Are you licensed and insured?`, a: `Absolutely. ${businessName} is fully licensed, bonded, and insured. We maintain comprehensive coverage to protect both our team and your property throughout every project.` },
        { q: `How quickly can you respond to emergencies?`, a: `We offer 24/7 emergency services with rapid response times. In most cases, we can have a technician at your location within 1-2 hours for urgent situations.` },
        { q: `Do you offer any warranties or guarantees?`, a: `Yes, we stand behind our work with comprehensive warranties. The specifics vary by service, but we always ensure your complete satisfaction with our workmanship and materials.` },
    ];

    return {
        type: 'faq',
        html: `
      <section class="faq-section">
        <div class="container">
          <h2>Frequently Asked Questions</h2>
          <p class="section-intro">Get answers to the most common questions about our ${serviceName || 'services'}. Don't see your question? Contact us directly for personalized assistance.</p>
          
          <div class="faq-list" itemscope itemtype="https://schema.org/FAQPage">
            ${defaultFaqs.map(faq => `
              <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                <h3 itemprop="name">${faq.q}</h3>
                <div class="faq-answer" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                  <p itemprop="text">${faq.a}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `,
    };
}

// Generate trust badges and credentials section
export function generateTrustBadges(businessName: string): ContentBlock {
    return {
        type: 'trust-badges',
        html: `
      <section class="trust-badges">
        <div class="container">
          <div class="badges-grid">
            <div class="badge-item">
              <div class="badge-icon">🏆</div>
              <span>Award Winning</span>
            </div>
            <div class="badge-item">
              <div class="badge-icon">📜</div>
              <span>Fully Licensed</span>
            </div>
            <div class="badge-item">
              <div class="badge-icon">🛡️</div>
              <span>Insured & Bonded</span>
            </div>
            <div class="badge-item">
              <div class="badge-icon">⭐</div>
              <span>5-Star Rated</span>
            </div>
            <div class="badge-item">
              <div class="badge-icon">✅</div>
              <span>BBB Accredited</span>
            </div>
            <div class="badge-item">
              <div class="badge-icon">🏠</div>
              <span>Locally Owned</span>
            </div>
          </div>
        </div>
      </section>
    `,
    };
}

// Generate service benefits section
export function generateServiceBenefits(service: ServiceTemplate): ContentBlock {
    const benefits = service.features.length > 0 ? service.features : [
        'Professional Quality Results',
        'Time and Cost Savings',
        'Peace of Mind',
        'Expert Advice',
    ];

    return {
        type: 'benefits',
        html: `
      <section class="service-benefits">
        <div class="container">
          <h2>Benefits of Our ${service.name} Service</h2>
          <div class="benefits-grid">
            ${benefits.map(benefit => `
              <div class="benefit-item">
                <div class="benefit-icon">✓</div>
                <div class="benefit-content">
                  <h3>${benefit}</h3>
                  <p>${getBenefitDescription(benefit)}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `,
    };
}

// Generate CTA section
export function generateCTASection(businessName: string, phone: string, serviceName?: string): ContentBlock {
    return {
        type: 'cta',
        html: `
      <section class="cta-section">
        <div class="container">
          <div class="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Contact ${businessName} today for a free consultation and estimate. Our team is standing by to help with all your ${serviceName || 'service'} needs.</p>
            <div class="cta-buttons">
              <a href="tel:${phone}" class="btn btn-primary">📞 Call Now: ${phone}</a>
              <a href="/contact" class="btn btn-secondary">Request Free Quote</a>
            </div>
          </div>
        </div>
      </section>
    `,
    };
}

// Generate service areas grid
export function generateServiceAreasGrid(locations: { city: string; state?: string; slug: string }[]): ContentBlock {
    return {
        type: 'service-areas',
        html: `
      <section class="service-areas">
        <div class="container">
          <h2>Areas We Serve</h2>
          <p class="section-intro">We proudly serve these communities and surrounding areas. Contact us to confirm service availability in your location.</p>
          <div class="areas-grid">
            ${locations.map(loc => `
              <a href="/locations/${loc.slug}" class="area-item">
                <span class="area-icon">📍</span>
                <span class="area-name">${loc.city}${loc.state ? `, ${loc.state}` : ''}</span>
              </a>
            `).join('')}
          </div>
        </div>
      </section>
    `,
    };
}

// Generate testimonials section
export function generateTestimonials(businessName: string): ContentBlock {
    return {
        type: 'testimonials',
        html: `
      <section class="testimonials">
        <div class="container">
          <h2>What Our Customers Say</h2>
          <p class="section-intro">Don't just take our word for it. Here's what our satisfied customers have to say about ${businessName}.</p>
          <div class="testimonials-grid">
            <div class="testimonial-item">
              <div class="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p class="testimonial-text">"Absolutely fantastic service! The team was professional, prompt, and did an amazing job. I couldn't be happier with the results. Highly recommend!"</p>
              <div class="testimonial-author">
                <strong>John D.</strong>
                <span>Verified Customer</span>
              </div>
            </div>
            <div class="testimonial-item">
              <div class="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p class="testimonial-text">"They went above and beyond my expectations. Fair pricing, quality work, and excellent communication throughout the entire process."</p>
              <div class="testimonial-author">
                <strong>Sarah M.</strong>
                <span>Verified Customer</span>
              </div>
            </div>
            <div class="testimonial-item">
              <div class="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p class="testimonial-text">"I've used them multiple times and they never disappoint. Reliable, trustworthy, and always deliver great results. My go-to company!"</p>
              <div class="testimonial-author">
                <strong>Mike R.</strong>
                <span>Verified Customer</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `,
    };
}

// Generate rich about content
export function generateAboutContent(businessName: string, industry: string, city: string): ContentBlock {
    const category = getIndustryCategory(industry);
    const industryName = category?.name || industry;

    return {
        type: 'about-content',
        html: `
      <section class="about-content">
        <div class="container">
          <div class="about-text">
            <h2>About ${businessName}</h2>
            <p>${businessName} is a locally-owned and operated ${industryName.toLowerCase()} company serving ${city} and the surrounding communities. With years of experience in the industry, we've built our reputation on quality workmanship, honest pricing, and exceptional customer service.</p>
            
            <h3>Our Mission</h3>
            <p>Our mission is simple: to provide the highest quality ${industryName.toLowerCase()} services while treating every customer like family. We understand that inviting a service provider into your home or business requires trust, and we work hard every day to earn and maintain that trust.</p>
            
            <h3>Our Commitment to Excellence</h3>
            <p>What sets ${businessName} apart is our unwavering commitment to excellence in everything we do. From the moment you contact us to the completion of your project, you'll experience the difference that comes from working with true professionals who take pride in their craft.</p>
            
            <h3>Our Team</h3>
            <p>Our team consists of highly trained, certified technicians who bring years of real-world experience to every job. We invest heavily in ongoing training and education to ensure our team stays current with the latest techniques, technologies, and industry best practices.</p>
            
            <h3>Community Involvement</h3>
            <p>As a local business, we believe in giving back to the community that has supported us. We actively participate in local events, support charitable organizations, and strive to be a positive force in our neighborhood.</p>
          </div>
        </div>
      </section>
    `,
    };
}

// Generate rich service page content (1500+ words)
export function generateRichServiceContent(
    businessName: string,
    service: ServiceTemplate,
    industry: string,
    city: string,
    phone: string,
    allServices: ServiceTemplate[]
): string {
    const category = getIndustryCategory(industry);
    const images = getCategoryImages(industry);

    return `
    <!-- Hero Section -->
    <section class="service-hero">
      <div class="hero-bg" style="background-image: url('${images.services[0] || images.hero}')">
        <div class="hero-overlay">
          <div class="container">
            <h1>${service.name}</h1>
            <p class="hero-subtitle">${service.description}</p>
            <div class="hero-cta">
              <a href="tel:${phone}" class="btn btn-primary">📞 Call Now: ${phone}</a>
              <a href="/contact" class="btn btn-secondary">Get Free Quote</a>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Service Overview -->
    <section class="service-overview">
      <div class="container">
        <div class="overview-grid">
          <div class="overview-content">
            <h2>Professional ${service.name} Services in ${city}</h2>
            <p>When you need expert ${service.name.toLowerCase()} services, ${businessName} is here to help. Our team of certified professionals delivers top-quality results backed by years of experience and a commitment to customer satisfaction.</p>
            
            <p>${service.description} We understand the importance of getting the job done right the first time, which is why we use only the best equipment, materials, and techniques in the industry.</p>
            
            <p>Whether you're dealing with an emergency situation or planning a scheduled project, our team is ready to provide the prompt, reliable service you deserve. We take pride in our attention to detail and our ability to handle projects of any size or complexity.</p>
            
            <h3>Why Professional ${service.name} Matters</h3>
            <p>Attempting to handle ${service.name.toLowerCase()} without professional expertise can lead to costly mistakes, safety hazards, and subpar results. Our trained technicians have the knowledge and tools to do the job safely and effectively, saving you time, money, and stress in the long run.</p>
            
            <p>With ${businessName}, you can expect transparent communication, upfront pricing, and workmanship that meets the highest industry standards. We're not satisfied until you're completely happy with the results.</p>
          </div>
          <div class="overview-image">
            <img src="${images.services[0] || images.about}" alt="${service.name} service" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
    
    <!-- Service Features -->
    <section class="service-features">
      <div class="container">
        <h2>What's Included in Our ${service.name} Service</h2>
        <p class="section-intro">Our comprehensive ${service.name.toLowerCase()} service includes everything you need for excellent results.</p>
        <div class="features-grid">
          ${service.features.map(feature => `
            <div class="feature-card">
              <div class="feature-icon">${service.icon}</div>
              <h3>${feature}</h3>
              <p>${getFeatureDescription(feature, service.name)}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
    
    ${generateOurProcess(businessName, service).html}
    
    ${generateFAQSection(businessName, industry, service.name).html}
    
    <!-- Related Services -->
    <section class="related-services">
      <div class="container">
        <h2>Related Services</h2>
        <p class="section-intro">Explore our other professional services to meet all your needs.</p>
        <div class="services-grid">
          ${allServices.filter(s => s.name !== service.name).slice(0, 4).map(s => `
            <a href="/services/${slugify(s.name)}" class="service-card">
              <span class="service-icon">${s.icon}</span>
              <h3>${s.name}</h3>
              <p>${s.description.substring(0, 100)}...</p>
            </a>
          `).join('')}
        </div>
      </div>
    </section>
    
    ${generateCTASection(businessName, phone, service.name).html}
  `;
}

// Generate rich location page content (1500+ words)
export function generateRichLocationContent(
    businessName: string,
    location: { city: string; state?: string; slug: string },
    industry: string,
    services: ServiceTemplate[],
    phone: string
): string {
    const category = getIndustryCategory(industry);
    const industryName = category?.name || industry;
    const images = getCategoryImages(industry);
    const cityState = `${location.city}${location.state ? `, ${location.state}` : ''}`;

    return `
    <!-- Hero Section -->
    <section class="location-hero">
      <div class="hero-bg" style="background-image: url('${images.hero}')">
        <div class="hero-overlay">
          <div class="container">
            <h1>${industryName} Services in ${cityState}</h1>
            <p class="hero-subtitle">Professional, reliable ${industryName.toLowerCase()} services for homes and businesses in ${location.city}.</p>
            <div class="hero-cta">
              <a href="tel:${phone}" class="btn btn-primary">📞 Call Now: ${phone}</a>
              <a href="/contact" class="btn btn-secondary">Get Free Quote</a>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Location Overview -->
    <section class="location-overview">
      <div class="container">
        <h2>Your Trusted ${industryName} Company in ${location.city}</h2>
        <p>${businessName} is proud to serve the ${location.city} community with top-quality ${industryName.toLowerCase()} services. Our local team understands the unique needs of ${location.city} residents and businesses, and we're committed to providing fast, reliable service when you need it most.</p>
        
        <p>Whether you're dealing with an emergency or planning a scheduled project, our experienced technicians are ready to help. We've built strong relationships with homeowners and businesses throughout ${location.city} by consistently delivering excellent results and exceptional customer service.</p>
        
        <h3>Why ${location.city} Chooses ${businessName}</h3>
        <p>As a local company, we take our reputation in ${location.city} seriously. We're not just another faceless corporation—we're your neighbors. When you call us, you're talking to real people who live and work in this community. That personal connection drives us to go above and beyond on every job.</p>
        
        <p>Our ${location.city} customers appreciate our quick response times, competitive pricing, and unwavering commitment to quality. We treat every project with the same care and attention to detail, whether it's a small repair or a major installation.</p>
        
        <h3>Understanding ${location.city}'s Unique Needs</h3>
        <p>Every community has its own characteristics, and ${location.city} is no exception. Our team has extensive experience working in this area, so we understand the local building codes, common issues that affect properties here, and the best solutions for our climate and conditions.</p>
      </div>
    </section>
    
    <!-- Services in Location -->
    <section class="location-services">
      <div class="container">
        <h2>Our Services in ${location.city}</h2>
        <p class="section-intro">We offer a full range of ${industryName.toLowerCase()} services to meet all your needs in ${location.city}.</p>
        <div class="services-grid">
          ${services.map(service => `
            <a href="/services/${slugify(service.name)}" class="service-card">
              <span class="service-icon">${service.icon}</span>
              <h3>${service.name}</h3>
              <p>${service.description.substring(0, 120)}...</p>
              <span class="learn-more">Learn More →</span>
            </a>
          `).join('')}
        </div>
      </div>
    </section>
    
    ${generateWhyChooseUs(businessName, industry).html}
    
    ${generateTestimonials(businessName).html}
    
    ${generateFAQSection(businessName, industry).html}
    
    ${generateCTASection(businessName, phone).html}
  `;
}

// Helper functions
function getProcessStepDescription(step: string, serviceName: string): string {
    const descriptions: Record<string, string> = {
        'Initial Consultation': 'We start by understanding your needs and goals. Our expert will listen to your concerns and answer any questions.',
        'Assessment & Planning': 'We conduct a thorough assessment of the situation and develop a detailed plan tailored to your specific needs.',
        'Professional Execution': 'Our trained technicians execute the plan using industry-leading techniques and high-quality materials.',
        'Quality Verification': 'We thoroughly inspect our work to ensure it meets our high standards and your expectations.',
        'Final Walkthrough': 'We walk through the completed project with you, explaining what was done and answering any questions.',
        'Free Consultation': 'We assess your needs and provide a detailed quote with no obligation.',
        'Inspection': 'Our experts thoroughly inspect the area to identify all issues.',
        'Treatment': 'We apply the appropriate treatment using professional-grade products and equipment.',
        'Follow-Up': 'We check back to ensure the solution is working and you\'re satisfied.',
    };
    return descriptions[step] || `We execute this phase of your ${serviceName.toLowerCase()} project with precision and care.`;
}

function getBenefitDescription(benefit: string): string {
    const descriptions: Record<string, string> = {
        'Professional Quality Results': 'Get results that last with expert techniques and quality materials.',
        'Time and Cost Savings': 'Save money in the long run by getting the job done right the first time.',
        'Peace of Mind': 'Rest easy knowing your project is in the hands of licensed professionals.',
        'Expert Advice': 'Benefit from our years of experience and industry knowledge.',
        '24/7 Emergency Response': 'We\'re available around the clock when you need us most.',
        'Industrial Equipment': 'We use professional-grade tools and equipment for superior results.',
        'Complete Water Removal': 'Thorough extraction ensures no hidden moisture remains.',
        'Moisture Detection': 'Advanced technology finds water you can\'t see.',
    };
    return descriptions[benefit] || 'Experience the advantage of working with true professionals.';
}

function getFeatureDescription(feature: string, serviceName: string): string {
    return `Our ${feature.toLowerCase()} capabilities ensure you get the best possible results for your ${serviceName.toLowerCase()} needs.`;
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}
