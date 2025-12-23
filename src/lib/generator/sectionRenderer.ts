// Section Renderer - Converts JSON section content to HTML
// This is a pure function: JSON in → HTML out

import {
    PageSection,
    SectionContent,
    HeroSectionContent,
    ServicesSectionContent,
    AboutSectionContent,
    ContactSectionContent,
    CTASectionContent,
    TestimonialsSectionContent,
    LocationsSectionContent,
    GallerySectionContent,
    FAQSectionContent,
    FeaturesSectionContent,
    TrustBadgesSectionContent,
    TextBlockSectionContent,
    ImageSectionContent,
    VideoSectionContent,
    Website,
} from '../types';

import {
    isHeroContent,
    isServicesContent,
    isAboutContent,
    isContactContent,
    isCTAContent,
    isTestimonialsContent,
    isLocationsContent,
    isGalleryContent,
    isFAQContent,
    isFeaturesContent,
    isTextBlockContent,
    isImageContent,
    isVideoContent,
} from '../sectionHelpers';

// ==========================================
// MAIN SECTION RENDERER
// ==========================================

export function renderSectionFromJSON(section: PageSection, website: Website): string {
    const { type, content } = section;

    switch (type) {
        case 'hero':
            if (isHeroContent(content)) {
                return renderHeroSection(content, website);
            }
            break;
        case 'services-grid':
            if (isServicesContent(content)) {
                return renderServicesSection(content, website);
            }
            break;
        case 'about-intro':
            if (isAboutContent(content)) {
                return renderAboutSection(content, website);
            }
            break;
        case 'contact-form':
            if (isContactContent(content)) {
                return renderContactSection(content, website);
            }
            break;
        case 'cta':
            if (isCTAContent(content)) {
                return renderCTASection(content, website);
            }
            break;
        case 'testimonials':
            if (isTestimonialsContent(content)) {
                return renderTestimonialsSection(content, website);
            }
            break;
        case 'locations-list':
            if (isLocationsContent(content)) {
                return renderLocationsSection(content, website);
            }
            break;
        case 'gallery':
            if (isGalleryContent(content)) {
                return renderGallerySection(content);
            }
            break;
        case 'faq':
            if (isFAQContent(content)) {
                return renderFAQSection(content);
            }
            break;
        case 'features':
            if (isFeaturesContent(content)) {
                return renderFeaturesSection(content);
            }
            break;
        case 'text-block':
            if (isTextBlockContent(content)) {
                return renderTextBlockSection(content);
            }
            break;
        case 'image':
            if (isImageContent(content)) {
                return renderImageSection(content);
            }
            break;
        case 'video':
            if (isVideoContent(content)) {
                return renderVideoSection(content);
            }
            break;
    }

    // Fallback for legacy content or unknown types
    return renderLegacySection(section, website);
}

// ==========================================
// INDIVIDUAL SECTION RENDERERS
// ==========================================

function renderHeroSection(content: HeroSectionContent, website: Website): string {
    const phone = website.contactPhone || '';
    const phoneLink = phone.replace(/[^0-9]/g, '');

    return `
    <section class="hero" data-section-type="hero">
      <div class="container">
        <h1>${escapeHtml(content.headline)}</h1>
        <p class="hero-subtitle">${escapeHtml(content.subheadline)}</p>
        <div class="hero-cta">
          ${content.ctaPrimary ? `
            <a href="${content.ctaPrimary.link}" class="btn btn-primary">
              ${escapeHtml(content.ctaPrimary.text)}
            </a>
          ` : ''}
          ${content.ctaSecondary ? `
            <a href="${content.ctaSecondary.link}" class="btn btn-secondary">
              ${escapeHtml(content.ctaSecondary.text)}
            </a>
          ` : ''}
        </div>
        ${content.showPhone && phone ? `
          <div class="phone-number">
            <a href="tel:${phoneLink}">${phone}</a>
          </div>
        ` : ''}
      </div>
    </section>
  `;
}

function renderServicesSection(content: ServicesSectionContent, website: Website): string {
    const servicesHtml = content.services.map(service => `
    <div class="service-card">
      ${service.icon ? `<div class="service-icon">${service.icon}</div>` : ''}
      <h3>${escapeHtml(service.name)}</h3>
      <p>${escapeHtml(service.description)}</p>
      ${service.link ? `<a href="${service.link}" class="service-link">Learn More →</a>` : ''}
    </div>
  `).join('');

    return `
    <section class="services-section" data-section-type="services-grid">
      <div class="container">
        <div class="section-title">
          <h2>${escapeHtml(content.title)}</h2>
          ${content.subtitle ? `<p>${escapeHtml(content.subtitle)}</p>` : ''}
        </div>
        <div class="services-grid">
          ${servicesHtml}
        </div>
      </div>
    </section>
  `;
}

