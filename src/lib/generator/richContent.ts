// Rich Home Page Content Generator - Lead Generation Focus
// Generates 2000+ words of SEO-optimized content with strong phone CTAs

interface BusinessInfo {
    name: string;
    industry: string;
    city: string;
    phone: string;
    services: Array<{ name: string; slug: string; icon: string; description: string }>;
    locations: Array<{ city: string; state?: string; slug: string }>;
}

export function generateRichHomepageContent(info: BusinessInfo): string {
    const { name, industry, city, phone, services, locations } = info;
    const industryKeywords = getIndustryKeywords(industry);
    const phoneClean = phone.replace(/[^0-9+]/g, '');

    return `
    <!-- Emergency Hero Section -->
    <section class="hero-emergency">
        <div class="container">
            <div class="hero-grid">
                <div class="hero-main">
                    <div class="emergency-badge">
                        <span class="pulse"></span>
                        24/7 Emergency Service - Call Now!
                    </div>
                    <h1>${capitalizeFirst(industry)} Services in ${city}</h1>
                    <h2>${name} - Fast Response When You Need It Most</h2>
                    <p class="hero-description">
                        Dealing with ${industryKeywords.commonIssue}? Don't wait - every minute counts! ${name} provides 
                        immediate ${industry.toLowerCase()} services throughout ${city} and surrounding areas. Our team is 
                        standing by right now to help you with ${industryKeywords.heroService}. Call us now for a free 
                        consultation and get the help you need today.
                    </p>
                    
                    <!-- Trust Badges -->
                    <div class="hero-urgency">
                        <span>⚡ Fast Response</span>
                        <span>🆓 Free Estimates</span>
                        <span>🕐 Available 24/7</span>
                    </div>
                </div>
                
                <div class="hero-call-box">
                    <div class="call-box-header">Need Help Right Now?</div>
                    <p>Speak directly with a ${industry.toLowerCase()} specialist who can help you immediately.</p>
                    <a href="tel:${phoneClean}" class="call-box-button">
                        <span class="call-icon">📱</span>
                        <span>
                            <small>Tap to Call</small>
                            <strong>${phone}</strong>
                        </span>
                    </a>
                    <p class="call-box-note">Available 24 hours a day, 7 days a week</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Hero Image Section -->
    <section class="hero-image-section">
        <div class="container">
            <div class="hero-image-wrapper">
                <img 
                    src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&h=600&fit=crop" 
                    alt="${capitalizeFirst(industry)} services in ${city} - ${name} professional team"
                    class="hero-main-image"
                    loading="eager"
                />
                <div class="image-caption">${name} - Professional ${capitalizeFirst(industry)} Services in ${city}</div>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section class="services-pro">
        <div class="container">
            <div class="section-intro">
                <span class="section-label">${industryKeywords.sectionBadge}</span>
                <h2>${capitalizeFirst(industry)} Services in ${city}</h2>
                <p class="intro-text">
                    ${name} offers a full range of ${industry.toLowerCase()} services to meet your needs. Whether you're 
                    dealing with ${industryKeywords.commonIssue} or need ${industryKeywords.commonService}, we're here to help. 
                    Call us now to discuss your situation with one of our experts.
                </p>
            </div>
            
            <div class="services-grid-pro">
                ${services.slice(0, 6).map((s, i) => `
                <div class="service-card-pro" data-delay="${i * 100}">
                    <div class="service-card-image">
                        <img 
                            src="https://picsum.photos/seed/${s.slug}/400/250" 
                            alt="${s.name} services in ${city}"
                            loading="lazy"
                        />
                    </div>
                    <div class="service-icon-box">
                        <span>${s.icon}</span>
                    </div>
                    <h3>${s.name}</h3>
                    <p>${s.description}</p>
                    <a href="tel:${phoneClean}" class="service-call-btn">
                        📞 Call for ${s.name}
                    </a>
                </div>
                `).join('')}
            </div>

            <div class="services-cta-box">
                <h3>Need ${capitalizeFirst(industry)} Help in ${city}?</h3>
                <p>Don't wait - call us now for immediate assistance with any ${industry.toLowerCase()} issue.</p>
                <a href="tel:${phoneClean}" class="big-call-button">
                    📞 Call Now: ${phone}
                </a>
            </div>
        </div>
    </section>

    <!-- Why Call Us Section -->
    <section class="why-choose-pro">
        <div class="container">
            <div class="why-content">
                <span class="section-label">Why Call ${name}?</span>
                <h2>Get ${capitalizeFirst(industry)} Help in ${city} Today</h2>
                <p class="lead-paragraph">
                    When you call ${name}, you'll speak directly with a ${industry.toLowerCase()} specialist who 
                    understands your situation. We'll discuss your needs, answer your questions, and provide a 
                    free estimate over the phone. If you decide to move forward, we can often have someone at 
                    your location the same day.
                </p>
                
                <div class="benefits-grid">
                    <div class="benefit-card">
                        <span class="benefit-icon">📞</span>
                        <h4>Speak to a Real Person</h4>
                        <p>No automated systems - talk directly with a knowledgeable ${industry.toLowerCase()} expert who can answer all your questions.</p>
                    </div>
                    <div class="benefit-card">
                        <span class="benefit-icon">🆓</span>
                        <h4>Free Phone Consultation</h4>
                        <p>Get expert advice and a preliminary estimate over the phone at no cost or obligation.</p>
                    </div>
                    <div class="benefit-card">
                        <span class="benefit-icon">⚡</span>
                        <h4>Same-Day Service Available</h4>
                        <p>For urgent situations, we can often dispatch a team to your location the same day you call.</p>
                    </div>
                    <div class="benefit-card">
                        <span class="benefit-icon">💵</span>
                        <h4>Insurance Billing Assistance</h4>
                        <p>We work with all major insurance companies and can help you navigate the claims process.</p>
                    </div>
                </div>

                <div class="mid-page-cta">
                    <a href="tel:${phoneClean}" class="giant-phone-cta">
                        <span class="cta-icon">📞</span>
                        <span class="cta-text">
                            <span class="cta-label">Call Now for Free Consultation</span>
                            <span class="cta-number">${phone}</span>
                        </span>
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Video Section -->
    <section class="video-section">
        <div class="container">
            <div class="section-intro centered">
                <span class="section-label">See Us In Action</span>
                <h2>Watch How We Handle ${capitalizeFirst(industry)} Projects</h2>
                <p class="intro-text">See our team in action and learn more about our professional ${industry.toLowerCase()} services.</p>
            </div>
            <div class="video-wrapper">
                <iframe 
                    width="560" 
                    height="315" 
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                    title="${capitalizeFirst(industry)} Services in ${city} - ${name}"
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                    loading="lazy"
                ></iframe>
            </div>
            <div class="video-cta">
                <p>Ready to get started? Call us now!</p>
                <a href="tel:${phoneClean}" class="video-call-btn">📞 ${phone}</a>
            </div>
        </div>
    </section>

    <!-- Service Areas -->
    ${locations.length > 0 ? `
    <section class="areas-pro">
        <div class="container">
            <div class="section-intro centered">
                <span class="section-label">Service Areas</span>
                <h2>${capitalizeFirst(industry)} Services Near You</h2>
                <p class="intro-text">
                    ${name} provides ${industry.toLowerCase()} services throughout ${city} and the surrounding areas. 
                    No matter where you're located, we're just a phone call away.
                </p>
            </div>
            
            <div class="areas-grid-pro">
                ${locations.map(l => `
                <a href="/locations/${l.slug}" class="area-card-pro">
                    <span class="area-pin">📍</span>
                    <span class="area-city">${l.city}${l.state ? `, ${l.state}` : ''}</span>
                    <span class="area-arrow">→</span>
                </a>
                `).join('')}
            </div>

            <div class="area-call-cta">
                <p>Located in or near ${city}? Call us now!</p>
                <a href="tel:${phoneClean}" class="area-phone-btn">📞 ${phone}</a>
            </div>
        </div>
    </section>
    ` : ''}

    <!-- What to Expect Section -->
    <section class="process-pro">
        <div class="container">
            <div class="section-intro centered">
                <span class="section-label">What Happens When You Call</span>
                <h2>Simple 3-Step Process</h2>
            </div>
            
            <div class="process-steps">
                <div class="process-step">
                    <div class="step-number">1</div>
                    <div class="step-icon">📞</div>
                    <h3>Call Us Now</h3>
                    <p>Speak directly with a ${industry.toLowerCase()} specialist who will listen to your situation 
                    and answer all your questions.</p>
                </div>
                <div class="process-step">
                    <div class="step-number">2</div>
                    <div class="step-icon">📋</div>
                    <h3>Get a Free Estimate</h3>
                    <p>We'll provide a clear, upfront estimate for the work needed - no hidden fees or surprises.</p>
                </div>
                <div class="process-step">
                    <div class="step-number">3</div>
                    <div class="step-icon">✅</div>
                    <h3>Problem Solved</h3>
                    <p>Our team handles everything from start to finish, getting your property back to normal quickly.</p>
                </div>
            </div>

            <div class="process-cta">
                <p>Ready to get started? The first step is simple:</p>
                <a href="tel:${phoneClean}" class="process-call-btn">
                    📞 Call ${phone}
                </a>
            </div>
        </div>
    </section>

    <!-- Educational Content for SEO -->
    <section class="educational-section">
        <div class="container">
            <div class="edu-grid">
                <div class="edu-card">
                    <h3>Signs You Need ${capitalizeFirst(industry)} Help</h3>
                    <p>If you're experiencing any of these issues, don't wait - call us right away:</p>
                    <ul class="edu-list">
                        <li><span>⚠️</span> ${industryKeywords.sign1}</li>
                        <li><span>⚠️</span> ${industryKeywords.sign2}</li>
                        <li><span>⚠️</span> ${industryKeywords.sign3}</li>
                        <li><span>⚠️</span> ${industryKeywords.sign4}</li>
                        <li><span>⚠️</span> ${industryKeywords.sign5}</li>
                    </ul>
                    <a href="tel:${phoneClean}" class="edu-call-btn">Need Help? Call ${phone}</a>
                </div>
                <div class="edu-card">
                    <h3>Common ${capitalizeFirst(industry)} Problems We Solve</h3>
                    <p>We handle all types of ${industry.toLowerCase()} issues, including:</p>
                    <ul class="edu-list">
                        <li><span>✓</span> ${industryKeywords.cause1}</li>
                        <li><span>✓</span> ${industryKeywords.cause2}</li>
                        <li><span>✓</span> ${industryKeywords.cause3}</li>
                        <li><span>✓</span> ${industryKeywords.cause4}</li>
                        <li><span>✓</span> ${industryKeywords.cause5}</li>
                    </ul>
                    <a href="tel:${phoneClean}" class="edu-call-btn">Get Help Now: ${phone}</a>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-pro">
        <div class="container">
            <div class="section-intro centered">
                <span class="section-label">Questions?</span>
                <h2>Common Questions About Our ${capitalizeFirst(industry)} Services</h2>
                <p class="intro-text">Have questions? Call us at <a href="tel:${phoneClean}">${phone}</a> to speak with a specialist.</p>
            </div>
            
            <div class="faq-grid-pro">
                <div class="faq-item-pro">
                    <h3>How quickly can you respond?</h3>
                    <p>We offer 24/7 emergency service and can often have someone at your location within hours. 
                    Call <a href="tel:${phoneClean}">${phone}</a> now to check availability.</p>
                </div>
                <div class="faq-item-pro">
                    <h3>Do you offer free estimates?</h3>
                    <p>Yes! We provide free phone consultations and on-site estimates. 
                    Call <a href="tel:${phoneClean}">${phone}</a> to get your free estimate today.</p>
                </div>
                <div class="faq-item-pro">
                    <h3>Do you work with insurance?</h3>
                    <p>Absolutely. We work with all major insurance companies and can help with your claim. 
                    Call <a href="tel:${phoneClean}">${phone}</a> to learn more.</p>
                </div>
                <div class="faq-item-pro">
                    <h3>What areas do you serve?</h3>
                    <p>We serve ${city} and surrounding areas including ${locations.slice(0, 3).map(l => l.city).join(', ')}${locations.length > 3 ? ' and more' : ''}. 
                    Call <a href="tel:${phoneClean}">${phone}</a> to confirm.</p>
                </div>
                <div class="faq-item-pro">
                    <h3>What should I do while waiting?</h3>
                    <p>${industryKeywords.waitingAdvice} When you call us at <a href="tel:${phoneClean}">${phone}</a>, we'll walk you through exactly what to do.</p>
                </div>
                <div class="faq-item-pro">
                    <h3>How do I get started?</h3>
                    <p>Simply call us at <a href="tel:${phoneClean}">${phone}</a>. You'll speak with a specialist who will help you right away.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- About Section - Brief -->
    <section class="about-pro">
        <div class="container">
            <div class="about-grid-with-image">
                <div class="about-image-col">
                    <img 
                        src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop" 
                        alt="${name} team providing ${industry.toLowerCase()} services in ${city}"
                        class="about-section-image"
                        loading="lazy"
                    />
                </div>
                <div class="about-content-col">
                    <span class="section-label">About ${name}</span>
                    <h2>Your Trusted ${capitalizeFirst(industry)} Partner in ${city}</h2>
                    <p>
                        ${name} is dedicated to providing top-quality ${industry.toLowerCase()} services to the ${city} 
                        community. When you call us, you'll experience the difference that comes from working with a team 
                        that truly cares about solving your problem quickly and professionally.
                    </p>
                    <p>
                        We handle projects of all sizes, from small residential jobs to large commercial work. Whatever 
                        your ${industry.toLowerCase()} needs, we're here to help. Give us a call today and let us show 
                        you why so many people in ${city} choose ${name}.
                    </p>
                    <a href="tel:${phoneClean}" class="about-call-btn">
                        📞 Call Now: ${phone}
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Final CTA - Strong Call Focus -->
    <section class="final-cta-pro">
        <div class="container">
            <div class="cta-box-pro">
                <h2>Ready to Solve Your ${capitalizeFirst(industry)} Problem?</h2>
                <p>Don't wait another minute. Pick up the phone and call us now!</p>
                <a href="tel:${phoneClean}" class="mega-phone-cta">
                    <span class="mega-icon">📞</span>
                    <span class="mega-content">
                        <span class="mega-label">Call Now - We're Ready to Help!</span>
                        <span class="mega-number">${phone}</span>
                    </span>
                </a>
                <p class="cta-subtext">Free estimates • 24/7 availability • ${city} and surrounding areas</p>
            </div>
        </div>
    </section>

    <!-- Floating Call Button -->
    <a href="tel:${phoneClean}" class="floating-call-btn" aria-label="Call Now">
        📞 <span>Call Now</span>
    </a>
    `;
}

function capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

interface IndustryKeywords {
    professionals: string;
    sectionBadge: string;
    commonIssue: string;
    commonService: string;
    emergencyIssue: string;
    heroService: string;
    damageType: string;
    serviceFeature1: string;
    serviceFeature2: string;
    sign1: string;
    sign2: string;
    sign3: string;
    sign4: string;
    sign5: string;
    cause1: string;
    cause2: string;
    cause3: string;
    cause4: string;
    cause5: string;
    emergencyScenario: string;
    waitingAdvice: string;
}

function getIndustryKeywords(industry: string): IndustryKeywords {
    const keywords: Record<string, IndustryKeywords> = {
        'restoration': {
            professionals: 'restoration technicians',
            sectionBadge: '🔧 Restoration Services',
            commonIssue: 'water damage, fire damage, or mold growth',
            commonService: 'emergency restoration',
            emergencyIssue: 'water damage emergencies',
            heroService: 'water damage restoration, fire damage cleanup, and mold remediation',
            damageType: 'water damage',
            serviceFeature1: 'State-of-the-art drying equipment',
            serviceFeature2: 'Complete moisture detection',
            sign1: 'Visible water pooling or staining on floors and walls',
            sign2: 'Musty odors indicating hidden moisture or mold',
            sign3: 'Peeling paint, bubbling wallpaper, or warped surfaces',
            sign4: 'Increased humidity levels inside the property',
            sign5: 'Discoloration or dark spots on ceilings and walls',
            cause1: 'Burst or leaking pipes and plumbing failures',
            cause2: 'Storm damage and flooding from heavy rainfall',
            cause3: 'Appliance malfunctions (water heaters, washing machines)',
            cause4: 'Roof leaks and foundation cracks',
            cause5: 'Sewage backups and drain overflows',
            emergencyScenario: 'a major water leak that flooded our entire first floor',
            waitingAdvice: 'If safe, turn off the water source and move valuables to a dry area.'
        },
        'plumbing': {
            professionals: 'plumbers',
            sectionBadge: '🔧 Plumbing Services',
            commonIssue: 'leaky pipes, clogged drains, or water heater problems',
            commonService: 'pipe repair and installation',
            emergencyIssue: 'plumbing emergencies',
            heroService: 'pipe repair, drain cleaning, and water heater services',
            damageType: 'plumbing damage',
            serviceFeature1: 'Video camera pipe inspection',
            serviceFeature2: 'Trenchless repair technology',
            sign1: 'Slow draining sinks, tubs, or showers',
            sign2: 'Gurgling sounds coming from drains',
            sign3: 'Water stains on walls or ceilings',
            sign4: 'Unexplained increase in water bills',
            sign5: 'Low water pressure throughout the home',
            cause1: 'Aging pipes and corroded plumbing',
            cause2: 'Tree root infiltration into sewer lines',
            cause3: 'Clogged drains from grease, hair, and debris',
            cause4: 'Frozen pipes during cold weather',
            cause5: 'High water pressure causing pipe stress',
            emergencyScenario: 'a burst pipe in our basement',
            waitingAdvice: 'Shut off the main water supply to prevent further damage.'
        },
        'hvac': {
            professionals: 'HVAC technicians',
            sectionBadge: '❄️ HVAC Services',
            commonIssue: 'AC problems, heating failures, or poor air quality',
            commonService: 'system maintenance and repair',
            emergencyIssue: 'heating or cooling emergencies',
            heroService: 'AC repair, heating installation, and air quality services',
            damageType: 'HVAC issues',
            serviceFeature1: 'Energy efficiency optimization',
            serviceFeature2: 'Complete system diagnostics',
            sign1: 'Unusual noises from heating or cooling units',
            sign2: 'Uneven temperatures throughout the home',
            sign3: 'Increased energy bills without usage changes',
            sign4: 'Poor air quality or dusty conditions',
            sign5: 'System frequently cycling on and off',
            cause1: 'Clogged filters restricting airflow',
            cause2: 'Refrigerant leaks in AC systems',
            cause3: 'Thermostat malfunctions or calibration issues',
            cause4: 'Worn belts, bearings, or motors',
            cause5: 'Ductwork leaks and insulation problems',
            emergencyScenario: 'our AC unit completely stopped working during a heat wave',
            waitingAdvice: 'Check your thermostat settings and circuit breakers first.'
        },
        'roofing': {
            professionals: 'roofing specialists',
            sectionBadge: '🏠 Roofing Services',
            commonIssue: 'leaks, storm damage, or aging shingles',
            commonService: 'roof repair and replacement',
            emergencyIssue: 'roofing emergencies',
            heroService: 'roof repair, replacement, and storm damage restoration',
            damageType: 'roof damage',
            serviceFeature1: 'Comprehensive roof inspections',
            serviceFeature2: 'Premium material options',
            sign1: 'Missing, cracked, or curling shingles',
            sign2: 'Water stains on interior ceilings',
            sign3: 'Daylight visible through the roof boards',
            sign4: 'Granules collecting in gutters',
            sign5: 'Sagging areas on the roof surface',
            cause1: 'Severe weather including hail and high winds',
            cause2: 'Age and natural wear of roofing materials',
            cause3: 'Poor installation or inadequate ventilation',
            cause4: 'Debris accumulation and clogged gutters',
            cause5: 'Tree branches rubbing against the roof',
            emergencyScenario: 'major storm damage that left a section of our roof exposed',
            waitingAdvice: 'If safe, place tarps over exposed areas to minimize water intrusion.'
        },
        'electrical': {
            professionals: 'electricians',
            sectionBadge: '⚡ Electrical Services',
            commonIssue: 'power outages, wiring problems, or circuit issues',
            commonService: 'electrical repairs and upgrades',
            emergencyIssue: 'electrical emergencies',
            heroService: 'electrical repair, panel upgrades, and safety inspections',
            damageType: 'electrical issues',
            serviceFeature1: 'Complete safety inspections',
            serviceFeature2: 'Code-compliant installations',
            sign1: 'Flickering or dimming lights',
            sign2: 'Frequently tripping circuit breakers',
            sign3: 'Burning smell near outlets or switches',
            sign4: 'Warm or discolored wall plates',
            sign5: 'Buzzing sounds from electrical panels',
            cause1: 'Outdated wiring and overloaded circuits',
            cause2: 'Faulty or damaged electrical components',
            cause3: 'Water damage affecting electrical systems',
            cause4: 'Improper DIY electrical work',
            cause5: 'Pest damage to wiring',
            emergencyScenario: 'a complete power outage affecting half of our house',
            waitingAdvice: 'Turn off power at the main breaker if you smell burning.'
        },
        'agency': {
            professionals: 'creative professionals',
            sectionBadge: '🚀 Agency Services',
            commonIssue: 'brand visibility, digital presence, or marketing challenges',
            commonService: 'strategic marketing and branding',
            emergencyIssue: 'urgent marketing needs',
            heroService: 'branding, web design, digital marketing, and creative strategy',
            damageType: 'brand challenges',
            serviceFeature1: 'Data-driven creative strategies',
            serviceFeature2: 'Full-service marketing solutions',
            sign1: 'Declining website traffic or engagement',
            sign2: 'Inconsistent brand messaging across channels',
            sign3: 'Low conversion rates on marketing campaigns',
            sign4: 'Outdated website or visual identity',
            sign5: 'Difficulty standing out from competitors',
            cause1: 'Lack of cohesive brand strategy',
            cause2: 'Outdated digital marketing approaches',
            cause3: 'Poor website user experience',
            cause4: 'Inconsistent content creation',
            cause5: 'Missing target audience alignment',
            emergencyScenario: 'launching a new product and need full marketing support',
            waitingAdvice: 'Gather your brand assets and marketing goals for our initial consultation.'
        },
        'marketing': {
            professionals: 'marketing strategists',
            sectionBadge: '📈 Marketing Services',
            commonIssue: 'low visibility, poor ROI, or stagnant growth',
            commonService: 'digital marketing and growth strategies',
            emergencyIssue: 'urgent campaign needs',
            heroService: 'SEO, PPC advertising, social media marketing, and content strategy',
            damageType: 'marketing challenges',
            serviceFeature1: 'ROI-focused campaign optimization',
            serviceFeature2: 'Multi-channel marketing expertise',
            sign1: 'Low search engine rankings',
            sign2: 'Poor social media engagement',
            sign3: 'High cost per acquisition',
            sign4: 'Declining lead quality',
            sign5: 'Competitors outranking your business',
            cause1: 'Lack of keyword optimization',
            cause2: 'Inconsistent posting schedule',
            cause3: 'Poor targeting in ad campaigns',
            cause4: 'Outdated content strategy',
            cause5: 'Missing analytics and tracking',
            emergencyScenario: 'need to boost sales quickly for an upcoming product launch',
            waitingAdvice: 'Review your current analytics and identify your key performance goals.'
        },
        'landscaping': {
            professionals: 'landscaping experts',
            sectionBadge: '🌿 Landscaping Services',
            commonIssue: 'overgrown yards, dead plants, or drainage problems',
            commonService: 'landscape design and maintenance',
            emergencyIssue: 'urgent yard work needs',
            heroService: 'lawn care, hardscaping, tree services, and irrigation',
            damageType: 'landscape issues',
            serviceFeature1: 'Custom landscape design',
            serviceFeature2: 'Sustainable solutions',
            sign1: 'Brown patches or dead grass',
            sign2: 'Overgrown shrubs blocking walkways',
            sign3: 'Standing water after rainfall',
            sign4: 'Weeds overtaking flower beds',
            sign5: 'Uneven or patchy lawn growth',
            cause1: 'Improper watering or irrigation',
            cause2: 'Poor soil quality or drainage',
            cause3: 'Lack of regular maintenance',
            cause4: 'Wrong plants for your climate',
            cause5: 'Pest or disease infestation',
            emergencyScenario: 'our yard is completely overgrown before a big event',
            waitingAdvice: 'Take photos of your current yard to share with our designers.'
        },
        'legal': {
            professionals: 'attorneys',
            sectionBadge: '⚖️ Legal Services',
            commonIssue: 'legal disputes, contracts, or compliance questions',
            commonService: 'legal consultation and representation',
            emergencyIssue: 'urgent legal matters',
            heroService: 'business law, personal injury, estate planning, and litigation',
            damageType: 'legal challenges',
            serviceFeature1: 'Experienced trial attorneys',
            serviceFeature2: 'Personalized legal strategies',
            sign1: 'Received legal notice or summons',
            sign2: 'Contract disputes with vendors or partners',
            sign3: 'Need to protect intellectual property',
            sign4: 'Estate planning concerns',
            sign5: 'Business compliance questions',
            cause1: 'Unclear contract terms',
            cause2: 'Business partner disagreements',
            cause3: 'Regulatory changes in your industry',
            cause4: 'Personal injury from accidents',
            cause5: 'Family law matters',
            emergencyScenario: 'facing a lawsuit and need immediate legal representation',
            waitingAdvice: 'Gather all relevant documents and correspondence before our consultation.'
        },
        'realestate': {
            professionals: 'real estate agents',
            sectionBadge: '🏡 Real Estate Services',
            commonIssue: 'buying, selling, or finding the perfect property',
            commonService: 'property buying and selling assistance',
            emergencyIssue: 'time-sensitive property needs',
            heroService: 'home buying, selling, property valuation, and market analysis',
            damageType: 'real estate challenges',
            serviceFeature1: 'Local market expertise',
            serviceFeature2: 'Negotiation specialists',
            sign1: 'Ready to sell but unsure of home value',
            sign2: 'Struggling to find the right property',
            sign3: 'Need help navigating the buying process',
            sign4: 'Relocating and need local guidance',
            sign5: 'Investment property opportunities',
            cause1: 'Changing market conditions',
            cause2: 'First-time buyer uncertainty',
            cause3: 'Complex negotiation situations',
            cause4: 'Property inspection concerns',
            cause5: 'Financing and mortgage questions',
            emergencyScenario: 'found our dream home and need to act fast',
            waitingAdvice: 'Have your pre-approval ready and know your must-have features.'
        },
        'automotive': {
            professionals: 'automotive technicians',
            sectionBadge: '🚗 Automotive Services',
            commonIssue: 'engine problems, brake issues, or maintenance needs',
            commonService: 'vehicle repair and maintenance',
            emergencyIssue: 'urgent car repair needs',
            heroService: 'engine repair, brake service, oil changes, and diagnostics',
            damageType: 'automotive issues',
            serviceFeature1: 'State-of-the-art diagnostics',
            serviceFeature2: 'Factory-trained technicians',
            sign1: 'Check engine light is on',
            sign2: 'Strange noises when braking',
            sign3: 'Vehicle pulling to one side',
            sign4: 'Engine running rough or stalling',
            sign5: 'Unusual smells from the car',
            cause1: 'Worn brake pads or rotors',
            cause2: 'Engine sensor malfunctions',
            cause3: 'Transmission problems',
            cause4: 'Suspension wear and damage',
            cause5: 'Battery or electrical issues',
            emergencyScenario: 'my car broke down and won\'t start',
            waitingAdvice: 'Pull over safely and note any warning lights or sounds.'
        },
        'cleaning': {
            professionals: 'cleaning specialists',
            sectionBadge: '✨ Cleaning Services',
            commonIssue: 'dirty spaces, time constraints, or deep cleaning needs',
            commonService: 'residential and commercial cleaning',
            emergencyIssue: 'urgent cleaning needs',
            heroService: 'house cleaning, office cleaning, deep cleaning, and move-out cleaning',
            damageType: 'cleaning challenges',
            serviceFeature1: 'Eco-friendly cleaning products',
            serviceFeature2: 'Trained and insured staff',
            sign1: 'Dust accumulation on surfaces',
            sign2: 'Stained carpets or upholstery',
            sign3: 'Cluttered and disorganized spaces',
            sign4: 'Odors in the home or office',
            sign5: 'Visible mold or mildew',
            cause1: 'Busy schedule limiting cleaning time',
            cause2: 'Moving in or out of a property',
            cause3: 'Post-construction mess',
            cause4: 'Seasonal deep cleaning needs',
            cause5: 'Event preparation requirements',
            emergencyScenario: 'unexpected guests coming and the house is a mess',
            waitingAdvice: 'Clear personal items from surfaces to speed up our cleaning process.'
        },
        'pest': {
            professionals: 'pest control experts',
            sectionBadge: '🐜 Pest Control Services',
            commonIssue: 'insect infestations, rodents, or termite damage',
            commonService: 'pest inspection and extermination',
            emergencyIssue: 'urgent pest infestations',
            heroService: 'pest extermination, termite treatment, and wildlife removal',
            damageType: 'pest damage',
            serviceFeature1: 'Safe, family-friendly treatments',
            serviceFeature2: 'Long-term prevention plans',
            sign1: 'Droppings or urine stains',
            sign2: 'Gnaw marks on wood or wires',
            sign3: 'Strange sounds in walls or attic',
            sign4: 'Visible insects or nests',
            sign5: 'Damaged food packaging',
            cause1: 'Entry points around home foundation',
            cause2: 'Food sources attracting pests',
            cause3: 'Moisture problems creating habitat',
            cause4: 'Overgrown vegetation near the house',
            cause5: 'Seasonal pest migration',
            emergencyScenario: 'discovered a major ant or rodent infestation',
            waitingAdvice: 'Seal food containers and don\'t disturb nests before our arrival.'
        },
        'moving': {
            professionals: 'moving specialists',
            sectionBadge: '📦 Moving Services',
            commonIssue: 'relocating, packing, or furniture transport',
            commonService: 'residential and commercial moving',
            emergencyIssue: 'last-minute moving needs',
            heroService: 'local moving, long-distance moving, packing, and storage',
            damageType: 'moving challenges',
            serviceFeature1: 'Fully insured moves',
            serviceFeature2: 'Professional packing services',
            sign1: 'Upcoming lease ending',
            sign2: 'Purchased a new home',
            sign3: 'Relocating for work',
            sign4: 'Downsizing or upsizing',
            sign5: 'Need temporary storage',
            cause1: 'Job relocation requirements',
            cause2: 'Family size changes',
            cause3: 'Upgrading to a larger space',
            cause4: 'Retirement and downsizing',
            cause5: 'Investment property changes',
            emergencyScenario: 'need to move out quickly due to unexpected circumstances',
            waitingAdvice: 'Start decluttering and create an inventory of items to move.'
        },
        'pool': {
            professionals: 'pool technicians',
            sectionBadge: '🏊 Pool Services',
            commonIssue: 'dirty water, equipment problems, or maintenance needs',
            commonService: 'pool cleaning and maintenance',
            emergencyIssue: 'urgent pool repairs',
            heroService: 'pool cleaning, equipment repair, and water balancing',
            damageType: 'pool issues',
            serviceFeature1: 'Weekly maintenance plans',
            serviceFeature2: 'Equipment installation',
            sign1: 'Cloudy or green water',
            sign2: 'Pump not running properly',
            sign3: 'Pool heater not working',
            sign4: 'Cracks in pool surface',
            sign5: 'Filter pressure problems',
            cause1: 'Improper chemical balance',
            cause2: 'Clogged or dirty filters',
            cause3: 'Pump motor failure',
            cause4: 'Leak in pool structure',
            cause5: 'Algae growth',
            emergencyScenario: 'pool turned green right before a party',
            waitingAdvice: 'Keep the pump running and avoid adding chemicals until we arrive.'
        },
        'spa': {
            professionals: 'spa therapists',
            sectionBadge: '💆 Spa & Wellness',
            commonIssue: 'stress, tension, or wellness goals',
            commonService: 'massage and wellness treatments',
            emergencyIssue: 'self-care needs',
            heroService: 'massage therapy, facials, body treatments, and wellness packages',
            damageType: 'wellness concerns',
            serviceFeature1: 'Licensed therapists',
            serviceFeature2: 'Premium organic products',
            sign1: 'Chronic muscle tension',
            sign2: 'High stress levels',
            sign3: 'Skin concerns',
            sign4: 'Need for relaxation',
            sign5: 'Special occasion pampering',
            cause1: 'Desk job posture issues',
            cause2: 'Athletic training recovery',
            cause3: 'Wedding or event preparation',
            cause4: 'General wellness maintenance',
            cause5: 'Gift for a loved one',
            emergencyScenario: 'desperately need relaxation before an important event',
            waitingAdvice: 'Let us know about any allergies or conditions before your appointment.'
        },
        'remodeling': {
            professionals: 'remodeling contractors',
            sectionBadge: '🔨 Remodeling Services',
            commonIssue: 'outdated spaces, functionality issues, or home improvements',
            commonService: 'home renovation and remodeling',
            emergencyIssue: 'urgent renovation needs',
            heroService: 'kitchen remodeling, bathroom renovation, and whole-home updates',
            damageType: 'renovation challenges',
            serviceFeature1: 'Design-build approach',
            serviceFeature2: 'Quality craftsmanship guarantee',
            sign1: 'Outdated kitchen or bathroom',
            sign2: 'Need more living space',
            sign3: 'Poor room functionality',
            sign4: 'Preparing home for sale',
            sign5: 'Accessibility modifications needed',
            cause1: 'Growing family needs',
            cause2: 'Home aging and wear',
            cause3: 'Energy efficiency updates',
            cause4: 'Style and aesthetic changes',
            cause5: 'Home value improvement',
            emergencyScenario: 'need to update our home quickly before listing it',
            waitingAdvice: 'Create a wish list of features and gather inspiration photos.'
        },
        'flooring': {
            professionals: 'flooring specialists',
            sectionBadge: '🏠 Flooring Services',
            commonIssue: 'worn floors, installation needs, or flooring upgrades',
            commonService: 'floor installation and refinishing',
            emergencyIssue: 'urgent flooring repairs',
            heroService: 'hardwood, tile, carpet, and laminate flooring installation',
            damageType: 'flooring issues',
            serviceFeature1: 'Wide material selection',
            serviceFeature2: 'Expert installation',
            sign1: 'Scratched or worn hardwood',
            sign2: 'Stained or old carpet',
            sign3: 'Cracked or loose tiles',
            sign4: 'Water-damaged floors',
            sign5: 'Squeaky or uneven surfaces',
            cause1: 'Normal wear and aging',
            cause2: 'Water or moisture damage',
            cause3: 'Pet damage to floors',
            cause4: 'Poor original installation',
            cause5: 'Heavy furniture impact',
            emergencyScenario: 'water damage ruined our floors and we need replacement fast',
            waitingAdvice: 'Measure your rooms and decide on your preferred flooring style.'
        },
        'water-restoration': {
            professionals: 'water restoration specialists',
            sectionBadge: '💧 Water Restoration',
            commonIssue: 'flooding, water damage, or burst pipes',
            commonService: 'water extraction and drying',
            emergencyIssue: 'water damage emergencies',
            heroService: 'water extraction, structural drying, and flood cleanup',
            damageType: 'water damage',
            serviceFeature1: 'Industrial water extraction',
            serviceFeature2: 'Advanced drying technology',
            sign1: 'Standing water in your property',
            sign2: 'Wet carpets or flooring',
            sign3: 'Water stains on walls or ceilings',
            sign4: 'Musty or damp odors',
            sign5: 'Warped or buckled flooring',
            cause1: 'Burst or frozen pipes',
            cause2: 'Appliance malfunctions',
            cause3: 'Heavy rain and flooding',
            cause4: 'Roof leaks',
            cause5: 'Sewage backups',
            emergencyScenario: 'our basement flooded after a pipe burst',
            waitingAdvice: 'Turn off the water main and avoid electrical areas.'
        },
        'fire-restoration': {
            professionals: 'fire restoration experts',
            sectionBadge: '🔥 Fire Restoration',
            commonIssue: 'fire damage, smoke damage, or soot cleanup',
            commonService: 'fire damage restoration',
            emergencyIssue: 'fire damage emergencies',
            heroService: 'fire damage cleanup, smoke removal, and structural restoration',
            damageType: 'fire damage',
            serviceFeature1: 'Smoke and soot removal',
            serviceFeature2: 'Odor elimination technology',
            sign1: 'Visible fire or smoke damage',
            sign2: 'Strong smoke odors',
            sign3: 'Soot deposits on surfaces',
            sign4: 'Water damage from firefighting',
            sign5: 'Structural weakening',
            cause1: 'Kitchen fires',
            cause2: 'Electrical malfunctions',
            cause3: 'Heating equipment issues',
            cause4: 'Candles and open flames',
            cause5: 'Lightning strikes',
            emergencyScenario: 'a fire damaged our kitchen and living room',
            waitingAdvice: 'Wait for fire department clearance before entering.'
        },
        'mold-remediation': {
            professionals: 'mold remediation specialists',
            sectionBadge: '🦠 Mold Remediation',
            commonIssue: 'mold growth, musty odors, or water damage',
            commonService: 'mold inspection and removal',
            emergencyIssue: 'mold contamination',
            heroService: 'mold testing, removal, and prevention',
            damageType: 'mold damage',
            serviceFeature1: 'Professional mold testing',
            serviceFeature2: 'Safe containment procedures',
            sign1: 'Visible mold growth',
            sign2: 'Musty or earthy odors',
            sign3: 'Recent water damage',
            sign4: 'Allergic reactions indoors',
            sign5: 'Discoloration on walls or ceilings',
            cause1: 'Water leaks and moisture',
            cause2: 'Poor ventilation',
            cause3: 'High humidity levels',
            cause4: 'Flooding or water damage',
            cause5: 'Condensation problems',
            emergencyScenario: 'discovered extensive mold in our basement',
            waitingAdvice: 'Avoid disturbing the mold and improve ventilation if safe.'
        },
        'garage-door': {
            professionals: 'garage door technicians',
            sectionBadge: '🚪 Garage Door Services',
            commonIssue: 'broken springs, opener problems, or door alignment',
            commonService: 'garage door repair and installation',
            emergencyIssue: 'garage door emergencies',
            heroService: 'spring replacement, opener repair, and new installations',
            damageType: 'garage door issues',
            serviceFeature1: 'Same-day service available',
            serviceFeature2: 'Quality parts warranty',
            sign1: 'Door won\'t open or close properly',
            sign2: 'Loud grinding or squeaking noises',
            sign3: 'Door moves unevenly',
            sign4: 'Broken springs or cables',
            sign5: 'Opener not responding',
            cause1: 'Worn springs and cables',
            cause2: 'Track misalignment',
            cause3: 'Opener motor failure',
            cause4: 'Sensor malfunctions',
            cause5: 'Weather stripping damage',
            emergencyScenario: 'our garage door spring broke and the door won\'t open',
            waitingAdvice: 'Do not attempt to force the door open or fix springs yourself.'
        },
        'locksmith': {
            professionals: 'locksmith specialists',
            sectionBadge: '🔐 Locksmith Services',
            commonIssue: 'lockouts, broken locks, or key problems',
            commonService: 'lock repair and key services',
            emergencyIssue: 'lockout emergencies',
            heroService: 'emergency lockouts, lock changes, and key duplication',
            damageType: 'lock issues',
            serviceFeature1: '24/7 emergency service',
            serviceFeature2: 'Licensed and bonded',
            sign1: 'Locked out of home or car',
            sign2: 'Key stuck or broken in lock',
            sign3: 'Lock won\'t turn properly',
            sign4: 'Need locks rekeyed after moving',
            sign5: 'Security upgrade needed',
            cause1: 'Lost or stolen keys',
            cause2: 'Worn lock mechanisms',
            cause3: 'Break-in damage',
            cause4: 'Moving to new property',
            cause5: 'Outdated security systems',
            emergencyScenario: 'locked out of my house with no spare key',
            waitingAdvice: 'Stay in a safe location and have ID ready for verification.'
        },
        'personal-injury': {
            professionals: 'personal injury attorneys',
            sectionBadge: '⚖️ Personal Injury Law',
            commonIssue: 'accidents, injuries, or insurance claims',
            commonService: 'personal injury representation',
            emergencyIssue: 'injury cases',
            heroService: 'car accidents, slip and fall, medical malpractice, and wrongful death',
            damageType: 'injury claims',
            serviceFeature1: 'Free case evaluation',
            serviceFeature2: 'No fee unless you win',
            sign1: 'Injured in an accident',
            sign2: 'Medical bills piling up',
            sign3: 'Insurance company denying claim',
            sign4: 'Unable to work due to injuries',
            sign5: 'Need help with paperwork',
            cause1: 'Car or truck accidents',
            cause2: 'Slip and fall incidents',
            cause3: 'Medical malpractice',
            cause4: 'Workplace injuries',
            cause5: 'Defective products',
            emergencyScenario: 'injured in a car accident and dealing with insurance',
            waitingAdvice: 'Document everything and seek medical attention first.'
        },
        'family-law': {
            professionals: 'family law attorneys',
            sectionBadge: '👨‍👩‍👧 Family Law',
            commonIssue: 'divorce, custody, or family legal matters',
            commonService: 'family law representation',
            emergencyIssue: 'family legal matters',
            heroService: 'divorce, child custody, adoption, and prenuptial agreements',
            damageType: 'family legal issues',
            serviceFeature1: 'Compassionate representation',
            serviceFeature2: 'Confidential consultations',
            sign1: 'Considering divorce or separation',
            sign2: 'Custody disputes',
            sign3: 'Adoption process',
            sign4: 'Domestic violence concerns',
            sign5: 'Child support issues',
            cause1: 'Marriage dissolution',
            cause2: 'Child custody disagreements',
            cause3: 'Asset division needs',
            cause4: 'Adoption requirements',
            cause5: 'Protection order needs',
            emergencyScenario: 'going through a difficult divorce and custody battle',
            waitingAdvice: 'Gather important documents and create a safe support network.'
        },
        'dental': {
            professionals: 'dental professionals',
            sectionBadge: '🦷 Dental Services',
            commonIssue: 'tooth pain, dental work, or cosmetic concerns',
            commonService: 'dental care and treatment',
            emergencyIssue: 'dental emergencies',
            heroService: 'general dentistry, cosmetic dentistry, and emergency care',
            damageType: 'dental issues',
            serviceFeature1: 'State-of-the-art equipment',
            serviceFeature2: 'Comfortable patient experience',
            sign1: 'Tooth pain or sensitivity',
            sign2: 'Bleeding or swollen gums',
            sign3: 'Cracked or chipped teeth',
            sign4: 'Bad breath concerns',
            sign5: 'Discolored teeth',
            cause1: 'Cavities and decay',
            cause2: 'Gum disease',
            cause3: 'Tooth trauma',
            cause4: 'Poor dental hygiene',
            cause5: 'Grinding or clenching',
            emergencyScenario: 'severe toothache that won\'t go away',
            waitingAdvice: 'Apply a cold compress and avoid hot or cold foods.'
        },
        'chiropractic': {
            professionals: 'chiropractors',
            sectionBadge: '🦴 Chiropractic Care',
            commonIssue: 'back pain, neck pain, or spinal alignment',
            commonService: 'chiropractic adjustments and care',
            emergencyIssue: 'pain relief needs',
            heroService: 'spinal adjustments, pain management, and wellness care',
            damageType: 'pain issues',
            serviceFeature1: 'Gentle adjustment techniques',
            serviceFeature2: 'Comprehensive wellness plans',
            sign1: 'Chronic back or neck pain',
            sign2: 'Headaches and migraines',
            sign3: 'Limited range of motion',
            sign4: 'Poor posture',
            sign5: 'Muscle tension and stiffness',
            cause1: 'Poor posture habits',
            cause2: 'Workplace ergonomics',
            cause3: 'Sports injuries',
            cause4: 'Car accident trauma',
            cause5: 'Repetitive stress',
            emergencyScenario: 'severe back pain affecting my daily life',
            waitingAdvice: 'Apply ice and avoid heavy lifting before your appointment.'
        },
        'pest-control': {
            professionals: 'pest control experts',
            sectionBadge: '🐜 Pest Control Services',
            commonIssue: 'insect infestations, rodents, or termite damage',
            commonService: 'pest inspection and extermination',
            emergencyIssue: 'urgent pest infestations',
            heroService: 'pest extermination, termite treatment, and wildlife removal',
            damageType: 'pest damage',
            serviceFeature1: 'Safe, family-friendly treatments',
            serviceFeature2: 'Long-term prevention plans',
            sign1: 'Droppings or urine stains',
            sign2: 'Gnaw marks on wood or wires',
            sign3: 'Strange sounds in walls or attic',
            sign4: 'Visible insects or nests',
            sign5: 'Damaged food packaging',
            cause1: 'Entry points around home foundation',
            cause2: 'Food sources attracting pests',
            cause3: 'Moisture problems creating habitat',
            cause4: 'Overgrown vegetation near the house',
            cause5: 'Seasonal pest migration',
            emergencyScenario: 'discovered a major ant or rodent infestation',
            waitingAdvice: 'Seal food containers and don\'t disturb nests before our arrival.'
        },
        'auto-repair': {
            professionals: 'automotive technicians',
            sectionBadge: '🚗 Auto Repair Services',
            commonIssue: 'engine problems, brake issues, or maintenance needs',
            commonService: 'vehicle repair and maintenance',
            emergencyIssue: 'urgent car repair needs',
            heroService: 'engine repair, brake service, oil changes, and diagnostics',
            damageType: 'automotive issues',
            serviceFeature1: 'State-of-the-art diagnostics',
            serviceFeature2: 'Factory-trained technicians',
            sign1: 'Check engine light is on',
            sign2: 'Strange noises when braking',
            sign3: 'Vehicle pulling to one side',
            sign4: 'Engine running rough or stalling',
            sign5: 'Unusual smells from the car',
            cause1: 'Worn brake pads or rotors',
            cause2: 'Engine sensor malfunctions',
            cause3: 'Transmission problems',
            cause4: 'Suspension wear and damage',
            cause5: 'Battery or electrical issues',
            emergencyScenario: 'my car broke down and won\'t start',
            waitingAdvice: 'Pull over safely and note any warning lights or sounds.'
        },
        'real-estate': {
            professionals: 'real estate agents',
            sectionBadge: '🏡 Real Estate Services',
            commonIssue: 'buying, selling, or finding the perfect property',
            commonService: 'property buying and selling assistance',
            emergencyIssue: 'time-sensitive property needs',
            heroService: 'home buying, selling, property valuation, and market analysis',
            damageType: 'real estate challenges',
            serviceFeature1: 'Local market expertise',
            serviceFeature2: 'Negotiation specialists',
            sign1: 'Ready to sell but unsure of home value',
            sign2: 'Struggling to find the right property',
            sign3: 'Need help navigating the buying process',
            sign4: 'Relocating and need local guidance',
            sign5: 'Investment property opportunities',
            cause1: 'Changing market conditions',
            cause2: 'First-time buyer uncertainty',
            cause3: 'Complex negotiation situations',
            cause4: 'Property inspection concerns',
            cause5: 'Financing and mortgage questions',
            emergencyScenario: 'found our dream home and need to act fast',
            waitingAdvice: 'Have your pre-approval ready and know your must-have features.'
        }
    };

    return keywords[industry.toLowerCase()] || {
        professionals: 'professionals',
        sectionBadge: '✓ Professional Services',
        commonIssue: 'unexpected problems',
        commonService: 'professional assistance',
        emergencyIssue: 'emergencies',
        heroService: 'professional services for all your needs',
        damageType: 'property damage',
        serviceFeature1: 'Professional equipment',
        serviceFeature2: 'Expert technicians',
        sign1: 'Visible damage or wear',
        sign2: 'Unusual sounds or smells',
        sign3: 'Performance issues',
        sign4: 'Safety concerns',
        sign5: 'Increasing problems over time',
        cause1: 'Normal wear and tear',
        cause2: 'Weather-related damage',
        cause3: 'Lack of maintenance',
        cause4: 'Age of equipment or materials',
        cause5: 'External factors and accidents',
        emergencyScenario: 'an urgent situation requiring immediate attention',
        waitingAdvice: 'Stay safe and avoid attempting repairs yourself.'
    };
}

