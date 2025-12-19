import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import { getWebsite } from '@/lib/storage';
import { Website } from '@/lib/types';

// Simple inline page renderer that works server-side
function renderSimplePage(website: Website, page: { title: string; slug: string; type: string; content?: unknown[] }): string {
    const colors = website.colors || { primary: '#2563eb', secondary: '#1e40af', accent: '#f59e0b' };
    const phone = website.contactPhone || '';
    const email = website.contactEmail || '';
    const address = website.businessAddress;

    // NAP Schema markup
    const napHtml = address ? `
    <div class="nap-info" itemscope itemtype="https://schema.org/LocalBusiness">
        <meta itemprop="name" content="${website.businessName}" />
        <div itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
            <p><strong>📍 Address:</strong><br>
            <span itemprop="streetAddress">${address.street}</span><br>
            <span itemprop="addressLocality">${address.city}</span>, 
            <span itemprop="addressRegion">${address.state}</span> 
            <span itemprop="postalCode">${address.zip}</span></p>
        </div>
        <p><strong>📞 Phone:</strong> <a href="tel:${phone}" itemprop="telephone">${phone}</a></p>
        <p><strong>✉️ Email:</strong> <a href="mailto:${email}" itemprop="email">${email}</a></p>
    </div>
    ` : '';

    // Map embed
    const mapHtml = address ? `
    <div class="map-container">
        <iframe 
            src="https://www.google.com/maps?q=${encodeURIComponent(address.street + ', ' + address.city + ', ' + address.state + ' ' + address.zip)}&output=embed"
            width="100%" 
            height="300" 
            style="border:0; border-radius: 12px;" 
            allowfullscreen="" 
            loading="lazy">
        </iframe>
    </div>
    ` : '';

    // Generate content based on page type
    let mainContent = '';

    if (page.type === 'home') {
        mainContent = `
        <section class="hero">
            <div class="container">
                <h1>Professional ${website.industry || 'Services'} in ${website.locations?.[0]?.city || 'Your Area'}</h1>
                <p>${website.seoSettings?.siteDescription || `Trusted ${website.industry} services for homes and businesses`}</p>
                <div class="hero-ctas">
                    <a href="tel:${phone}" class="btn btn-primary">📞 Call Now: ${phone}</a>
                    <a href="/contact" class="btn btn-secondary">Get Free Quote</a>
                </div>
            </div>
        </section>
        <section class="services-section">
            <div class="container">
                <h2>Our Services</h2>
                <div class="services-grid">
                    ${website.services?.map(s => `
                    <div class="service-card">
                        <h3>${s.name}</h3>
                        <p>${s.description}</p>
                        <a href="/services/${s.slug}">Learn More →</a>
                    </div>
                    `).join('') || ''}
                </div>
            </div>
        </section>
        <section class="cta-section">
            <div class="container">
                <h2>Need Help Now?</h2>
                <p>Our team is available 24/7 for emergency services.</p>
                <a href="tel:${phone}" class="btn btn-primary btn-large">📞 ${phone}</a>
            </div>
        </section>
        `;
    } else if (page.type === 'contact') {
        mainContent = `
        <section class="page-hero">
            <div class="container"><h1>Contact Us</h1></div>
        </section>
        <section class="contact-content">
            <div class="container">
                <div class="contact-grid">
                    <div class="contact-info">
                        <h2>Get in Touch</h2>
                        ${napHtml}
                    </div>
                    <div class="contact-form">
                        <h2>Request a Quote</h2>
                        <form>
                            <input type="text" placeholder="Your Name" required>
                            <input type="email" placeholder="Your Email" required>
                            <input type="tel" placeholder="Your Phone" required>
                            <textarea placeholder="How can we help?" rows="4" required></textarea>
                            <button type="submit" class="btn btn-primary">Send Message</button>
                        </form>
                    </div>
                </div>
                ${mapHtml}
            </div>
        </section>
        `;
    } else {
        mainContent = `
        <section class="page-hero">
            <div class="container"><h1>${page.title}</h1></div>
        </section>
        <section class="page-content">
            <div class="container">
                <p>Content for ${page.title}</p>
            </div>
        </section>
        `;
    }

    // Navigation
    const navHtml = `
    <header class="header">
        <div class="container">
            <div class="header-inner">
                <a href="/" class="logo">
                    ${website.logoUrl ? `<img src="${website.logoUrl}" alt="${website.businessName}" class="logo-img">` : ''}
                    <span>${website.businessName}</span>
                </a>
                <nav>
                    <a href="/">Home</a>
                    <a href="/about">About</a>
                    <a href="/services">Services</a>
                    <a href="/contact">Contact</a>
                </nav>
                <a href="tel:${phone}" class="header-cta">📞 Call Now</a>
            </div>
        </div>
    </header>
    `;

    // Footer
    const footerHtml = `
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col">
                    <h4>${website.businessName}</h4>
                    ${napHtml}
                </div>
                <div class="footer-col">
                    <h4>Services</h4>
                    ${website.services?.map(s => `<a href="/services/${s.slug}">${s.name}</a>`).join('\n') || ''}
                </div>
                <div class="footer-col">
                    <h4>Quick Links</h4>
                    <a href="/">Home</a>
                    <a href="/about">About</a>
                    <a href="/services">Services</a>
                    <a href="/contact">Contact</a>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; ${new Date().getFullYear()} ${website.businessName}. All rights reserved.</p>
            </div>
        </div>
    </footer>
    `;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.title} | ${website.businessName}</title>
    <meta name="description" content="${website.seoSettings?.siteDescription || ''}">
    <style>
        :root {
            --primary: ${colors.primary};
            --secondary: ${colors.secondary};
            --accent: ${colors.accent};
            --text: ${colors.text || '#1f2937'};
            --bg: ${colors.background || '#ffffff'};
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: var(--text); background: var(--bg); }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .header { background: white; box-shadow: 0 2px 20px rgba(0,0,0,0.1); padding: 15px 0; position: sticky; top: 0; z-index: 1000; }
        .header-inner { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
        .logo { display: flex; align-items: center; gap: 10px; font-size: 1.4rem; font-weight: bold; color: var(--primary); text-decoration: none; }
        .logo-img { height: 40px; width: auto; }
        nav { display: flex; gap: 25px; }
        nav a { color: var(--text); text-decoration: none; font-weight: 500; }
        nav a:hover { color: var(--primary); }
        .header-cta { background: var(--accent); color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; }
        .hero { background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; padding: 100px 0; text-align: center; }
        .hero h1 { font-size: 2.8rem; margin-bottom: 20px; }
        .hero p { font-size: 1.25rem; opacity: 0.9; margin-bottom: 35px; max-width: 700px; margin-left: auto; margin-right: auto; }
        .hero-ctas { display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; }
        .btn { display: inline-block; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; border: none; cursor: pointer; }
        .btn-primary { background: var(--accent); color: white; }
        .btn-secondary { background: white; color: var(--primary); }
        section { padding: 80px 0; }
        section h2 { font-size: 2rem; margin-bottom: 40px; text-align: center; }
        .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
        .service-card { background: white; padding: 30px; border-radius: 16px; box-shadow: 0 5px 30px rgba(0,0,0,0.08); }
        .service-card h3 { color: var(--primary); margin-bottom: 15px; }
        .service-card a { color: var(--accent); font-weight: 600; text-decoration: none; }
        .cta-section { background: var(--primary); color: white; text-align: center; }
        .cta-section h2 { color: white; }
        .contact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; margin-bottom: 40px; }
        .contact-form form { display: flex; flex-direction: column; gap: 15px; }
        .contact-form input, .contact-form textarea { padding: 15px; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; }
        .footer { background: #1a1a2e; color: white; padding: 60px 0 30px; }
        .footer h4 { margin-bottom: 20px; }
        .footer a { color: rgba(255,255,255,0.7); text-decoration: none; display: block; margin-bottom: 10px; }
        .footer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px; }
        .footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); margin-top: 40px; padding-top: 30px; text-align: center; color: rgba(255,255,255,0.5); }
        .page-hero { background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; padding: 60px 0; text-align: center; }
        @media (max-width: 768px) {
            .hero h1 { font-size: 2rem; }
            nav { display: none; }
        }
    </style>
