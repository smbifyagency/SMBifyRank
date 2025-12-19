// Rich Page Content Generators
// Generates 1500+ words of SEO-optimized content for About, Contact, Services, Locations, Blog pages

interface BusinessInfo {
    name: string;
    industry: string;
    city: string;
    phone: string;
    email?: string;
    services: Array<{ name: string; slug: string; icon: string; description: string }>;
    locations: Array<{ city: string; state?: string; slug: string }>;
}

// ==================== ABOUT PAGE ====================
export function generateRichAboutContent(info: BusinessInfo): string {
    const { name, industry, city, phone, services, locations } = info;
    const phoneClean = phone.replace(/[^0-9+]/g, '');

    return `
    <!-- About Hero -->
    <section class="page-hero">
        <div class="container">
            <h1>About ${name}</h1>
            <p class="hero-subtitle">Your Trusted ${capitalizeFirst(industry)} Partner in ${city}</p>
            <a href="tel:${phoneClean}" class="hero-phone-btn">
                📞 Call Us: ${phone}
            </a>
        </div>
    </section>

    <!-- Our Story -->
    <section class="content-section">
        <div class="container">
            <div class="content-grid">
                <div class="content-main">
                    <span class="section-badge">Our Story</span>
                    <h2>Who We Are</h2>
                    <p>
                        ${name} was founded with a simple mission: to provide the ${city} community with 
                        reliable, professional ${industry.toLowerCase()} services when they need it most. 
                        We understand that dealing with ${industry.toLowerCase()} issues can be stressful 
                        and overwhelming, which is why we've built our entire business around making the 
                        process as smooth and worry-free as possible.
                    </p>
                    <p>
                        From our humble beginnings, we've grown to become one of the most trusted 
                        ${industry.toLowerCase()} companies in the ${city} area. Our success is built on 
                        a foundation of hard work, dedication to quality, and an unwavering commitment 
                        to customer satisfaction. Every member of our team shares these values and brings 
                        them to every job we complete.
                    </p>
                    <p>
                        Today, ${name} serves residential and commercial customers throughout ${city} 
                        ${locations.length > 1 ? `and surrounding areas including ${locations.slice(1, 4).map(l => l.city).join(', ')}` : ''}. 
                        No matter how big or small your ${industry.toLowerCase()} needs, we're here to help. 
                        Give us a call at <a href="tel:${phoneClean}">${phone}</a> to experience the 
                        ${name} difference for yourself.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Mission & Values -->
    <section class="content-section alt-bg">
        <div class="container">
            <div class="text-center mb-40">
                <span class="section-badge">Our Mission</span>
                <h2>What We Stand For</h2>
            </div>
            <div class="values-grid">
                <div class="value-card">
                    <span class="value-icon">🎯</span>
                    <h3>Quality First</h3>
                    <p>We never cut corners. Every job receives our full attention and expertise, 
                    ensuring results that exceed expectations and stand the test of time.</p>
                </div>
                <div class="value-card">
                    <span class="value-icon">⏱️</span>
                    <h3>Fast Response</h3>
                    <p>When you need help, you need it now. Our team is available 24/7 and we 
                    prioritize rapid response times for all service calls.</p>
                </div>
                <div class="value-card">
                    <span class="value-icon">💬</span>
                    <h3>Clear Communication</h3>
                    <p>We believe in complete transparency. You'll always know exactly what 
                    we're doing, why we're doing it, and what it will cost.</p>
                </div>
                <div class="value-card">
                    <span class="value-icon">🤝</span>
                    <h3>Customer Focus</h3>
                    <p>Your satisfaction is our top priority. We treat every customer like 
                    family and every property like our own.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Why Choose Us -->
    <section class="content-section">
        <div class="container">
            <div class="text-center mb-40">
                <span class="section-badge">Why Choose ${name}</span>
                <h2>The ${name} Difference</h2>
                <p class="section-intro">Here's what sets us apart from other ${industry.toLowerCase()} companies in ${city}:</p>
            </div>
            <div class="benefits-list-alt">
                <div class="benefit-row">
                    <div class="benefit-icon-lg">📞</div>
                    <div class="benefit-content">
                        <h3>Real People, Real Answers</h3>
                        <p>When you call ${name}, you speak directly with a knowledgeable team member who can 
                        answer your questions and schedule service right away. No automated menus, no waiting 
                        on hold for hours—just real help from real people who care about solving your problem.</p>
                    </div>
                </div>
                <div class="benefit-row">
                    <div class="benefit-icon-lg">⚡</div>
                    <div class="benefit-content">
                        <h3>Fast, Reliable Service</h3>
                        <p>We understand that ${industry.toLowerCase()} issues don't wait for convenient times. 
                        That's why we offer 24/7 emergency service with rapid response times. When you need help, 
                        we'll be there quickly to assess the situation and get to work right away.</p>
                    </div>
                </div>
                <div class="benefit-row">
                    <div class="benefit-icon-lg">💵</div>
                    <div class="benefit-content">
                        <h3>Upfront Pricing</h3>
                        <p>No surprises, no hidden fees. We provide clear, detailed estimates before any work 
                        begins so you know exactly what to expect. We also work with all major insurance 
                        companies and can help you navigate the claims process.</p>
                    </div>
                </div>
                <div class="benefit-row">
                    <div class="benefit-icon-lg">✅</div>
                    <div class="benefit-content">
                        <h3>Quality Guaranteed</h3>
                        <p>We stand behind our work. Every job we complete is backed by our satisfaction 
                        guarantee. If you're not completely happy with our work, we'll make it right—that's 
                        our promise to you.</p>
                    </div>
                </div>
            </div>
            <div class="cta-box-centered">
                <p>Ready to experience the ${name} difference?</p>
                <a href="tel:${phoneClean}" class="cta-phone-btn">📞 Call ${phone}</a>
            </div>
        </div>
    </section>

    <!-- Services Overview -->
    <section class="content-section alt-bg">
        <div class="container">
            <div class="text-center mb-40">
                <span class="section-badge">What We Do</span>
                <h2>Our ${capitalizeFirst(industry)} Services</h2>
                <p class="section-intro">${name} offers a complete range of ${industry.toLowerCase()} services to meet all your needs:</p>
            </div>
            <div class="services-list-compact">
                ${services.map(s => `
                <div class="service-item-compact">
                    <span class="service-icon">${s.icon}</span>
                    <div class="service-info">
                        <h4>${s.name}</h4>
                        <p>${s.description}</p>
                    </div>
                    <a href="tel:${phoneClean}" class="service-call">📞</a>
                </div>
                `).join('')}
            </div>
            <div class="text-center mt-30">
                <a href="/services" class="btn-outline">View All Services</a>
            </div>
        </div>
    </section>

    <!-- Service Areas -->
    <section class="content-section">
        <div class="container">
            <div class="text-center mb-40">
                <span class="section-badge">Where We Serve</span>
                <h2>Service Areas</h2>
                <p class="section-intro">${name} proudly serves ${city} and the surrounding communities:</p>
            </div>
            <div class="areas-inline">
                ${locations.map(l => `<span class="area-tag">📍 ${l.city}${l.state ? `, ${l.state}` : ''}</span>`).join('')}
            </div>
            <p class="text-center mt-20">
                Don't see your area? Call us at <a href="tel:${phoneClean}">${phone}</a> to confirm service availability.
            </p>
        </div>
    </section>

    <!-- Final CTA -->
    <section class="final-cta-section">
        <div class="container">
            <h2>Get in Touch Today</h2>
            <p>Ready to discuss your ${industry.toLowerCase()} needs? Our friendly team is standing by to help.</p>
            <a href="tel:${phoneClean}" class="mega-cta-btn">
                📞 Call Now: ${phone}
            </a>
        </div>
    </section>
    `;
}

