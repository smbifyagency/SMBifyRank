// HTML Template Renderer
// Converts website data into static HTML pages

import { Website, Page, PageSection, BrandColors, BlogPost } from '../types';
import { generateRichHomepageContent, generateRichHomepageCSS } from './richContent';
import {
  generateRichAboutContent,
  generateRichContactContent,
  generateRichServicesContent,
  generateRichLocationsContent,
  generateRichBlogContent,
  generatePageCSS
} from './pageContent';

// Generate complete HTML for a page
export function renderPage(website: Website, page: Page): string {
  const baseCSS = generateCSS(website.colors);

  // Determine if this is the home page (by type OR by empty slug)
  const isHomePage = page.type === 'home' || page.slug === '' || page.slug === '/';

  // Determine which rich CSS to use
  let richCSS = '';
  if (isHomePage) {
    richCSS = generateRichHomepageCSS();
  } else if (['about', 'contact', 'services', 'locations', 'blog'].includes(page.type)) {
    richCSS = generatePageCSS();
  }
  const fullCSS = baseCSS + richCSS;

  // Get business info for generators
  const businessInfo = {
    name: website.businessName,
    industry: website.industry,
    city: website.locations[0]?.city || 'Your Area',
    phone: website.contactPhone || '(555) 123-4567',
    email: website.contactEmail,
    services: website.services.map(s => ({
      name: s.name,
      slug: s.slug,
      icon: s.icon || '✓',
      description: s.description
    })),
    locations: website.locations.map(l => ({
      city: l.city,
      state: l.state,
      slug: l.slug
    }))
  };

  // Generate content based on page type (with home page fallback by slug)
  let mainContent: string;

  // Home page - detect by type OR by empty slug
  if (isHomePage) {
    mainContent = generateRichHomepageContent(businessInfo);
  } else {
    switch (page.type) {
      case 'about':
        mainContent = generateRichAboutContent(businessInfo);
        break;
      case 'contact':
        mainContent = generateRichContactContent(businessInfo);
        break;
      case 'services':
        mainContent = generateRichServicesContent(businessInfo);
        break;
      case 'locations':
        mainContent = generateRichLocationsContent(businessInfo);
        break;
      case 'blog':
        mainContent = generateRichBlogContent(businessInfo, website.blogPosts.map(p => ({
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt,
          publishedAt: p.publishedAt
        })));
        break;
      default:
        // Fall back to section-based rendering
        mainContent = page.content
          .sort((a, b) => a.order - b.order)
          .map(section => renderSection(section, website))
          .join('\n');
    }
  }

  // Build canonical URL
  const baseUrl = website.netlifyUrl || '';
  const canonicalUrl = page.slug ? `${baseUrl}/${page.slug}` : baseUrl || '/';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.seo.title}</title>
  <meta name="description" content="${page.seo.description}">
  <meta name="keywords" content="${page.seo.keywords.join(', ')}">
  
  <!-- Canonical URL -->
  <link rel="canonical" href="${canonicalUrl}">
  
  <!-- Open Graph Tags -->
  <meta property="og:title" content="${page.seo.title}">
  <meta property="og:description" content="${page.seo.description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${page.seo.ogImage || website.logoUrl || ''}">
  <meta property="og:site_name" content="${website.businessName}">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${page.seo.title}">
  <meta name="twitter:description" content="${page.seo.description}">
  <meta name="twitter:image" content="${page.seo.ogImage || website.logoUrl || ''}">
  
  <!-- Favicon -->
  <link rel="icon" href="${website.logoUrl || '/favicon.ico'}" type="image/x-icon">
  <link rel="apple-touch-icon" href="${website.logoUrl || '/favicon.ico'}">
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>${fullCSS}</style>
</head>
<body>
  ${renderHeader(website)}
  <main>
    ${mainContent}
  </main>
  ${renderFooter(website)}
  <script>${generateJS()}</script>