</head>
<body>
    ${navHtml}
    <main>
        ${mainContent}
    </main>
    ${footerHtml}
</body>
</html>`;
}

// GET endpoint for direct download - Chrome will respect Content-Disposition
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const websiteId = searchParams.get('id');

        if (!websiteId) {
            return NextResponse.json({ error: 'Website ID required' }, { status: 400 });
        }

        // Get website from storage
        // Note: This runs on the server, so we need to ensure getWebsite is available
        // For now, we'll return an error indicating client-side approach is needed
        return NextResponse.json({
            error: 'Please use the POST method with website data'
        }, { status: 400 });

    } catch (error) {
        console.error('Download error:', error);
        return NextResponse.json({
            error: 'Failed to download website',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// POST endpoint with proper headers for download
export async function POST(request: NextRequest) {
    try {
        const website: Website = await request.json();

        if (!website || !website.businessName) {
            return NextResponse.json({ error: 'Invalid website data' }, { status: 400 });
        }

        const zip = new JSZip();

        // Add all published pages
        website.pages
            ?.filter(p => p.isPublished)
            .forEach(page => {
                const html = renderSimplePage(website, page);
                const path = page.slug === '' ? 'index.html' : `${page.slug}.html`;
                zip.file(path, html);
            });

        // If no pages, create default pages
        if (!website.pages || website.pages.length === 0) {
            zip.file('index.html', renderSimplePage(website, { title: 'Home', slug: '', type: 'home' }));
            zip.file('about.html', renderSimplePage(website, { title: 'About', slug: 'about', type: 'about' }));
            zip.file('services.html', renderSimplePage(website, { title: 'Services', slug: 'services', type: 'services' }));
            zip.file('contact.html', renderSimplePage(website, { title: 'Contact', slug: 'contact', type: 'contact' }));
        }

        // Add service pages
        website.services?.forEach(service => {
            const html = renderSimplePage(website, {
                title: service.name,
                slug: `services/${service.slug}`,
                type: 'service-single'
            });
            zip.file(`services/${service.slug}.html`, html);
        });

        // Add location pages
        website.locations?.forEach(location => {
            const html = renderSimplePage(website, {
                title: `${website.businessName} in ${location.city}`,
                slug: `locations/${location.slug}`,
                type: 'location'
            });
            zip.file(`locations/${location.slug}.html`, html);
        });

        // Add sitemap
        const baseUrl = website.netlifyUrl || 'https://example.com';
        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
        sitemap += `  <url><loc>${baseUrl}/</loc><priority>1.0</priority></url>\n`;
        sitemap += `  <url><loc>${baseUrl}/about</loc><priority>0.8</priority></url>\n`;
        sitemap += `  <url><loc>${baseUrl}/services</loc><priority>0.9</priority></url>\n`;
        sitemap += `  <url><loc>${baseUrl}/contact</loc><priority>0.7</priority></url>\n`;
        website.services?.forEach(s => {
            sitemap += `  <url><loc>${baseUrl}/services/${s.slug}</loc><priority>0.8</priority></url>\n`;
        });
        website.locations?.forEach(l => {
            sitemap += `  <url><loc>${baseUrl}/locations/${l.slug}</loc><priority>0.8</priority></url>\n`;
        });
        sitemap += `</urlset>`;
        zip.file('sitemap.xml', sitemap);

        // Add robots.txt
        zip.file('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`);

        // Generate ZIP as uint8array
        const zipContent = await zip.generateAsync({
            type: 'uint8array',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 }
        });

        // Create safe filename
        const safeName = (website.name || website.businessName || 'website')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '') || 'website';

        // Return response with proper headers for download
        return new NextResponse(Buffer.from(zipContent), {
            status: 200,
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${safeName}-website.zip"`,
                'Content-Length': zipContent.length.toString(),
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });
    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json({
            error: 'Failed to export website',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
