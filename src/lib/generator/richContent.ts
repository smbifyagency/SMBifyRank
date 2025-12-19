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