function renderAboutSection(content: AboutSectionContent, website: Website): string {
    const featuresHtml = content.features?.map(feature => `
    <li>
      <span class="icon">${feature.icon}</span>
      <span>${escapeHtml(feature.text)}</span>
    </li>
  `).join('') || '';

    return `
    <section class="about-section" data-section-type="about-intro">
      <div class="container">
        <div class="about-content">
          <div class="about-text">
            <h2>${escapeHtml(content.title)}</h2>
            <div class="about-body">${content.body}</div>
            ${featuresHtml ? `<ul class="features-list">${featuresHtml}</ul>` : ''}
          </div>
          ${content.image ? `
            <div class="about-image">
              <img src="${content.image}" alt="${content.title}" loading="lazy" />
            </div>
          ` : ''}
        </div>
      </div>
    </section>
  `;
}

function renderContactSection(content: ContactSectionContent, website: Website): string {
    const formFieldsHtml = content.formFields?.map(field => `
    <div class="form-group">
      <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
      ${field.type === 'textarea'
            ? `<textarea id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''} rows="4"></textarea>`
            : field.type === 'select'
                ? `<select id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>
              <option value="">Select...</option>
              ${field.options?.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
            </select>`
                : `<input type="${field.type}" id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''} />`
        }
    </div>
  `).join('') || '';

    return `
    <section class="contact-section" data-section-type="contact-form">
      <div class="container">
        <div class="section-title">
          <h2>${escapeHtml(content.title)}</h2>
          ${content.subtitle ? `<p>${escapeHtml(content.subtitle)}</p>` : ''}
        </div>
        <div class="contact-grid">
          <form class="contact-form" action="/api/contact" method="POST">
            ${formFieldsHtml || `
              <div class="form-group">
                <label for="name">Your Name *</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div class="form-group">
                <label for="email">Email Address *</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div class="form-group">
                <label for="message">Message *</label>
                <textarea id="message" name="message" required rows="4"></textarea>
              </div>
            `}
            <button type="submit" class="btn btn-primary">Send Message</button>
          </form>
          <div class="contact-info">
            ${content.phone ? `<p><strong>Phone:</strong> <a href="tel:${content.phone.replace(/[^0-9]/g, '')}">${content.phone}</a></p>` : ''}
            ${content.email ? `<p><strong>Email:</strong> <a href="mailto:${content.email}">${content.email}</a></p>` : ''}
            ${content.address ? `
              <p><strong>Address:</strong><br />
                ${content.address.street}<br />
                ${content.address.city}, ${content.address.state} ${content.address.zip}
              </p>
            ` : ''}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderCTASection(content: CTASectionContent, website: Website): string {
    return `
    <section class="cta-section" data-section-type="cta">
      <div class="container">
        <h2>${escapeHtml(content.headline)}</h2>
        ${content.subheadline ? `<p>${escapeHtml(content.subheadline)}</p>` : ''}
        <div class="cta-buttons">
          <a href="${content.buttonLink}" class="btn btn-${content.variant || 'primary'}">
            ${escapeHtml(content.buttonText)}
          </a>
        </div>
      </div>
    </section>
  `;
}

function renderTestimonialsSection(content: TestimonialsSectionContent, website: Website): string {
    const testimonialsHtml = content.testimonials.map(t => `
    <div class="testimonial-card">
      ${t.image ? `<img src="${t.image}" alt="${escapeHtml(t.name)}" class="testimonial-image" />` : ''}
      <blockquote>"${escapeHtml(t.quote)}"</blockquote>
      <div class="testimonial-author">
        <strong>${escapeHtml(t.name)}</strong>
        ${t.company ? `<span>${escapeHtml(t.company)}</span>` : ''}
      </div>
      ${t.rating ? `<div class="rating">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</div>` : ''}
    </div>
  `).join('');

    return `
    <section class="testimonials-section" data-section-type="testimonials">
      <div class="container">
        <div class="section-title">
          <h2>${escapeHtml(content.title)}</h2>
          ${content.subtitle ? `<p>${escapeHtml(content.subtitle)}</p>` : ''}
        </div>
        <div class="testimonials-grid">
          ${testimonialsHtml}
        </div>
      </div>
    </section>
  `;
}

function renderLocationsSection(content: LocationsSectionContent, website: Website): string {
    const locationsHtml = content.locations.map(loc => `
    <a href="${loc.link || `/locations/${loc.city.toLowerCase().replace(/\s+/g, '-')}`}" class="location-link">
      ${escapeHtml(loc.city)}${loc.state ? `, ${loc.state}` : ''}
    </a>
  `).join('');

    return `
    <section class="locations-section" data-section-type="locations-list">
      <div class="container">
        <div class="section-title">
          <h2>${escapeHtml(content.title)}</h2>
          ${content.subtitle ? `<p>${escapeHtml(content.subtitle)}</p>` : ''}
        </div>
        <div class="locations-grid">
          ${locationsHtml}
        </div>
      </div>
    </section>
  `;
}

function renderGallerySection(content: GallerySectionContent): string {
    const imagesHtml = content.images.map(img => `
    <div class="gallery-item">
      <img src="${img.src}" alt="${escapeHtml(img.alt)}" loading="lazy" />
      ${img.caption ? `<p class="gallery-caption">${escapeHtml(img.caption)}</p>` : ''}
    </div>
  `).join('');

    return `
    <section class="gallery-section" data-section-type="gallery">
      <div class="container">
        ${content.title ? `<div class="section-title"><h2>${escapeHtml(content.title)}</h2></div>` : ''}
        <div class="gallery-grid columns-${content.columns || 3}">
          ${imagesHtml}
        </div>
      </div>
    </section>
  `;
}

function renderFAQSection(content: FAQSectionContent): string {
    const faqsHtml = content.faqs.map((faq, index) => `
    <div class="faq-item">
      <button class="faq-question" aria-expanded="false" aria-controls="faq-answer-${index}">
        ${escapeHtml(faq.question)}
        <span class="faq-icon">+</span>
      </button>
      <div class="faq-answer" id="faq-answer-${index}">
        <p>${escapeHtml(faq.answer)}</p>
      </div>
    </div>
  `).join('');

    return `
    <section class="faq-section" data-section-type="faq">
      <div class="container">
        <div class="section-title">
          <h2>${escapeHtml(content.title)}</h2>
          ${content.subtitle ? `<p>${escapeHtml(content.subtitle)}</p>` : ''}
        </div>
        <div class="faq-list">
          ${faqsHtml}
        </div>
      </div>
    </section>
  `;
}

function renderFeaturesSection(content: FeaturesSectionContent): string {
    const featuresHtml = content.features.map(feature => `
    <div class="feature-card">
      ${feature.icon ? `<div class="feature-icon">${feature.icon}</div>` : ''}
      <h3>${escapeHtml(feature.title)}</h3>
      <p>${escapeHtml(feature.description)}</p>
    </div>
  `).join('');

    return `
    <section class="features-section layout-${content.layout || 'grid'}" data-section-type="features">
      <div class="container">
        <div class="section-title">
          <h2>${escapeHtml(content.title)}</h2>
          ${content.subtitle ? `<p>${escapeHtml(content.subtitle)}</p>` : ''}
        </div>
        <div class="features-grid">
          ${featuresHtml}
        </div>
      </div>
    </section>
  `;
}

function renderTextBlockSection(content: TextBlockSectionContent): string {
    return `
    <section class="text-block-section text-${content.alignment || 'left'}" data-section-type="text-block">
      <div class="container">
        <div class="text-content">
          ${content.content}
        </div>
      </div>
    </section>
  `;
}

function renderImageSection(content: ImageSectionContent): string {
    return `
    <section class="image-section ${content.fullWidth ? 'full-width' : ''}" data-section-type="image">
      <div class="container">
        <figure>
          <img src="${content.src}" alt="${escapeHtml(content.alt)}" loading="lazy" />
          ${content.caption ? `<figcaption>${escapeHtml(content.caption)}</figcaption>` : ''}
        </figure>
      </div>
    </section>
  `;
}

function renderVideoSection(content: VideoSectionContent): string {
    // Handle YouTube and Vimeo
    let embedUrl = content.url;
    if (content.url.includes('youtube.com/watch')) {
        const videoId = new URL(content.url).searchParams.get('v');
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (content.url.includes('youtu.be/')) {
        const videoId = content.url.split('youtu.be/')[1];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (content.url.includes('vimeo.com/')) {
        const videoId = content.url.split('vimeo.com/')[1];
        embedUrl = `https://player.vimeo.com/video/${videoId}`;
    }

    return `
    <section class="video-section" data-section-type="video">
      <div class="container">
        ${content.title ? `<h3>${escapeHtml(content.title)}</h3>` : ''}
        <div class="video-wrapper">
          <iframe 
            src="${embedUrl}${content.autoplay ? '?autoplay=1' : ''}" 
            frameborder="0" 
            allowfullscreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        </div>
      </div>
    </section>
  `;
}

// ==========================================
// LEGACY SECTION RENDERER (backward compat)
// ==========================================

function renderLegacySection(section: PageSection, website: Website): string {
    // Handle old-style sections with Record<string, unknown> content
    const content = section.content as Record<string, unknown>;

    return `
    <section class="legacy-section" data-section-type="${section.type}">
      <div class="container">
        ${content.html || content.content || JSON.stringify(content)}
      </div>
    </section>
  `;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function escapeHtml(text: string): string {
    const escapeMap: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    };
    return text.replace(/[&<>"']/g, char => escapeMap[char] || char);
}