export function generateRichHomepageCSS(): string {
    return `
    /* Lead Generation Focused Styles */
    
    /* Emergency Hero */
    .hero-emergency {
        background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
        color: white;
        padding: 80px 0 100px;
        position: relative;
    }

    .hero-grid {
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: 60px;
        align-items: center;
    }

    @media (max-width: 900px) {
        .hero-grid {
            grid-template-columns: 1fr;
            gap: 40px;
        }
    }

    .emergency-badge {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        background: rgba(255,100,100,0.9);
        padding: 10px 20px;
        border-radius: 50px;
        font-size: 0.9rem;
        font-weight: 600;
        margin-bottom: 20px;
        animation: pulse-glow 2s infinite;
    }

    @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 0 0 rgba(255,100,100,0.4); }
        50% { box-shadow: 0 0 0 15px rgba(255,100,100,0); }
    }

    .pulse {
        width: 10px;
        height: 10px;
        background: white;
        border-radius: 50%;
        animation: pulse-dot 1s infinite;
    }

    @keyframes pulse-dot {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.5); opacity: 0.5; }
    }

    .hero-main h1 {
        font-size: 2.8rem;
        font-weight: 800;
        margin-bottom: 10px;
        line-height: 1.1;
    }

    .hero-main h2 {
        font-size: 1.3rem;
        font-weight: 500;
        opacity: 0.9;
        margin-bottom: 20px;
    }

    .hero-description {
        font-size: 1.1rem;
        line-height: 1.7;
        opacity: 0.9;
        margin-bottom: 25px;
    }

    /* Big Phone Button */
    .hero-phone-cta {
        margin-bottom: 20px;
    }

    .big-phone-button {
        display: inline-flex;
        align-items: center;
        gap: 15px;
        background: #22c55e;
        color: white;
        padding: 20px 35px;
        border-radius: 15px;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
        box-shadow: 0 8px 25px rgba(34, 197, 94, 0.4);
    }

    .big-phone-button:hover {
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 12px 35px rgba(34, 197, 94, 0.5);
    }

    .phone-ring {
        font-size: 2rem;
        animation: ring 1.5s infinite;
    }

    @keyframes ring {
        0%, 100% { transform: rotate(0); }
        10%, 30% { transform: rotate(15deg); }
        20% { transform: rotate(-15deg); }
        40% { transform: rotate(0); }
    }

    .phone-content {
        display: flex;
        flex-direction: column;
    }

    .phone-label {
        font-size: 0.85rem;
        opacity: 0.9;
    }

    .phone-number {
        font-size: 1.5rem;
        font-weight: 800;
    }

    .hero-urgency {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
        font-weight: 500;
    }

    .hero-urgency span {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    /* Hero Call Box */
    .hero-call-box {
        background: white;
        color: var(--text);
        border-radius: 20px;
        padding: 35px;
        text-align: center;
        box-shadow: 0 25px 50px rgba(0,0,0,0.2);
    }

    .call-box-header {
        font-size: 1.4rem;
        font-weight: 700;
        margin-bottom: 10px;
        color: var(--primary);
    }

    .call-box-button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
        background: #22c55e;
        color: white;
        padding: 18px 30px;
        border-radius: 12px;
        text-decoration: none;
        font-weight: 600;
        margin: 20px 0;
        transition: all 0.3s ease;
    }

    .call-box-button:hover {
        background: #16a34a;
        transform: scale(1.03);
    }

    .call-icon {
        font-size: 1.5rem;
    }

    .call-box-note {
        font-size: 0.85rem;
        color: var(--text-light);
    }

    /* Action Bar */
    .action-bar {
        background: #1a1a2e;
        color: white;
        padding: 15px 0;
    }

    .action-content {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 30px;
        flex-wrap: wrap;
    }

    .action-text {
        font-weight: 500;
    }

    .action-phone {
        background: #22c55e;
        color: white;
        padding: 10px 25px;
        border-radius: 50px;
        font-weight: 700;
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .action-phone:hover {
        background: #16a34a;
        transform: scale(1.05);
    }

    /* Hero Image Section */
    .hero-image-section {
        padding: 60px 0;
        background: #ffffff;
    }

    .hero-image-wrapper {
        text-align: center;
    }

    .hero-main-image {
        width: 100%;
        max-width: 1000px;
        height: auto;
        border-radius: 20px;
        box-shadow: 0 20px 50px rgba(0,0,0,0.15);
    }

    .image-caption {
        margin-top: 15px;
        font-size: 0.9rem;
        color: var(--text-light);
        font-style: italic;
    }

    /* Service Card Images */
    .service-card-image {
        margin: -25px -25px 15px -25px;
        border-radius: 16px 16px 0 0;
        overflow: hidden;
    }

    .service-card-image img {
        width: 100%;
        height: 180px;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    .service-card-pro:hover .service-card-image img {
        transform: scale(1.05);
    }

    /* Video Section */
    .video-section {
        padding: 80px 0;
        background: #f1f5f9;
    }

    .video-wrapper {
        position: relative;
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
        padding-bottom: 45%;
        height: 0;
        overflow: hidden;
        border-radius: 16px;
        box-shadow: 0 15px 40px rgba(0,0,0,0.15);
    }

    .video-wrapper iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 16px;
    }

    .video-cta {
        text-align: center;
        margin-top: 30px;
    }

    .video-cta p {
        margin-bottom: 15px;
        font-size: 1.1rem;
    }

    .video-call-btn {
        display: inline-block;
        background: #22c55e;
        color: white;
        padding: 15px 35px;
        border-radius: 10px;
        font-weight: 700;
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .video-call-btn:hover {
        background: #16a34a;
        transform: scale(1.05);
    }

    /* About Grid with Image */
    .about-grid-with-image {
        display: grid;
        grid-template-columns: 1fr 1.2fr;
        gap: 50px;
        align-items: center;
    }

    @media (max-width: 900px) {
        .about-grid-with-image {
            grid-template-columns: 1fr;
        }
    }

    .about-image-col {
        text-align: center;
    }

    .about-section-image {
        width: 100%;
        max-width: 500px;
        border-radius: 16px;
        box-shadow: 0 15px 40px rgba(0,0,0,0.12);
    }

    .about-content-col {
        padding: 20px 0;
    }

    /* Services */
    .services-pro {
        padding: 80px 0;
        background: #f8fafc;
    }

    .section-intro {
        margin-bottom: 40px;
    }

    .section-intro.centered {
        text-align: center;
    }

    .section-label {
        display: inline-block;
        background: linear-gradient(135deg, var(--primary), var(--accent));
        color: white;
        padding: 8px 20px;
        border-radius: 50px;
        font-size: 0.85rem;
        font-weight: 600;
        margin-bottom: 15px;
    }

    .section-intro h2 {
        font-size: 2.2rem;
        margin-bottom: 15px;
    }

    .intro-text {
        font-size: 1.05rem;
        color: var(--text-light);
        max-width: 800px;
        line-height: 1.7;
    }

    .services-grid-pro {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 25px;
        margin-bottom: 40px;
    }

    @media (max-width: 900px) {
        .services-grid-pro { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 600px) {
        .services-grid-pro { grid-template-columns: 1fr; }
    }

    .service-card-pro {
        background: white;
        border-radius: 16px;
        padding: 25px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.08);
        text-align: center;
        transition: all 0.3s ease;
    }

    .service-card-pro:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 40px rgba(0,0,0,0.12);
    }

    .service-icon-box {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.8rem;
        margin: 0 auto 15px;
    }

    .service-card-pro h3 {
        font-size: 1.1rem;
        margin-bottom: 10px;
    }

    .service-card-pro p {
        color: var(--text-light);
        margin-bottom: 15px;
        font-size: 0.95rem;
        line-height: 1.5;
    }

    .service-call-btn {
        display: inline-block;
        background: #22c55e;
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        font-size: 0.9rem;
        transition: all 0.3s ease;
    }

    .service-call-btn:hover {
        background: #16a34a;
    }

    /* Services CTA Box */
    .services-cta-box {
        text-align: center;
        padding: 40px;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        border-radius: 20px;
        color: white;
    }

    .services-cta-box h3 {
        font-size: 1.6rem;
        margin-bottom: 10px;
    }

    .services-cta-box p {
        opacity: 0.9;
        margin-bottom: 20px;
    }

    .big-call-button {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        background: white;
        color: var(--primary);
        padding: 18px 35px;
        border-radius: 12px;
        font-size: 1.2rem;
        font-weight: 700;
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .big-call-button:hover {
        transform: scale(1.05);
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }

    /* Why Choose */
    .why-choose-pro {
        padding: 80px 0;
        background: white;
    }

    .lead-paragraph {
        font-size: 1.1rem;
        color: var(--text-light);
        margin-bottom: 40px;
        line-height: 1.8;
    }

    .benefits-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 25px;
        margin-bottom: 40px;
    }

    @media (max-width: 768px) {
        .benefits-grid { grid-template-columns: 1fr; }
    }

    .benefit-card {
        background: #f8fafc;
        padding: 30px;
        border-radius: 16px;
        text-align: center;
    }

    .benefit-card .benefit-icon {
        font-size: 2.5rem;
        margin-bottom: 15px;
    }

    .benefit-card h4 {
        font-size: 1.1rem;
        margin-bottom: 10px;
    }

    .benefit-card p {
        color: var(--text-light);
        line-height: 1.6;
    }

    /* Mid Page CTA */
    .mid-page-cta {
        text-align: center;
    }

    .giant-phone-cta {
        display: inline-flex;
        align-items: center;
        gap: 20px;
        background: linear-gradient(135deg, #22c55e, #16a34a);
        color: white;
        padding: 25px 50px;
        border-radius: 20px;
        text-decoration: none;
        transition: all 0.3s ease;
        box-shadow: 0 10px 40px rgba(34, 197, 94, 0.4);
    }

    .giant-phone-cta:hover {
        transform: translateY(-5px) scale(1.02);
        box-shadow: 0 15px 50px rgba(34, 197, 94, 0.5);
    }

    .cta-icon {
        font-size: 2.5rem;
    }

    .cta-text {
        display: flex;
        flex-direction: column;
        text-align: left;
    }

    .cta-label {
        font-size: 0.9rem;
        opacity: 0.9;
    }

    .cta-number {
        font-size: 1.8rem;
        font-weight: 800;
    }

    /* Areas */
    .areas-pro {
        padding: 80px 0;
        background: #f8fafc;
    }

    .areas-grid-pro {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 12px;
        margin-bottom: 30px;
    }

    .area-card-pro {
        display: flex;
        align-items: center;
        gap: 8px;
        background: white;
        padding: 15px 20px;
        border-radius: 10px;
        color: var(--text);
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .area-card-pro:hover {
        background: var(--primary);
        color: white;
    }

    .area-arrow {
        margin-left: auto;
    }

    .area-call-cta {
        text-align: center;
        padding-top: 20px;
    }

    .area-phone-btn {
        display: inline-block;
        background: #22c55e;
        color: white;
        padding: 15px 30px;
        border-radius: 10px;
        font-weight: 700;
        text-decoration: none;
        margin-top: 10px;
        transition: all 0.3s ease;
    }

    .area-phone-btn:hover {
        background: #16a34a;
        transform: scale(1.05);
    }

    /* Process */
    .process-pro {
        padding: 80px 0;
        background: var(--primary);
        color: white;
    }

    .process-pro .section-label {
        background: rgba(255,255,255,0.2);
    }

    .process-pro .intro-text {
        color: rgba(255,255,255,0.8);
    }

    .process-steps {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 30px;
        margin: 40px 0;
    }

    @media (max-width: 768px) {
        .process-steps { grid-template-columns: 1fr; }
    }

    .process-step {
        text-align: center;
        position: relative;
    }

    .step-number {
        position: absolute;
        top: -10px;
        right: 20px;
        font-size: 4rem;
        font-weight: 800;
        opacity: 0.15;
    }

    .step-icon {
        font-size: 2.5rem;
        margin-bottom: 15px;
    }

    .process-step h3 {
        font-size: 1.2rem;
        margin-bottom: 10px;
    }

    .process-step p {
        opacity: 0.9;
        line-height: 1.6;
    }

    .process-cta {
        text-align: center;
    }

    .process-call-btn {
        display: inline-block;
        background: white;
        color: var(--primary);
        padding: 18px 40px;
        border-radius: 12px;
        font-size: 1.2rem;
        font-weight: 700;
        text-decoration: none;
        margin-top: 15px;
        transition: all 0.3s ease;
    }

    .process-call-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }

    /* Educational */
    .educational-section {
        padding: 80px 0;
        background: white;
    }

    .edu-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
    }

    @media (max-width: 768px) {
        .edu-grid { grid-template-columns: 1fr; }
    }

    .edu-card {
        background: #f8fafc;
        border-radius: 16px;
        padding: 30px;
    }

    .edu-card h3 {
        font-size: 1.2rem;
        margin-bottom: 10px;
        color: var(--primary);
    }

    .edu-list {
        list-style: none;
        margin: 15px 0;
    }

    .edu-list li {
        display: flex;
        gap: 10px;
        padding: 8px 0;
        border-bottom: 1px solid #e5e7eb;
    }

    .edu-call-btn {
        display: inline-block;
        background: #22c55e;
        color: white;
        padding: 12px 25px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        margin-top: 15px;
        transition: all 0.3s ease;
    }

    .edu-call-btn:hover {
        background: #16a34a;
    }

    /* FAQ */
    .faq-pro {
        padding: 80px 0;
        background: #f8fafc;
    }

    .faq-grid-pro {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        max-width: 1000px;
        margin: 0 auto;
    }

    @media (max-width: 768px) {
        .faq-grid-pro { grid-template-columns: 1fr; }
    }

    .faq-item-pro {
        background: white;
        padding: 25px;
        border-radius: 14px;
    }

    .faq-item-pro h3 {
        font-size: 1rem;
        margin-bottom: 10px;
    }

    .faq-item-pro p {
        color: var(--text-light);
        line-height: 1.6;
    }

    .faq-item-pro a {
        color: var(--primary);
        font-weight: 600;
    }

    /* About */
    .about-pro {
        padding: 80px 0;
        background: white;
    }

    .about-content-centered {
        max-width: 800px;
        margin: 0 auto;
        text-align: center;
    }

    .about-content-centered p {
        color: var(--text-light);
        margin-bottom: 20px;
        line-height: 1.7;
    }

    .about-call-btn {
        display: inline-block;
        background: #22c55e;
        color: white;
        padding: 18px 35px;
        border-radius: 12px;
        font-size: 1.1rem;
        font-weight: 700;
        text-decoration: none;
        margin-top: 10px;
        transition: all 0.3s ease;
    }

    .about-call-btn:hover {
        background: #16a34a;
        transform: scale(1.05);
    }

    /* Final CTA */
    .final-cta-pro {
        padding: 100px 0;
        background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
        color: white;
    }

    .cta-box-pro {
        text-align: center;
        max-width: 700px;
        margin: 0 auto;
    }

    .cta-box-pro h2 {
        font-size: 2.2rem;
        margin-bottom: 15px;
    }

    .cta-box-pro > p {
        font-size: 1.1rem;
        opacity: 0.9;
        margin-bottom: 25px;
    }

    .mega-phone-cta {
        display: inline-flex;
        align-items: center;
        gap: 20px;
        background: #22c55e;
        color: white;
        padding: 25px 50px;
        border-radius: 20px;
        text-decoration: none;
        transition: all 0.3s ease;
        box-shadow: 0 10px 40px rgba(34, 197, 94, 0.4);
    }

    .mega-phone-cta:hover {
        transform: translateY(-5px) scale(1.02);
        box-shadow: 0 15px 50px rgba(34, 197, 94, 0.5);
    }

    .mega-icon {
        font-size: 2.5rem;
    }

    .mega-content {
        display: flex;
        flex-direction: column;
        text-align: left;
    }

    .mega-label {
        font-size: 0.9rem;
        opacity: 0.9;
    }

    .mega-number {
        font-size: 1.8rem;
        font-weight: 800;
    }

    .cta-subtext {
        margin-top: 20px;
        font-size: 0.95rem;
        opacity: 0.8;
    }

    /* Floating Call Button */
    .floating-call-btn {
        position: fixed;
        bottom: 25px;
        right: 25px;
        background: #22c55e;
        color: white;
        padding: 15px 25px;
        border-radius: 50px;
        text-decoration: none;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 8px;
        z-index: 999;
        box-shadow: 0 8px 25px rgba(34, 197, 94, 0.4);
        animation: float-pulse 2s infinite;
    }

    @keyframes float-pulse {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
    }

    .floating-call-btn:hover {
        background: #16a34a;
        transform: scale(1.1);
    }

    @media (max-width: 768px) {
        .floating-call-btn {
            bottom: 15px;
            right: 15px;
            padding: 12px 20px;
        }
        
        .hero-main h1 { font-size: 2rem; }
        .section-intro h2 { font-size: 1.6rem; }
    }
    `;
}