</body>
</html>`;
}

// Generate CSS with brand colors
export function generateCSS(colors: BrandColors): string {
  return `
    :root {
      --primary: ${colors.primary};
      --secondary: ${colors.secondary};
      --accent: ${colors.accent};
      --bg: ${colors.background};
      --text: ${colors.text};
      --text-light: ${adjustColor(colors.text, 40)};
      --primary-dark: ${adjustColor(colors.primary, -20)};
      --primary-light: ${adjustColor(colors.primary, 20)};
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: var(--text);
      background: var(--bg);
    }
    
    a {
      color: var(--primary);
      text-decoration: none;
      transition: color 0.3s ease;
    }
    
    a:hover {
      color: var(--primary-dark);
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    /* Header */
    .header {
      background: var(--bg);
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    
    .header-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 0;
    }
    
    .logo {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--primary);
    }
    
    .nav {
      display: flex;
      gap: 30px;
    }
    
    .nav a {
      color: var(--text);
      font-weight: 500;
      transition: color 0.3s ease;
    }
    
    .nav a:hover {
      color: var(--primary);
    }
    
    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 5px;
    }
    
    /* Logo Styling */
    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
    }
    
    .logo-icon {
      width: 45px;
      height: 45px;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 800;
      font-size: 1rem;
    }
    
    .logo-image {
      height: 45px;
      width: auto;
      object-fit: contain;
    }
    
    .logo-text {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text);
    }
    
    /* Navigation Dropdown */
    .nav {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .nav-link {
      display: inline-block;
      padding: 10px 15px;
      color: var(--text);
      font-weight: 500;
      transition: color 0.3s ease;
      text-decoration: none;
    }
    
    .nav-link:hover {
      color: var(--primary);
    }
    
    .nav-dropdown {
      position: relative;
    }
    
    .dropdown-toggle {
      cursor: pointer;
    }
    
    .dropdown-toggle .arrow {
      font-size: 0.7rem;
      margin-left: 4px;
      transition: transform 0.3s ease;
    }
    
    .nav-dropdown:hover .arrow {
      transform: rotate(180deg);
    }
    
    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      background: white;
      min-width: 240px;
      border-radius: 12px;
      box-shadow: 0 15px 40px rgba(0,0,0,0.15);
      padding: 10px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(10px);
      transition: all 0.3s ease;
      z-index: 1000;
    }
    
    .nav-dropdown:hover .dropdown-menu {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 15px;
      color: var(--text);
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.2s ease;
    }
    
    .dropdown-item:hover {
      background: #f0f7ff;
      color: var(--primary);
    }
    
    .dropdown-icon {
      font-size: 1.1rem;
    }
    
    .dropdown-item.view-all {
      border-top: 1px solid #eee;
      margin-top: 8px;
      padding-top: 15px;
      color: var(--primary);
      font-weight: 600;
    }
    
    /* Header Actions */
    .header-actions {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .header-phone {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text);
      font-weight: 600;
      text-decoration: none;
    }
    
    .header-phone:hover {
      color: var(--primary);
    }
    
    .phone-icon {
      font-size: 1.2rem;
    }
    
    /* Mobile Menu */
    .mobile-menu {
      display: none;
      flex-direction: column;
      background: white;
      border-top: 1px solid #eee;
      padding: 15px 20px;
    }
    
    .mobile-menu.active {
      display: flex;
    }
    
    .mobile-menu a {
      padding: 12px 0;
      color: var(--text);
      text-decoration: none;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .mobile-submenu {
      padding-left: 20px !important;
      font-size: 0.9rem;
      color: var(--text-light) !important;
    }
    
    .mobile-phone {
      margin-top: 10px;
      color: var(--primary) !important;
      font-weight: 600;
    }
    
    /* Header CTA Button */
    .header-cta {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--primary);
      color: white !important;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1rem;
      text-decoration: none;
      transition: all 0.3s ease;
    }
    
    .header-cta:hover {
      background: var(--primary-dark);
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    }
    
    /* Hero Section */
    .hero {
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      color: white;
      padding: 100px 0;
      text-align: center;
    }
    
    .hero h1 {
      font-size: 3.5rem;
      font-weight: 800;
      margin-bottom: 20px;
      line-height: 1.2;
    }
    
    .hero p {
      font-size: 1.25rem;
      opacity: 0.9;
      max-width: 600px;
      margin: 0 auto 30px;
    }
    
    .hero-cta {
      display: inline-flex;
      gap: 15px;
      flex-wrap: wrap;
      justify-content: center;
    }
    
    .btn {
      display: inline-block;
      padding: 15px 30px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1rem;
      transition: all 0.3s ease;
      cursor: pointer;
      border: none;
    }
    
    .btn-primary {
      background: white;
      color: var(--primary);
    }
    
    .btn-primary:hover {
      background: var(--bg);
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    
    .btn-secondary {
      background: rgba(255,255,255,0.2);
      color: white;
      border: 2px solid white;
    }
    
    .btn-secondary:hover {
      background: white;
      color: var(--primary);
    }
    
    .btn-accent {
      background: var(--accent);
      color: white;
    }
    
    .btn-accent:hover {
      background: ${adjustColor('#f59e0b', -15)};
      transform: translateY(-2px);
    }
    
    .phone-number {
      display: block;
      font-size: 2rem;
      font-weight: 800;
      margin-top: 20px;
    }
    
    .phone-number a {
      color: white;
    }
    
    /* Sections */
    section {
      padding: 80px 0;
    }
    
    .section-title {
      text-align: center;
      margin-bottom: 50px;
    }
    
    .section-title h2 {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--text);
      margin-bottom: 15px;
    }
    
    .section-title p {
      color: var(--text-light);
      font-size: 1.1rem;
      max-width: 600px;
      margin: 0 auto;
    }
    
    /* Services Grid */
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
    }
    
    .service-card {
      background: white;
      border-radius: 16px;
      padding: 30px;
      box-shadow: 0 5px 30px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
      border: 1px solid #eee;
    }
    
    .service-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(0,0,0,0.12);
    }
    
    .service-icon {
      font-size: 2.5rem;
      margin-bottom: 15px;
    }
    
    .service-card h3 {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 10px;
      color: var(--text);
    }
    
    .service-card p {
      color: var(--text-light);
      line-height: 1.7;
      margin-bottom: 15px;
    }
    
    .service-card a {
      color: var(--primary);
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }
    
    /* About Section */
    .about-section {
      background: #f8f9fa;
    }
    
    .about-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 50px;
      align-items: center;
    }
    
    .about-text h2 {
      font-size: 2rem;
      margin-bottom: 20px;
    }
    
    .about-text p {
      color: var(--text-light);
      margin-bottom: 20px;
      line-height: 1.8;
    }
    
    .features-list {
      list-style: none;
    }
    
    .features-list li {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
      font-weight: 500;
    }
    
    .features-list .icon {
      color: var(--primary);
      font-weight: bold;
    }
    
    /* Locations */
    .locations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 15px;
    }
    
    .location-link {
      display: block;
      padding: 15px 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      color: var(--text);
      font-weight: 500;
      transition: all 0.3s ease;
      border: 1px solid #eee;
    }
    
    .location-link:hover {
      background: var(--primary);
      color: white;
      transform: translateY(-2px);
    }
    
    /* CTA Section */
    .cta-section {
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      color: white;
      text-align: center;
    }
    
    .cta-section h2 {
      font-size: 2.5rem;
      margin-bottom: 15px;
    }
    
    .cta-section p {
      opacity: 0.9;
      margin-bottom: 30px;
      font-size: 1.1rem;
    }
    
    .cta-buttons {
      display: flex;
      gap: 15px;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    /* Contact Form */
    .contact-section {
      background: #f8f9fa;
    }
    
    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 50px;
    }
    
    .contact-form {
      background: white;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 5px 30px rgba(0,0,0,0.08);
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: var(--text);
    }
    
    .form-group input,
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: 12px 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      font-family: inherit;
      transition: border-color 0.3s ease;
    }
    
    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      outline: none;
      border-color: var(--primary);
    }
    
    .form-group textarea {
      min-height: 120px;
      resize: vertical;
    }
    
    .contact-info h3 {
      font-size: 1.5rem;
      margin-bottom: 20px;
    }
    
    .contact-info p {
      margin-bottom: 15px;
      color: var(--text-light);
    }
    
    .contact-info a {
      color: var(--primary);
      font-weight: 600;
    }
    
    /* Trust Badges */
    .trust-badges {
      display: flex;
      justify-content: center;
      gap: 40px;
      flex-wrap: wrap;
      padding: 40px 0;
    }
    
    .badge {
      text-align: center;
    }
    
    .badge-icon {
      font-size: 2.5rem;
      margin-bottom: 10px;
    }
    
    .badge-text {
      font-weight: 600;
      color: var(--text);
    }
    
    /* Blog */
    .blog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 30px;
    }
    
    .blog-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 5px 30px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
    }
    
    .blog-card:hover {
      transform: translateY(-5px);
    }
    
    .blog-card-content {
      padding: 25px;
    }
    
    .blog-card h3 {
      font-size: 1.25rem;
      margin-bottom: 10px;
    }
    
    .blog-card p {
      color: var(--text-light);
      margin-bottom: 15px;
    }
    
    .blog-date {
      color: var(--text-light);
      font-size: 0.875rem;
    }
    
    /* Custom Content */
    .custom-content {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .custom-content h2 {
      font-size: 1.75rem;
      margin: 30px 0 15px;
      color: var(--text);
    }
    
    .custom-content h3 {
      font-size: 1.25rem;
      margin: 25px 0 10px;
      color: var(--text);
    }
    
    .custom-content p {
      margin-bottom: 15px;
      color: var(--text-light);
      line-height: 1.8;
    }
    
    .custom-content ul,
    .custom-content ol {
      margin: 15px 0;
      padding-left: 25px;
      color: var(--text-light);
    }
    
    .custom-content li {
      margin-bottom: 8px;
      line-height: 1.7;
    }
    
    /* Footer */
    .footer {
      background: #1a1a2e;
      color: white;
      padding: 60px 0 30px;
    }
    
    .footer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 40px;
      margin-bottom: 40px;
    }
    
    .footer-col h4 {
      font-size: 1.1rem;
      margin-bottom: 20px;
      color: white;
    }
    
    .footer-col ul {
      list-style: none;
    }
    
    .footer-col li {
      margin-bottom: 10px;
    }
    
    .footer-col a {
      color: rgba(255,255,255,0.7);
      transition: color 0.3s ease;
    }
    
    .footer-col a:hover {
      color: white;
    }
    
    .footer-bottom {
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 30px;
      text-align: center;
      color: rgba(255,255,255,0.5);
    }
    
    /* Footer Map */
    .footer-map {
      margin-bottom: 40px;
    }
    
    .footer-logo-image {
      height: 50px;
      width: auto;
      object-fit: contain;
    }
    
    /* NAP (Name, Address, Phone) Markup */
    .nap-info {
      margin-top: 20px;
    }
    
    .nap-info address {
      font-style: normal;
      line-height: 1.6;
    }
    
    .nap-address {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
    }
    
    .nap-address .address-icon {
      font-size: 1.2rem;
    }
    
    .nap-phone, .nap-email {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }
    
    .nap-phone a, .nap-email a {
      color: rgba(255,255,255,0.8);
    }
    
    .nap-phone a:hover, .nap-email a:hover {
      color: white;
    }
    
    /* Contact Page NAP */
    .contact-nap {
      background: #f8f9fa;
      padding: 30px;
      border-radius: 12px;
      margin: 30px 0;
    }
    
    .contact-nap h3 {
      margin-bottom: 20px;
      color: var(--text);
    }
    
    .contact-nap p {
      margin-bottom: 12px;
      color: var(--text-light);
      line-height: 1.7;
    }
    
    .contact-nap a {
      color: var(--primary);
      font-weight: 600;
    }
    
    /* Contact Map */
    .contact-map {
      margin: 40px 0;
    }
    
    .contact-map h3 {
      margin-bottom: 20px;
      font-size: 1.5rem;
      color: var(--text);
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .nav {
        display: none;
      }
      
      .mobile-menu-btn {
        display: block;
      }
      
      .hero h1 {
        font-size: 2.5rem;
      }
      
      .about-content,
      .contact-grid {
        grid-template-columns: 1fr;
      }
      
      section {
        padding: 50px 0;
      }
    }
  `;
}

// Adjust color brightness
function adjustColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;

  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
}

// Render header with enhanced navigation
export function renderHeader(website: Website): string {
  const navPages = website.pages
    .filter(p => ['home', 'about', 'services', 'contact', 'blog'].includes(p.type))
    .sort((a, b) => a.order - b.order)
    .slice(0, 5);

  // Get initials for logo
  const words = website.businessName.split(' ').filter(w => w.length > 0);
  const initials = words.length === 1 ? words[0].substring(0, 2).toUpperCase() : words.slice(0, 2).map(w => w[0]).join('').toUpperCase();

  // Build services dropdown
  const servicesHtml = website.services.slice(0, 8).map(s =>
    `<a href="/services/${s.slug}" class="dropdown-item"><span class="dropdown-icon">${s.icon}</span>${s.name}</a>`
  ).join('');

  // Build locations dropdown
  const locationsHtml = website.locations.slice(0, 8).map(l =>
    `<a href="/locations/${l.slug}" class="dropdown-item"><span class="dropdown-icon">📍</span>${l.city}${l.state ? `, ${l.state}` : ''}</a>`
  ).join('');

  const phone = website.contactPhone || '(555) 123-4567';

  // Logo - use image if provided, otherwise use initials
  const logoHtml = website.logoUrl
    ? `<img src="${website.logoUrl}" alt="${website.businessName}" class="logo-image" />`
    : `<div class="logo-icon">${initials}</div>`;

  return `
    <header class="header">
      <div class="container">
        <div class="header-inner">
          <a href="/" class="logo">
            ${logoHtml}
            <span class="logo-text">${website.businessName}</span>
          </a>
          <nav class="nav">
            <a href="/" class="nav-link">Home</a>
            <a href="/about" class="nav-link">About</a>
            <div class="nav-dropdown">
              <a href="/services" class="nav-link dropdown-toggle">Services <span class="arrow">▼</span></a>
              <div class="dropdown-menu">
                ${servicesHtml}
                <a href="/services" class="dropdown-item view-all">View All Services →</a>
              </div>
            </div>
            ${website.locations.length > 0 ? `
            <div class="nav-dropdown">
              <a href="#" class="nav-link dropdown-toggle">Areas <span class="arrow">▼</span></a>
              <div class="dropdown-menu">
                ${locationsHtml}
              </div>
            </div>
            ` : ''}
            <a href="/blog" class="nav-link">Blog</a>
            <a href="/contact" class="nav-link">Contact</a>
          </nav>
          <div class="header-actions">
            <a href="tel:${phone.replace(/[^0-9+]/g, '')}" class="header-cta">📞 Call Now</a>
          </div>
          <button class="mobile-menu-btn" onclick="toggleMobileMenu()" aria-label="Menu">☰</button>
        </div>
      </div>
      <div class="mobile-menu" id="mobileMenu">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/services">Services</a>
        ${website.services.slice(0, 4).map(s => `<a href="/services/${s.slug}" class="mobile-submenu">${s.name}</a>`).join('')}
        <a href="/blog">Blog</a>
        <a href="/contact">Contact</a>
        <a href="tel:${phone.replace(/[^0-9+]/g, '')}" class="mobile-phone">📞 ${phone}</a>
      </div>
    </header>
  `;
}

// Render footer
export function renderFooter(website: Website): string {
  // Get initials for logo
  const words = website.businessName.split(' ').filter(w => w.length > 0);
  const initials = words.length === 1 ? words[0].substring(0, 2).toUpperCase() : words.slice(0, 2).map(w => w[0]).join('').toUpperCase();

  const serviceLinks = website.services
    .slice(0, 6)
    .map(s => `<li><a href="/services/${s.slug}">${s.name}</a></li>`)
    .join('');

  const locationLinks = website.locations
    .slice(0, 6)
    .map(l => `<li><a href="/locations/${l.slug}">${l.city}${l.state ? `, ${l.state}` : ''}</a></li>`)
    .join('');

  const phone = website.contactPhone || '(555) 123-4567';
  const email = website.contactEmail || 'info@example.com';
  const address = website.businessAddress;

  // Generate NAP (Name, Address, Phone) markup for Google SEO
  const napMarkup = address ? `
    <div class="nap-info" itemscope itemtype="https://schema.org/LocalBusiness">
      <meta itemprop="name" content="${website.businessName}" />
      <div class="nap-address" itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
        <span class="address-icon">📍</span>
        <address>
          <span itemprop="streetAddress">${address.street}</span><br>
          <span itemprop="addressLocality">${address.city}</span>, 
          <span itemprop="addressRegion">${address.state}</span> 
          <span itemprop="postalCode">${address.zip}</span>
        </address>
      </div>
      <div class="nap-phone">
        <span>📞</span>
        <a href="tel:${phone.replace(/[^0-9+]/g, '')}" itemprop="telephone">${phone}</a>
      </div>
      <div class="nap-email">
        <span>✉️</span>
        <a href="mailto:${email}" itemprop="email">${email}</a>
      </div>
    </div>
  ` : `
    <div class="footer-contact">
      <a href="tel:${phone.replace(/[^0-9+]/g, '')}" class="contact-item">
        <span>📞</span> ${phone}
      </a>
      <a href="mailto:${email}" class="contact-item">
        <span>✉️</span> ${email}
      </a>
    </div>
  `;

  // Generate Google Maps embed if address is available
  const mapQuery = address
    ? encodeURIComponent(`${address.street}, ${address.city}, ${address.state} ${address.zip}`)
    : '';
  const mapEmbed = address ? `
    <div class="footer-map">
      <iframe 
        src="https://www.google.com/maps?q=${mapQuery}&output=embed"
        width="100%" 
        height="200" 
        style="border:0; border-radius: 8px;" 
        allowfullscreen="" 
        loading="lazy" 
        referrerpolicy="no-referrer-when-downgrade"
        title="Our Location"
      ></iframe>
    </div>
  ` : '';

  // Logo for footer
  const footerLogoHtml = website.logoUrl
    ? `<img src="${website.logoUrl}" alt="${website.businessName}" class="footer-logo-image" />`
    : `<div class="logo-icon">${initials}</div>`;

  return `
    <footer class="footer">
      <div class="container">
        ${mapEmbed}
        <div class="footer-grid">
          <div class="footer-col footer-brand">
            <div class="footer-logo">
              ${footerLogoHtml}
              <span class="logo-text">${website.businessName}</span>
            </div>
            <p class="footer-description">
              ${website.seoSettings.siteDescription}
            </p>
            ${napMarkup}
          </div>
          <div class="footer-col">
            <h4>Our Services</h4>
            <ul>${serviceLinks}</ul>
          </div>
          <div class="footer-col">
            <h4>Service Areas</h4>
            <ul>${locationLinks || '<li>Contact us for service areas</li>'}</ul>
          </div>
          <div class="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/services">All Services</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/sitemap">Sitemap</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; ${new Date().getFullYear()} ${website.businessName}. All rights reserved.</p>
          <div class="footer-social">
            ${website.seoSettings?.socialLinks?.facebook ? `<a href="${website.seoSettings.socialLinks.facebook}" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="social-icon">📘</a>` : ''}
            ${website.seoSettings?.socialLinks?.twitter ? `<a href="${website.seoSettings.socialLinks.twitter}" target="_blank" rel="noopener noreferrer" aria-label="Twitter" class="social-icon">🐦</a>` : ''}
            ${website.seoSettings?.socialLinks?.instagram ? `<a href="${website.seoSettings.socialLinks.instagram}" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="social-icon">📷</a>` : ''}
            ${website.seoSettings?.socialLinks?.linkedin ? `<a href="${website.seoSettings.socialLinks.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="social-icon">💼</a>` : ''}
            ${website.seoSettings?.socialLinks?.youtube ? `<a href="${website.seoSettings.socialLinks.youtube}" target="_blank" rel="noopener noreferrer" aria-label="YouTube" class="social-icon">📺</a>` : ''}
          </div>
          <div class="footer-legal">
            <a href="/privacy-policy">Privacy Policy</a>
            <span>|</span>
            <a href="/terms-of-service">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
    
    <!-- Back to Top Button -->
    <button id="backToTop" onclick="window.scrollTo({top: 0, behavior: 'smooth'})" aria-label="Back to top" style="position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px; border-radius: 50%; background: var(--primary); color: white; border: none; cursor: pointer; display: none; align-items: center; justify-content: center; font-size: 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.2); z-index: 999; transition: all 0.3s ease;">↑</button>
  `;
}

// Render section based on type
function renderSection(section: PageSection, website: Website): string {
  const content = section.content as Record<string, unknown>;

  switch (section.type) {
    case 'hero':
      return renderHeroSection(content);
    case 'services-grid':
      return renderServicesGridSection(content);
    case 'about-intro':
      return renderAboutSection(content);
    case 'locations-list':
      return renderLocationsSection(content);
    case 'cta':
      return renderCtaSection(content);
    case 'contact-form':
      return renderContactSection(content);
    case 'trust-badges':
      return renderTrustBadges(content);
    case 'blog-list':
      return renderBlogList(content, website.blogPosts);
    case 'custom-content':
      return renderCustomContent(content);
    case 'image':
      return renderImageSection(content);
    case 'video':
      return renderVideoSection(content);
    case 'text-block':
      return renderTextBlockSection(content);
    case 'features':
      return renderFeaturesSection(content);
    default:
      return '';
  }
}

function renderHeroSection(content: Record<string, unknown>): string {
  const showCta = content.showCta !== false;

  return `
    <section class="hero">
      <div class="container">
        <h1>${content.headline || 'Welcome'}</h1>
        <p>${content.subheadline || ''}</p>
        ${showCta ? `
          <div class="hero-cta">
            <a href="${content.ctaLink || '/contact'}" class="btn btn-primary">${content.ctaText || 'Get Started'}</a>
            ${content.secondaryCtaText ? `<a href="${content.secondaryCtaLink}" class="btn btn-secondary">${content.secondaryCtaText}</a>` : ''}
          </div>
        ` : ''}
        ${content.phone ? `<div class="phone-number"><a href="tel:${content.phone}">${content.phone}</a></div>` : ''}
      </div>
    </section>
  `;
}

function renderServicesGridSection(content: Record<string, unknown>): string {
  const services = (content.services || []) as Array<{ id: string; name: string; description: string; icon: string; link: string }>;

  return `
    <section>
      <div class="container">
        <div class="section-title">
          <h2>${content.title || 'Our Services'}</h2>
          ${content.subtitle ? `<p>${content.subtitle}</p>` : ''}
        </div>
        <div class="services-grid">
          ${services.map(s => `
            <div class="service-card">
              <div class="service-icon">${s.icon || '✓'}</div>
              <h3>${s.name}</h3>
              <p>${s.description}</p>
              <a href="${s.link}">Learn More →</a>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderAboutSection(content: Record<string, unknown>): string {
  const features = (content.features || []) as Array<{ icon: string; text: string }>;

  return `
    <section class="about-section">
      <div class="container">
        <div class="about-content">
          <div class="about-text">
            <h2>${content.title || 'About Us'}</h2>
            <p>${content.description || ''}</p>
            <ul class="features-list">
              ${features.map(f => `
                <li><span class="icon">${f.icon}</span> ${f.text}</li>
              `).join('')}
            </ul>
          </div>
          <div class="about-image">
            <div style="width: 100%; height: 300px; background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); border-radius: 16px;"></div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderLocationsSection(content: Record<string, unknown>): string {
  const locations = (content.locations || []) as Array<{ id: string; city: string; link: string }>;

  return `
    <section>
      <div class="container">
        <div class="section-title">
          <h2>${content.title || 'Areas We Serve'}</h2>
          ${content.subtitle ? `<p>${content.subtitle}</p>` : ''}
        </div>
        <div class="locations-grid">
          ${locations.map(l => `
            <a href="${l.link}" class="location-link">${l.city}</a>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderCtaSection(content: Record<string, unknown>): string {
  return `
    <section class="cta-section">
      <div class="container">
        <h2>${content.title || 'Ready to Get Started?'}</h2>
        <p>${content.subtitle || ''}</p>
        <div class="cta-buttons">
          <a href="${content.ctaLink || '/contact'}" class="btn btn-primary">${content.ctaText || 'Get Started'}</a>
          ${content.secondaryCtaText ? `<a href="${content.secondaryCtaLink}" class="btn btn-secondary">${content.secondaryCtaText}</a>` : ''}
        </div>
      </div>
    </section>
  `;
}

function renderContactSection(content: Record<string, unknown>): string {
  return `
    <section class="contact-section">
      <div class="container">
        <div class="contact-grid">
          <div class="contact-form">
            <h2>${content.title || 'Contact Us'}</h2>
            <form action="#" method="POST">
              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" required>
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
              </div>
              <div class="form-group">
                <label for="phone">Phone</label>
                <input type="tel" id="phone" name="phone">
              </div>
              <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" name="message" required></textarea>
              </div>
              <button type="submit" class="btn btn-accent" style="width: 100%;">Send Message</button>
            </form>
          </div>
          <div class="contact-info">
            <h3>Get In Touch</h3>
            <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            ${content.phone ? `<p><strong>Phone:</strong> <a href="tel:${content.phone}">${content.phone}</a></p>` : ''}
            ${content.email ? `<p><strong>Email:</strong> <a href="mailto:${content.email}">${content.email}</a></p>` : ''}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderTrustBadges(content: Record<string, unknown>): string {
  const badges = (content.badges || []) as Array<{ icon: string; text: string }>;

  return `
    <section>
      <div class="container">
        <div class="trust-badges">
          ${badges.map(b => `
            <div class="badge">
              <div class="badge-icon">${b.icon}</div>
              <div class="badge-text">${b.text}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderBlogList(content: Record<string, unknown>, posts: BlogPost[]): string {
  const publishedPosts = posts.filter(p => p.status === 'published');

  if (publishedPosts.length === 0) {
    return `
      <section>
        <div class="container">
          <div class="section-title">
            <h2>${content.title || 'Latest Articles'}</h2>
          </div>
          <p style="text-align: center; color: var(--text-light);">No blog posts yet. Check back soon!</p>
        </div>
      </section>
    `;
  }

  return `
    <section>
      <div class="container">
        <div class="section-title">
          <h2>${content.title || 'Latest Articles'}</h2>
        </div>
        <div class="blog-grid">
          ${publishedPosts.map(post => `
            <a href="/blog/${post.slug}" class="blog-card">
              <div class="blog-card-content">
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <span class="blog-date">${new Date(post.publishedAt).toLocaleDateString()}</span>
              </div>
            </a>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderCustomContent(content: Record<string, unknown>): string {
  return `
    <section>
      <div class="container">
        <div class="custom-content">
          ${content.html || ''}
        </div>
      </div>
    </section>
  `;
}

function renderImageSection(content: Record<string, unknown>): string {
  const imgUrl = content.imageUrl as string || 'https://picsum.photos/800/400';
  const altText = content.altText as string || 'Image';
  const caption = content.caption as string || '';
  const linkUrl = content.linkUrl as string || '';

  const imageHtml = `<img src="${imgUrl}" alt="${altText}" style="width: 100%; max-width: 1000px; height: auto; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);" loading="lazy" />`;

  return `
    <section style="padding: 60px 0;">
      <div class="container" style="text-align: center;">
        ${linkUrl ? `<a href="${linkUrl}">${imageHtml}</a>` : imageHtml}
        ${caption ? `<p style="margin-top: 15px; color: var(--text-light); font-size: 0.9rem;">${caption}</p>` : ''}
      </div>
    </section>
  `;
}

function renderVideoSection(content: Record<string, unknown>): string {
  const youtubeUrl = content.youtubeUrl as string || '';
  const title = content.title as string || '';
  const description = content.description as string || '';

  // Extract YouTube video ID from various URL formats
  let videoId = '';
  if (youtubeUrl) {
    const match = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
    videoId = match ? match[1] : '';
  }

  if (!videoId) {
    return '';
  }

  return `
    <section style="padding: 80px 0; background: #f8fafc;">
      <div class="container" style="text-align: center;">
        ${title ? `<h2 style="margin-bottom: 15px;">${title}</h2>` : ''}
        ${description ? `<p style="margin-bottom: 30px; color: var(--text-light);">${description}</p>` : ''}
        <div style="position: relative; width: 100%; max-width: 800px; margin: 0 auto; padding-bottom: 45%; height: 0; overflow: hidden; border-radius: 16px; box-shadow: 0 15px 40px rgba(0,0,0,0.15);">
          <iframe 
            src="https://www.youtube.com/embed/${videoId}" 
            title="${title || 'Video'}"
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 16px;"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
  `;
}

function renderTextBlockSection(content: Record<string, unknown>): string {
  const title = content.title as string || '';
  const textContent = content.content as string || '';
  const alignment = content.alignment as string || 'left';

  return `
    <section style="padding: 60px 0;">
      <div class="container" style="max-width: 800px; text-align: ${alignment};">
        ${title ? `<h2 style="margin-bottom: 20px;">${title}</h2>` : ''}
        <div style="line-height: 1.8; color: var(--text);">
          ${textContent.split('\n').map(p => p.trim() ? `<p style="margin-bottom: 15px;">${p}</p>` : '').join('')}
        </div>
      </div>
    </section>
  `;
}

function renderFeaturesSection(content: Record<string, unknown>): string {
  const title = content.title as string || 'Our Features';
  const subtitle = content.subtitle as string || '';
  const features = (content.features || []) as Array<{ icon: string; title: string; description: string }>;

  return `
    <section style="padding: 80px 0; background: #f8fafc;">
      <div class="container" style="text-align: center;">
        <h2 style="margin-bottom: 10px;">${title}</h2>
        ${subtitle ? `<p style="color: var(--text-light); margin-bottom: 40px;">${subtitle}</p>` : ''}
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; margin-top: 30px;">
          ${features.map(f => `
            <div style="background: white; padding: 30px; border-radius: 16px; box-shadow: 0 5px 20px rgba(0,0,0,0.08);">
              <div style="font-size: 2.5rem; margin-bottom: 15px;">${f.icon || '⭐'}</div>
              <h3 style="margin-bottom: 10px;">${f.title}</h3>
              <p style="color: var(--text-light); line-height: 1.6;">${f.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

// Generate JavaScript
export function generateJS(): string {
  return `
    function toggleMobileMenu() {
      const nav = document.querySelector('.nav');
      nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
    
    // Form submission
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
      });
    });
    
    // Back to top button visibility
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
      window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
          backToTopBtn.style.display = 'flex';
        } else {
          backToTopBtn.style.display = 'none';
        }
      });
    }
  `;
}

// Render blog post page
export function renderBlogPostPage(website: Website, post: BlogPost): string {
  const css = generateCSS(website.colors);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.seo.title} | ${website.businessName}</title>
  <meta name="description" content="${post.seo.description}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>${css}</style>
</head>
<body>
  ${renderHeader(website)}
  <main>
    <section class="hero" style="padding: 60px 0;">
      <div class="container">
        <h1 style="font-size: 2.5rem;">${post.title}</h1>
        <p>Published on ${new Date(post.publishedAt).toLocaleDateString()} by ${post.author}</p>
      </div>
    </section>
    <section>
      <div class="container">
        <div class="custom-content">
          ${post.content}
        </div>
      </div>
    </section>
  </main>
  ${renderFooter(website)}
  <script>${generateJS()}</script>
</body>
</html>`;
}

// Render individual service page
export function renderServicePage(website: Website, service: { name: string; slug: string; description: string; icon?: string }): string {
  const css = generateCSS(website.colors) + generateRichHomepageCSS();
  const phone = website.contactPhone || '(555) 123-4567';
  const phoneClean = phone.replace(/[^0-9+]/g, '');
  const city = website.locations[0]?.city || 'Your Area';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${service.name} in ${city} | ${website.businessName}</title>
  <meta name="description" content="Professional ${service.name.toLowerCase()} services in ${city}. ${service.description} Call ${phone} for a free estimate.">
  <meta name="keywords" content="${service.name}, ${service.name} ${city}, ${website.businessName}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>${css}</style>
</head>
<body>
  ${renderHeader(website)}
  <main>
    <!-- Hero Section -->
    <section class="hero-emergency">
      <div class="container">
        <div class="hero-grid">
          <div class="hero-main">
            <div class="emergency-badge">
              <span class="pulse"></span>
              ${service.icon || '✓'} ${service.name}
            </div>
            <h1>${service.name} in ${city}</h1>
            <h2>${website.businessName} - Professional ${service.name} Services</h2>
            <p class="hero-description">
              ${service.description} Our team of experienced professionals is ready to help you with 
              all your ${service.name.toLowerCase()} needs. We serve ${city} and the surrounding areas 
              with fast, reliable service. Call us today for a free estimate!
            </p>
            <div class="hero-urgency">
              <span>⚡ Fast Response</span>
              <span>🆓 Free Estimates</span>
              <span>🕐 Available 24/7</span>
            </div>
          </div>
          <div class="hero-call-box">
            <div class="call-box-header">Need ${service.name}?</div>
            <p>Speak directly with a specialist who can help you immediately.</p>
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

    <!-- Service Details -->
    <section class="services-pro">
      <div class="container">
        <div class="section-intro">
          <span class="section-label">${service.icon || '✓'} About This Service</span>
          <h2>${service.name} Services in ${city}</h2>
          <p class="intro-text">
            ${website.businessName} offers professional ${service.name.toLowerCase()} services to homeowners and 
            businesses throughout ${city}. Our experienced technicians are equipped with the latest tools and 
            technology to handle any job, big or small. We pride ourselves on quality workmanship, transparent 
            pricing, and exceptional customer service.
          </p>
        </div>

        <div class="edu-grid">
          <div class="edu-card">
            <h3>Why Choose Us for ${service.name}?</h3>
            <ul class="edu-list">
              <li><span>✓</span> Licensed and insured professionals</li>
              <li><span>✓</span> Upfront, transparent pricing</li>
              <li><span>✓</span> Same-day service available</li>
              <li><span>✓</span> 100% satisfaction guarantee</li>
              <li><span>✓</span> Local experts who know ${city}</li>
            </ul>
            <a href="tel:${phoneClean}" class="edu-call-btn">Call Now: ${phone}</a>
          </div>
          <div class="edu-card">
            <h3>Our ${service.name} Process</h3>
            <ul class="edu-list">
              <li><span>1️⃣</span> Call us for a free consultation</li>
              <li><span>2️⃣</span> We'll assess your needs and provide a quote</li>
              <li><span>3️⃣</span> Our team completes the work professionally</li>
              <li><span>4️⃣</span> We follow up to ensure your satisfaction</li>
              <li><span>5️⃣</span> Enjoy our workmanship guarantee</li>
            </ul>
            <a href="tel:${phoneClean}" class="edu-call-btn">Get Started: ${phone}</a>
          </div>
        </div>

        <div class="services-cta-box">
          <h3>Ready for Professional ${service.name}?</h3>
          <p>Don't wait - call us now for immediate assistance with your ${service.name.toLowerCase()} needs.</p>
          <a href="tel:${phoneClean}" class="big-call-button">
            📞 Call Now: ${phone}
          </a>
        </div>
      </div>
    </section>

    <!-- Service Areas -->
    ${website.locations.length > 0 ? `
    <section class="areas-pro">
      <div class="container">
        <div class="section-intro centered">
          <span class="section-label">Service Areas</span>
          <h2>${service.name} Near You</h2>
          <p class="intro-text">
            We provide ${service.name.toLowerCase()} services throughout ${city} and the surrounding areas.
          </p>
        </div>
        <div class="areas-grid-pro">
          ${website.locations.map(l => `
          <a href="/locations/${l.slug}.html" class="area-card-pro">
            <span class="area-pin">📍</span>
            <span class="area-city">${l.city}${l.state ? `, ${l.state}` : ''}</span>
            <span class="area-arrow">→</span>
          </a>
          `).join('')}
        </div>
      </div>
    </section>
    ` : ''}

    <!-- Final CTA -->
    <section class="final-cta-pro">
      <div class="container">
        <div class="cta-box-pro">
          <h2>Get ${service.name} Today!</h2>
          <p>Pick up the phone and call us now for fast, professional service.</p>
          <a href="tel:${phoneClean}" class="mega-phone-cta">
            <span class="mega-icon">📞</span>
            <span class="mega-content">
              <span class="mega-label">Call Now - We're Ready to Help!</span>
              <span class="mega-number">${phone}</span>
            </span>
          </a>
          <p class="cta-subtext">Free estimates • Same-day service • ${city} and surrounding areas</p>
        </div>
      </div>
    </section>

    <!-- Floating Call Button -->
    <a href="tel:${phoneClean}" class="floating-call-btn" aria-label="Call Now">
      📞 <span>Call Now</span>
    </a>
  </main>
  ${renderFooter(website)}
  <script>${generateJS()}</script>
</body>
</html>`;
}

// Render individual location page
export function renderLocationPage(website: Website, location: { city: string; state?: string; slug: string; description?: string }): string {
  const css = generateCSS(website.colors) + generateRichHomepageCSS();
  const phone = website.contactPhone || '(555) 123-4567';
  const phoneClean = phone.replace(/[^0-9+]/g, '');
  const locationName = location.state ? `${location.city}, ${location.state}` : location.city;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${website.industry} Services in ${locationName} | ${website.businessName}</title>
  <meta name="description" content="Professional ${website.industry.toLowerCase()} services in ${locationName}. ${website.businessName} serves ${location.city} with fast, reliable service. Call ${phone} today!">
  <meta name="keywords" content="${website.industry} ${location.city}, ${location.city} ${website.industry}, ${website.businessName} ${location.city}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>${css}</style>
</head>
<body>
  ${renderHeader(website)}
  <main>
    <!-- Hero Section -->
    <section class="hero-emergency">
      <div class="container">
        <div class="hero-grid">
          <div class="hero-main">
            <div class="emergency-badge">
              <span class="pulse"></span>
              📍 Serving ${locationName}
            </div>
            <h1>${website.industry} Services in ${locationName}</h1>
            <h2>${website.businessName} - Your Local ${website.industry} Experts</h2>
            <p class="hero-description">
              ${location.description || `Looking for reliable ${website.industry.toLowerCase()} services in ${locationName}? 
              ${website.businessName} is proud to serve the ${location.city} community with professional, high-quality services. 
              Our team of local experts understands the unique needs of ${location.city} residents and businesses.`}
            </p>
            <div class="hero-urgency">
              <span>📍 Local Experts</span>
              <span>⚡ Fast Response</span>
              <span>🆓 Free Estimates</span>
            </div>
          </div>
          <div class="hero-call-box">
            <div class="call-box-header">Need Help in ${location.city}?</div>
            <p>We're your local ${website.industry.toLowerCase()} specialists, ready to help!</p>
            <a href="tel:${phoneClean}" class="call-box-button">
              <span class="call-icon">📱</span>
              <span>
                <small>Call ${location.city}</small>
                <strong>${phone}</strong>
              </span>
            </a>
            <p class="call-box-note">Serving ${locationName} and nearby areas</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Services in this Location -->
    <section class="services-pro">
      <div class="container">
        <div class="section-intro">
          <span class="section-label">Our Services in ${location.city}</span>
          <h2>${website.industry} Services Available in ${locationName}</h2>
          <p class="intro-text">
            ${website.businessName} offers a comprehensive range of ${website.industry.toLowerCase()} services to 
            residents and businesses in ${location.city}. No matter what you need, our experienced local team is here to help.
          </p>
        </div>

        <div class="services-grid-pro">
          ${website.services.slice(0, 6).map((s, i) => `
          <div class="service-card-pro" data-delay="${i * 100}">
            <div class="service-icon-box">
              <span>${s.icon || '✓'}</span>
            </div>
            <h3>${s.name}</h3>
            <p>${s.description}</p>
            <a href="/services/${s.slug}.html" class="service-call-btn">
              Learn More →
            </a>
          </div>
          `).join('')}
        </div>

        <div class="services-cta-box">
          <h3>Need ${website.industry} Help in ${location.city}?</h3>
          <p>Our local team is ready to assist you with any ${website.industry.toLowerCase()} needs.</p>
          <a href="tel:${phoneClean}" class="big-call-button">
            📞 Call Now: ${phone}
          </a>
        </div>
      </div>
    </section>

    <!-- Why Choose Us for This Location -->
    <section class="why-choose-pro">
      <div class="container">
        <div class="why-content">
          <span class="section-label">Why ${location.city} Chooses Us</span>
          <h2>${website.businessName} in ${locationName}</h2>
          <p class="lead-paragraph">
            As a trusted ${website.industry.toLowerCase()} provider in ${location.city}, we've built our reputation 
            on quality workmanship, honest pricing, and exceptional customer service. Our team knows ${location.city} 
            and understands the specific needs of local homes and businesses.
          </p>
          
          <div class="benefits-grid">
            <div class="benefit-card">
              <span class="benefit-icon">📍</span>
              <h4>Local to ${location.city}</h4>
              <p>We're part of the ${location.city} community and treat every customer like a neighbor.</p>
            </div>
            <div class="benefit-card">
              <span class="benefit-icon">⚡</span>
              <h4>Fast Response</h4>
              <p>Because we're local, we can often provide same-day service to ${location.city} customers.</p>
            </div>
            <div class="benefit-card">
              <span class="benefit-icon">🆓</span>
              <h4>Free Estimates</h4>
              <p>Get a free, no-obligation quote for any ${website.industry.toLowerCase()} project in ${location.city}.</p>
            </div>
            <div class="benefit-card">
              <span class="benefit-icon">✅</span>
              <h4>Satisfaction Guarantee</h4>
              <p>We stand behind our work with a 100% satisfaction guarantee.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="final-cta-pro">
      <div class="container">
        <div class="cta-box-pro">
          <h2>Ready for ${website.industry} Service in ${location.city}?</h2>
          <p>Call your local ${website.industry.toLowerCase()} experts today!</p>
          <a href="tel:${phoneClean}" class="mega-phone-cta">
            <span class="mega-icon">📞</span>
            <span class="mega-content">
              <span class="mega-label">Call ${location.city} Now!</span>
              <span class="mega-number">${phone}</span>
            </span>
          </a>
          <p class="cta-subtext">Free estimates • Local experts • Serving ${locationName}</p>
        </div>
      </div>
    </section>

    <!-- Floating Call Button -->
    <a href="tel:${phoneClean}" class="floating-call-btn" aria-label="Call Now">
      📞 <span>Call Now</span>
    </a>
  </main>
  ${renderFooter(website)}
  <script>${generateJS()}</script>
</body>
</html>`;
}