// ==================== CONTACT PAGE ====================
export function generateRichContactContent(info: BusinessInfo): string {
    const { name, industry, city, phone, email, locations } = info;
    const phoneClean = phone.replace(/[^0-9+]/g, '');
    const contactEmail = email || `contact@${name.toLowerCase().replace(/\s+/g, '')}.com`;

    return `
    <!-- Contact Hero -->
    <section class="page-hero">
        <div class="container">
            <h1>Contact ${name}</h1>
            <p class="hero-subtitle">Get in Touch for Fast, Professional ${capitalizeFirst(industry)} Services</p>
            <a href="tel:${phoneClean}" class="hero-phone-btn">
                📞 Call Now: ${phone}
            </a>
        </div>
    </section>

    <!-- Contact Info Section -->
    <section class="content-section">
        <div class="container">
            <div class="contact-grid">
                <div class="contact-info-card">
                    <h2>Reach Us Directly</h2>
                    <p>The fastest way to get help is to call us. Our team is available 24/7 to answer your questions and schedule service.</p>
                    
                    <div class="contact-methods">
                        <div class="contact-method primary">
                            <span class="method-icon">📞</span>
                            <div class="method-details">
                                <span class="method-label">Call Us 24/7</span>
                                <a href="tel:${phoneClean}" class="method-value">${phone}</a>
                            </div>
                        </div>
                        <div class="contact-method">
                            <span class="method-icon">📧</span>
                            <div class="method-details">
                                <span class="method-label">Email Us</span>
                                <a href="mailto:${contactEmail}" class="method-value">${contactEmail}</a>
                            </div>
                        </div>
                        <div class="contact-method">
                            <span class="method-icon">🕐</span>
                            <div class="method-details">
                                <span class="method-label">Business Hours</span>
                                <span class="method-value">24/7 Emergency Service Available</span>
                            </div>
                        </div>
                    </div>

                    <div class="emergency-note">
                        <strong>🚨 Have an Emergency?</strong>
                        <p>For urgent ${industry.toLowerCase()} issues, call us immediately at <a href="tel:${phoneClean}">${phone}</a>. We offer 24/7 emergency service with rapid response times.</p>
                    </div>
                </div>

                <div class="contact-form-card">
                    <h3>Send Us a Message</h3>
                    <p>Fill out the form below and we'll get back to you as soon as possible. For immediate assistance, please call us directly.</p>
                    <form class="contact-form" onsubmit="alert('Form submitted! We will contact you soon.'); return false;">
                        <div class="form-group">
                            <label for="name">Your Name *</label>
                            <input type="text" id="name" name="name" required placeholder="John Smith">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="email">Email Address *</label>
                                <input type="email" id="email" name="email" required placeholder="john@example.com">
                            </div>
                            <div class="form-group">
                                <label for="phone">Phone Number *</label>
                                <input type="tel" id="phone" name="phone" required placeholder="(555) 123-4567">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="service">Service Needed</label>
                            <select id="service" name="service">
                                <option value="">Select a service...</option>
                                ${info.services.map(s => `<option value="${s.slug}">${s.name}</option>`).join('')}
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="message">How Can We Help? *</label>
                            <textarea id="message" name="message" rows="4" required placeholder="Please describe your situation..."></textarea>
                        </div>
                        <button type="submit" class="form-submit-btn">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <!-- Service Areas -->
    <section class="content-section alt-bg">
        <div class="container">
            <div class="text-center mb-40">
                <span class="section-badge">Service Areas</span>
                <h2>Where We Provide Service</h2>
                <p class="section-intro">${name} serves ${city} and the following surrounding areas:</p>
            </div>
            <div class="areas-grid-contact">
                ${locations.map(l => `
                <a href="/locations/${l.slug}" class="area-card-contact">
                    <span class="area-pin">📍</span>
                    <span class="area-name">${l.city}${l.state ? `, ${l.state}` : ''}</span>
                </a>
                `).join('')}
            </div>
            <p class="text-center mt-20">
                Not sure if we service your area? Call <a href="tel:${phoneClean}">${phone}</a> to find out!
            </p>
        </div>
    </section>

    <!-- FAQ Section -->
    <section class="content-section">
        <div class="container">
            <div class="text-center mb-40">
                <span class="section-badge">Common Questions</span>
                <h2>Frequently Asked Questions</h2>
            </div>
            <div class="faq-list">
                <div class="faq-item">
                    <h3>How quickly can you respond?</h3>
                    <p>We offer 24/7 emergency service and strive to respond as quickly as possible. For urgent situations, 
                    we can often have a team at your location within hours. Call <a href="tel:${phoneClean}">${phone}</a> 
                    for current availability.</p>
                </div>
                <div class="faq-item">
                    <h3>Do you provide free estimates?</h3>
                    <p>Yes! We provide free consultations and estimates for all ${industry.toLowerCase()} services. 
                    Call us at <a href="tel:${phoneClean}">${phone}</a> to schedule your free estimate today.</p>
                </div>
                <div class="faq-item">
                    <h3>What forms of payment do you accept?</h3>
                    <p>We accept all major credit cards, cash, and checks. We also work directly with insurance 
                    companies and can help you with your claim.</p>
                </div>
                <div class="faq-item">
                    <h3>Do you offer emergency services?</h3>
                    <p>Absolutely! We understand that ${industry.toLowerCase()} emergencies don't wait for business hours. 
                    Our team is available 24/7 to help with urgent situations. Call <a href="tel:${phoneClean}">${phone}</a> anytime.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Final CTA -->
    <section class="final-cta-section">
        <div class="container">
            <h2>Need ${capitalizeFirst(industry)} Help?</h2>
            <p>Don't wait—call us now for fast, professional service!</p>
            <a href="tel:${phoneClean}" class="mega-cta-btn">
                📞 Call ${phone}
            </a>
        </div>
    </section>
    `;
}

// ==================== SERVICES LISTING PAGE ====================
export function generateRichServicesContent(info: BusinessInfo): string {
    const { name, industry, city, phone, services, locations } = info;
    const phoneClean = phone.replace(/[^0-9+]/g, '');

    return `
    <!-- Services Hero -->
    <section class="page-hero">
        <div class="container">
            <h1>Our ${capitalizeFirst(industry)} Services</h1>
            <p class="hero-subtitle">Complete ${capitalizeFirst(industry)} Solutions for ${city} and Surrounding Areas</p>
            <a href="tel:${phoneClean}" class="hero-phone-btn">
                📞 Call for Service: ${phone}
            </a>
        </div>
    </section>

    <!-- Services Grid -->
    <section class="content-section">
        <div class="container">
            <div class="text-center mb-40">
                <span class="section-badge">What We Offer</span>
                <h2>Professional ${capitalizeFirst(industry)} Services</h2>
                <p class="section-intro">${name} provides comprehensive ${industry.toLowerCase()} services to meet all your needs. 
                Click on any service to learn more, or call us at <a href="tel:${phoneClean}">${phone}</a> to discuss your specific situation.</p>
            </div>
            
            <div class="services-card-grid">
                ${services.map(s => `
                <div class="service-card-lg">
                    <div class="service-card-img">
                        <img 
                            src="https://picsum.photos/seed/${s.slug}/400/200" 
                            alt="${s.name}"
                            loading="lazy"
                        />
                    </div>
                    <div class="service-card-icon">${s.icon}</div>
                    <h3>${s.name}</h3>
                    <p>${s.description}</p>
                    <div class="service-card-actions">
                        <a href="/services/${s.slug}" class="btn-learn-more">Learn More →</a>
                        <a href="tel:${phoneClean}" class="btn-call-service">📞 Call Now</a>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Why Choose Us -->
    <section class="content-section alt-bg">
        <div class="container">
            <div class="text-center mb-40">
                <span class="section-badge">Why ${name}</span>
                <h2>Why Choose Our Services</h2>
            </div>
            <div class="features-row">
                <div class="feature-item">
                    <span class="feature-icon">📞</span>
                    <h4>24/7 Availability</h4>
                    <p>We're here when you need us, day or night.</p>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">⚡</span>
                    <h4>Fast Response</h4>
                    <p>Quick arrival times for all service calls.</p>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">💵</span>
                    <h4>Fair Pricing</h4>
                    <p>Upfront quotes with no hidden fees.</p>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">✅</span>
                    <h4>Quality Work</h4>
                    <p>Professional results guaranteed.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Service Areas -->
    <section class="content-section">
        <div class="container">
            <div class="text-center mb-40">
                <span class="section-badge">Service Areas</span>
                <h2>Where We Provide Services</h2>
            </div>
            <div class="areas-inline">
                ${locations.map(l => `<a href="/locations/${l.slug}" class="area-tag-link">📍 ${l.city}${l.state ? `, ${l.state}` : ''}</a>`).join('')}
            </div>
        </div>
    </section>

    <!-- Final CTA -->
    <section class="final-cta-section">
        <div class="container">
            <h2>Need ${capitalizeFirst(industry)} Service?</h2>
            <p>Call now to speak with a specialist about your needs.</p>
            <a href="tel:${phoneClean}" class="mega-cta-btn">
                📞 Call ${phone}
            </a>
        </div>
    </section>
    `;
}

// ==================== LOCATIONS LISTING PAGE ====================
export function generateRichLocationsContent(info: BusinessInfo): string {
    const { name, industry, city, phone, services, locations } = info;
    const phoneClean = phone.replace(/[^0-9+]/g, '');

    return `
    <!-- Locations Hero -->
    <section class="page-hero">
        <div class="container">
            <h1>Service Areas</h1>
            <p class="hero-subtitle">${capitalizeFirst(industry)} Services Throughout ${city} and Surrounding Areas</p>
            <a href="tel:${phoneClean}" class="hero-phone-btn">
                📞 Call Us: ${phone}
            </a>
        </div>
    </section>

    <!-- Locations Grid -->
    <section class="content-section">
        <div class="container">
            <div class="text-center mb-40">
                <span class="section-badge">Where We Serve</span>
                <h2>Our Service Areas</h2>
                <p class="section-intro">${name} proudly provides professional ${industry.toLowerCase()} services to the following communities. 
                Click on your location to learn more about our services in your area.</p>
            </div>
            
            <div class="locations-card-grid">
                ${locations.map(l => `
                <a href="/locations/${l.slug}" class="location-card-lg">
                    <div class="location-card-img">
                        <img 
                            src="https://picsum.photos/seed/${l.slug}/400/200" 
                            alt="${l.city}${l.state ? `, ${l.state}` : ''}"
                            loading="lazy"
                        />
                    </div>
                    <div class="location-card-pin">📍</div>
                    <h3>${l.city}${l.state ? `, ${l.state}` : ''}</h3>
                    <p>${capitalizeFirst(industry)} services for ${l.city} residents and businesses.</p>
                    <span class="location-card-link">View Services →</span>
                </a>
                `).join('')}
            </div>
            
            <div class="text-center mt-40">
                <p>Don't see your city listed? We may still be able to help!</p>
                <a href="tel:${phoneClean}" class="cta-phone-btn-outline">📞 Call to Confirm: ${phone}</a>
            </div>
        </div>
    </section>

    <!-- Services Available -->
    <section class="content-section alt-bg">
        <div class="container">
            <div class="text-center mb-40">
                <span class="section-badge">Our Services</span>
                <h2>Services Available in All Areas</h2>
                <p class="section-intro">No matter where you're located, ${name} offers the same great services:</p>
            </div>
            <div class="services-list-inline">
                ${services.map(s => `<span class="service-tag">${s.icon} ${s.name}</span>`).join('')}
            </div>
        </div>
    </section>

    <!-- Final CTA -->
    <section class="final-cta-section">
        <div class="container">
            <h2>Need Service in Your Area?</h2>
            <p>Call now to confirm availability and schedule service.</p>
            <a href="tel:${phoneClean}" class="mega-cta-btn">
                📞 Call ${phone}
            </a>
        </div>
    </section>
    `;
}

// ==================== BLOG LISTING PAGE ====================
interface BlogPostInfo {
    title: string;
    slug: string;
    excerpt: string;
    publishedAt: string;
}

export function generateRichBlogContent(info: BusinessInfo, posts: BlogPostInfo[]): string {
    const { name, industry, city, phone } = info;
    const phoneClean = phone.replace(/[^0-9+]/g, '');

    // Generate default blog posts if none provided
    const blogPosts = posts.length > 0 ? posts : getDefaultBlogPosts(industry);

    return `
    <!-- Blog Hero -->
    <section class="page-hero">
        <div class="container">
            <h1>${name} Blog</h1>
            <p class="hero-subtitle">Tips, Guides, and News About ${capitalizeFirst(industry)} Services</p>
            <a href="tel:${phoneClean}" class="hero-phone-btn">
                📞 Questions? Call ${phone}
            </a>
        </div>
    </section>

    <!-- Blog Posts Grid -->
    <section class="content-section">
        <div class="container">
            <div class="blog-card-grid">
                ${blogPosts.map(post => `
                <article class="blog-card">
                    <div class="blog-card-image">
                        <span class="blog-card-icon">📰</span>
                    </div>
                    <div class="blog-card-content">
                        <span class="blog-card-date">${formatDate(post.publishedAt)}</span>
                        <h3><a href="/blog/${post.slug}">${post.title}</a></h3>
                        <p>${post.excerpt}</p>
                        <a href="/blog/${post.slug}" class="blog-read-more">Read More →</a>
                    </div>
                </article>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="content-section alt-bg">
        <div class="container">
            <div class="blog-cta-box">
                <h2>Have Questions About ${capitalizeFirst(industry)}?</h2>
                <p>Our experts are happy to help! Call us for free advice and consultations.</p>
                <a href="tel:${phoneClean}" class="cta-phone-btn">📞 Call ${phone}</a>
            </div>
        </div>
    </section>
    `;
}

// ==================== HELPER FUNCTIONS ====================
function capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getDefaultBlogPosts(industry: string): BlogPostInfo[] {
    const industryPosts: Record<string, BlogPostInfo[]> = {
        'restoration': [
            { title: '5 Signs You Have Hidden Water Damage', slug: '5-signs-hidden-water-damage', excerpt: 'Water damage isn\'t always obvious. Learn the subtle signs that indicate you may have a hidden water problem in your home.', publishedAt: new Date().toISOString() },
            { title: 'What to Do After a Flood: A Step-by-Step Guide', slug: 'what-to-do-after-flood', excerpt: 'Flooding can be overwhelming. Follow these steps to protect your property and start the recovery process.', publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
            { title: 'Mold Prevention Tips for Homeowners', slug: 'mold-prevention-tips', excerpt: 'Prevent mold growth in your home with these essential tips and maintenance practices.', publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() },
        ],
        'plumbing': [
            { title: 'How to Prevent Frozen Pipes This Winter', slug: 'prevent-frozen-pipes', excerpt: 'Frozen pipes can cause major damage. Learn how to protect your plumbing during cold weather.', publishedAt: new Date().toISOString() },
            { title: 'Signs You Need to Replace Your Water Heater', slug: 'water-heater-replacement-signs', excerpt: 'Is your water heater on its last legs? Here are the warning signs to watch for.', publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
            { title: 'DIY vs Professional Plumbing: When to Call a Pro', slug: 'diy-vs-professional-plumbing', excerpt: 'Some plumbing jobs are DIY-friendly, others require a professional. Learn which is which.', publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() },
        ],
    };

    return industryPosts[industry.toLowerCase()] || [
        { title: `Essential ${capitalizeFirst(industry)} Tips for Homeowners`, slug: 'essential-tips', excerpt: `Keep your property in top shape with these professional ${industry.toLowerCase()} tips.`, publishedAt: new Date().toISOString() },
        { title: `When to Call a ${capitalizeFirst(industry)} Professional`, slug: 'when-to-call-professional', excerpt: `Not sure if you need professional help? Here are the signs that it's time to call.`, publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
        { title: `Common ${capitalizeFirst(industry)} Problems and Solutions`, slug: 'common-problems-solutions', excerpt: `Learn about the most common issues and how professionals handle them.`, publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() },
    ];
}

// ==================== PAGE STYLES ====================
export function generatePageCSS(): string {
    return `
    /* Page Hero */
    .page-hero {
        background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
        color: white;
        padding: 80px 0;
        text-align: center;
    }

    .page-hero h1 {
        font-size: 2.5rem;
        font-weight: 800;
        margin-bottom: 10px;
    }

    .hero-subtitle {
        font-size: 1.2rem;
        opacity: 0.9;
        margin-bottom: 25px;
    }

    .hero-phone-btn {
        display: inline-block;
        background: #22c55e;
        color: white;
        padding: 15px 30px;
        border-radius: 10px;
        font-weight: 700;
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .hero-phone-btn:hover {
        background: #16a34a;
        transform: scale(1.05);
    }

    /* Content Sections */
    .content-section {
        padding: 70px 0;
    }

    .content-section.alt-bg {
        background: #f8fafc;
    }

    .text-center { text-align: center; }
    .mb-40 { margin-bottom: 40px; }
    .mt-20 { margin-top: 20px; }
    .mt-30 { margin-top: 30px; }
    .mt-40 { margin-top: 40px; }

    .section-badge {
        display: inline-block;
        background: linear-gradient(135deg, var(--primary), var(--accent));
        color: white;
        padding: 8px 20px;
        border-radius: 50px;
        font-size: 0.85rem;
        font-weight: 600;
        margin-bottom: 15px;
    }

    .section-intro {
        font-size: 1.05rem;
        color: var(--text-light);
        max-width: 700px;
        margin: 0 auto;
        line-height: 1.7;
    }

    /* Values Grid */
    .values-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 25px;
    }

    @media (max-width: 900px) {
        .values-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 600px) {
        .values-grid { grid-template-columns: 1fr; }
    }

    .value-card {
        background: white;
        padding: 30px;
        border-radius: 16px;
        text-align: center;
        box-shadow: 0 5px 20px rgba(0,0,0,0.05);
    }

    .value-icon {
        font-size: 2.5rem;
        display: block;
        margin-bottom: 15px;
    }

    .value-card h3 {
        font-size: 1.1rem;
        margin-bottom: 10px;
    }

    .value-card p {
        color: var(--text-light);
        line-height: 1.6;
    }

    /* Benefits List */
    .benefits-list-alt {
        max-width: 800px;
        margin: 0 auto;
    }

    .benefit-row {
        display: flex;
        gap: 25px;
        padding: 25px 0;
        border-bottom: 1px solid #eee;
    }

    .benefit-icon-lg {
        font-size: 2.5rem;
        flex-shrink: 0;
    }

    .benefit-content h3 {
        margin-bottom: 10px;
    }

    .benefit-content p {
        color: var(--text-light);
        line-height: 1.7;
    }

    /* CTA Box */
    .cta-box-centered {
        text-align: center;
        margin-top: 40px;
        padding: 30px;
        background: #f8fafc;
        border-radius: 16px;
    }

    .cta-phone-btn {
        display: inline-block;
        background: #22c55e;
        color: white;
        padding: 15px 35px;
        border-radius: 10px;
        font-weight: 700;
        font-size: 1.1rem;
        text-decoration: none;
        margin-top: 10px;
        transition: all 0.3s ease;
    }

    .cta-phone-btn:hover {
        background: #16a34a;
        transform: scale(1.05);
    }

    .cta-phone-btn-outline {
        display: inline-block;
        border: 2px solid var(--primary);
        color: var(--primary);
        padding: 12px 30px;
        border-radius: 10px;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .cta-phone-btn-outline:hover {
        background: var(--primary);
        color: white;
    }

    /* Services List Compact */
    .services-list-compact {
        max-width: 700px;
        margin: 0 auto;
    }

    .service-item-compact {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        background: white;
        border-radius: 10px;
        margin-bottom: 10px;
    }

    .service-icon {
        font-size: 1.5rem;
    }

    .service-info {
        flex: 1;
    }

    .service-info h4 {
        margin-bottom: 3px;
    }

    .service-info p {
        color: var(--text-light);
        font-size: 0.9rem;
    }

    .service-call {
        background: #22c55e;
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        text-decoration: none;
    }

    .btn-outline {
        display: inline-block;
        border: 2px solid var(--primary);
        color: var(--primary);
        padding: 12px 25px;
        border-radius: 8px;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .btn-outline:hover {
        background: var(--primary);
        color: white;
    }

    /* Areas Inline */
    .areas-inline {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
    }

    .area-tag {
        background: white;
        padding: 10px 18px;
        border-radius: 50px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }

    .area-tag-link {
        background: white;
        padding: 10px 18px;
        border-radius: 50px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        color: var(--text);
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .area-tag-link:hover {
        background: var(--primary);
        color: white;
    }

    /* Final CTA */
    .final-cta-section {
        background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
        color: white;
        padding: 80px 0;
        text-align: center;
    }

    .final-cta-section h2 {
        font-size: 2rem;
        margin-bottom: 15px;
    }

    .final-cta-section p {
        opacity: 0.9;
        margin-bottom: 25px;
    }

    .mega-cta-btn {
        display: inline-block;
        background: #22c55e;
        color: white;
        padding: 20px 45px;
        border-radius: 12px;
        font-size: 1.2rem;
        font-weight: 700;
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .mega-cta-btn:hover {
        background: #16a34a;
        transform: scale(1.05);
    }

    /* Contact Page */
    .contact-grid {
        display: grid;
        grid-template-columns: 1fr 1.2fr;
        gap: 40px;
    }

    @media (max-width: 900px) {
        .contact-grid { grid-template-columns: 1fr; }
    }

    .contact-info-card {
        background: #f8fafc;
        padding: 35px;
        border-radius: 16px;
    }

    .contact-info-card h2 {
        margin-bottom: 10px;
    }

    .contact-methods {
        margin: 25px 0;
    }

    .contact-method {
        display: flex;
        gap: 15px;
        padding: 15px 0;
        border-bottom: 1px solid #eee;
    }

    .contact-method.primary {
        background: #22c55e;
        color: white;
        padding: 20px;
        border-radius: 12px;
        margin-bottom: 15px;
        border: none;
    }

    .contact-method.primary a {
        color: white;
    }

    .method-icon {
        font-size: 1.5rem;
    }

    .method-label {
        font-size: 0.85rem;
        color: inherit;
        opacity: 0.8;
    }

    .method-value {
        font-weight: 600;
        color: inherit;
        text-decoration: none;
    }

    .emergency-note {
        background: #fff3cd;
        padding: 20px;
        border-radius: 10px;
        margin-top: 20px;
    }

    .contact-form-card {
        background: white;
        padding: 35px;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    }

    .contact-form {
        margin-top: 20px;
    }

    .form-group {
        margin-bottom: 20px;
    }

    .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 12px 15px;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 1rem;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
    }

    .form-submit-btn {
        width: 100%;
        padding: 15px;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .form-submit-btn:hover {
        background: var(--primary-dark);
    }

    .areas-grid-contact {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 15px;
    }

    .area-card-contact {
        display: flex;
        align-items: center;
        gap: 10px;
        background: white;
        padding: 15px 20px;
        border-radius: 10px;
        color: var(--text);
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .area-card-contact:hover {
        background: var(--primary);
        color: white;
    }

    /* FAQ */
    .faq-list {
        max-width: 800px;
        margin: 0 auto;
    }

    .faq-item {
        background: white;
        padding: 25px;
        border-radius: 12px;
        margin-bottom: 15px;
        box-shadow: 0 3px 15px rgba(0,0,0,0.05);
    }

    .faq-item h3 {
        margin-bottom: 10px;
    }

    .faq-item p {
        color: var(--text-light);
        line-height: 1.7;
    }

    .faq-item a {
        color: var(--primary);
        font-weight: 600;
    }

    /* Services Cards */
    .services-card-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 25px;
    }

    @media (max-width: 900px) {
        .services-card-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 600px) {
        .services-card-grid { grid-template-columns: 1fr; }
    }

    .service-card-lg {
        background: white;
        padding: 30px;
        border-radius: 16px;
        text-align: center;
        box-shadow: 0 8px 30px rgba(0,0,0,0.08);
        transition: all 0.3s ease;
    }

    .service-card-lg:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 40px rgba(0,0,0,0.12);
    }

    .service-card-img {
        margin: -30px -30px 20px -30px;
        border-radius: 16px 16px 0 0;
        overflow: hidden;
    }

    .service-card-img img {
        width: 100%;
        height: 180px;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    .service-card-lg:hover .service-card-img img {
        transform: scale(1.05);
    }

    .service-card-icon {
        font-size: 2.5rem;
        margin-bottom: 15px;
    }

    .service-card-lg h3 {
        margin-bottom: 10px;
    }

    .service-card-lg p {
        color: var(--text-light);
        margin-bottom: 20px;
        line-height: 1.6;
    }

    .service-card-actions {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .btn-learn-more {
        display: block;
        padding: 10px;
        border: 1px solid var(--primary);
        color: var(--primary);
        border-radius: 8px;
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .btn-learn-more:hover {
        background: var(--primary);
        color: white;
    }

    .btn-call-service {
        display: block;
        padding: 10px;
        background: #22c55e;
        color: white;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
    }

    /* Features Row */
    .features-row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
    }

    @media (max-width: 768px) {
        .features-row { grid-template-columns: repeat(2, 1fr); }
    }

    .feature-item {
        text-align: center;
        padding: 25px;
    }

    .feature-icon {
        font-size: 2rem;
        display: block;
        margin-bottom: 10px;
    }

    .feature-item h4 {
        margin-bottom: 5px;
    }

    .feature-item p {
        font-size: 0.9rem;
        color: var(--text-light);
    }

    /* Locations Cards */
    .locations-card-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 25px;
    }

    @media (max-width: 900px) {
        .locations-card-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 600px) {
        .locations-card-grid { grid-template-columns: 1fr; }
    }

    .location-card-lg {
        display: block;
        background: white;
        padding: 30px;
        border-radius: 16px;
        text-align: center;
        box-shadow: 0 8px 30px rgba(0,0,0,0.08);
        text-decoration: none;
        color: var(--text);
        transition: all 0.3s ease;
    }

    .location-card-lg:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 40px rgba(0,0,0,0.12);
        background: var(--primary);
        color: white;
    }

    .location-card-img {
        margin: -30px -30px 20px -30px;
        border-radius: 16px 16px 0 0;
        overflow: hidden;
    }

    .location-card-img img {
        width: 100%;
        height: 180px;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    .location-card-lg:hover .location-card-img img {
        transform: scale(1.05);
    }

    .location-card-pin {
        font-size: 2rem;
        margin-bottom: 10px;
    }

    .location-card-lg h3 {
        margin-bottom: 10px;
    }

    .location-card-lg p {
        opacity: 0.8;
        margin-bottom: 15px;
    }

    .location-card-link {
        font-weight: 600;
    }

    .services-list-inline {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 12px;
    }

    .service-tag {
        background: white;
        padding: 12px 20px;
        border-radius: 50px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }

    /* Blog Cards */
    .blog-card-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 30px;
    }

    @media (max-width: 900px) {
        .blog-card-grid { grid-template-columns: 1fr; }
    }

    .blog-card {
        background: white;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 8px 30px rgba(0,0,0,0.08);
        transition: all 0.3s ease;
    }

    .blog-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 40px rgba(0,0,0,0.12);
    }

    .blog-card-image {
        background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
        height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .blog-card-icon {
        font-size: 3rem;
    }

    .blog-card-content {
        padding: 25px;
    }

    .blog-card-date {
        font-size: 0.85rem;
        color: var(--text-light);
    }

    .blog-card-content h3 {
        margin: 10px 0;
    }

    .blog-card-content h3 a {
        color: var(--text);
        text-decoration: none;
    }

    .blog-card-content h3 a:hover {
        color: var(--primary);
    }

    .blog-card-content p {
        color: var(--text-light);
        line-height: 1.6;
        margin-bottom: 15px;
    }

    .blog-read-more {
        color: var(--primary);
        font-weight: 600;
        text-decoration: none;
    }

    .blog-cta-box {
        text-align: center;
        max-width: 600px;
        margin: 0 auto;
        padding: 40px;
    }
    `;
}
