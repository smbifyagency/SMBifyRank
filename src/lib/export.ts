// Static HTML/CSS/JS export functionality

import { Website, Page, BlogPost } from './types';
import { renderPage, renderBlogPostPage, renderServicePage, renderLocationPage } from './generator/templates';
import JSZip from 'jszip';

export interface ExportedFile {
    path: string;
    content: string;
}

// Generate XML Sitemap for SEO
export function generateSitemapXml(website: Website): string {
    const baseUrl = website.netlifyUrl || 'https://example.com';
    const lastmod = new Date().toISOString().split('T')[0];

    let urls = '';

    // Add all published pages
    website.pages
        .filter(p => p.isPublished)
        .forEach(page => {
            const loc = page.slug === '' ? baseUrl : `${baseUrl}/${page.slug}`;
            const priority = page.type === 'home' ? '1.0' :
                page.type === 'services' ? '0.9' :
                    page.type === 'contact' ? '0.8' : '0.7';
            urls += `
    <url>
        <loc>${loc}</loc>
        <lastmod>${lastmod}</lastmod>
        <priority>${priority}</priority>
    </url>`;
        });

    // Add service pages
    website.services.forEach(service => {
        urls += `
    <url>
        <loc>${baseUrl}/services/${service.slug}</loc>
        <lastmod>${lastmod}</lastmod>
        <priority>0.8</priority>
    </url>`;
    });

    // Add location pages
    website.locations.forEach(location => {
        urls += `
    <url>
        <loc>${baseUrl}/locations/${location.slug}</loc>
        <lastmod>${lastmod}</lastmod>
        <priority>0.8</priority>
    </url>`;
    });

    // Add blog posts
    website.blogPosts
        .filter(p => p.status === 'published')
        .forEach(post => {
            urls += `
    <url>
        <loc>${baseUrl}/blog/${post.slug}</loc>
        <lastmod>${lastmod}</lastmod>
        <priority>0.6</priority>
    </url>`;
        });

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

// Generate robots.txt
export function generateRobotsTxt(website: Website): string {
    const sitemapUrl = website.netlifyUrl
        ? `${website.netlifyUrl}/sitemap.xml`
        : 'https://example.com/sitemap.xml';

    return `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`;
}

// Export website to static HTML files
// This function generates ALL pages using rich content, regardless of the pages array
export function exportWebsite(website: Website): ExportedFile[] {
    const files: ExportedFile[] = [];

    // Build business info for content generators
    const businessInfo = {
        name: website.businessName,
        industry: website.industry,
        city: website.locations?.[0]?.city || 'Your Area',
        phone: website.contactPhone || '(555) 123-4567',
        email: website.contactEmail,
        services: (website.services || []).map(s => ({
            name: s.name,
            slug: s.slug,
            icon: s.icon || '✓',
            description: s.description
        })),
        locations: (website.locations || []).map(l => ({
            city: l.city,
            state: l.state,
            slug: l.slug
        }))
    };

    // Import rich content generators inline to avoid circular deps
    const { generateRichHomepageContent, generateRichHomepageCSS } = require('./generator/richContent');
    const { generateRichAboutContent, generateRichContactContent, generateRichServicesContent, generatePageCSS } = require('./generator/pageContent');
    const { generateCSS, renderHeader, renderFooter, generateJS } = require('./generator/templates');

    // Generate base CSS with brand colors
    const baseCSS = generateCSS(website.colors);
    const richCSS = generateRichHomepageCSS();
    const pageCSS = generatePageCSS();
    const fullHomeCSS = baseCSS + richCSS;
    const fullPageCSS = baseCSS + pageCSS;

    // Helper to create full HTML page
    const createHtmlPage = (title: string, description: string, content: string, css: string) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | ${website.businessName}</title>
    <meta name="description" content="${description}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>${css}</style>
</head>
<body>
    ${renderHeader(website)}
    <main>
        ${content}
    </main>
    ${renderFooter(website)}
    <script>${generateJS()}</script>
</body>
</html>`;

    // 1. Generate Home Page (ALWAYS use rich content)
    const homeContent = generateRichHomepageContent(businessInfo);
    files.push({
        path: 'index.html',
        content: createHtmlPage('Home', website.seoSettings?.siteDescription || 'Welcome', homeContent, fullHomeCSS)
    });

    // 2. Generate About Page
    const aboutContent = generateRichAboutContent(businessInfo);
    files.push({
        path: 'about.html',
        content: createHtmlPage('About Us', `Learn about ${website.businessName}`, aboutContent, fullPageCSS)
    });

    // 3. Generate Services Page
    const servicesContent = generateRichServicesContent(businessInfo);
    files.push({
        path: 'services.html',
        content: createHtmlPage('Our Services', `Professional services from ${website.businessName}`, servicesContent, fullPageCSS)
    });

    // 4. Generate Contact Page
    const contactContent = generateRichContactContent(businessInfo);
    files.push({
        path: 'contact.html',
        content: createHtmlPage('Contact Us', `Contact ${website.businessName}`, contactContent, fullPageCSS)
    });

    // 5. Export individual service pages
    (website.services || []).forEach(service => {
        const html = renderServicePage(website, service);
        files.push({ path: `services/${service.slug}.html`, content: html });
    });

    // 6. Export individual location pages
    (website.locations || []).forEach(location => {
        const html = renderLocationPage(website, location);
        files.push({ path: `locations/${location.slug}.html`, content: html });
    });

    // 7. Export blog posts (if any)
    (website.blogPosts || [])
        .filter(p => p.status === 'published')
        .forEach(post => {
            const html = renderBlogPostPage(website, post);
            files.push({ path: `blog/${post.slug}.html`, content: html });
        });

    // Add XML Sitemap for SEO
    files.push({ path: 'sitemap.xml', content: generateSitemapXml(website) });

    // Add robots.txt
    files.push({ path: 'robots.txt', content: generateRobotsTxt(website) });

    return files;
}


// Create ZIP file from exported files using JSZip
export async function createZipBlob(files: ExportedFile[]): Promise<Blob> {
    const zip = new JSZip();

    for (const file of files) {
        zip.file(file.path, file.content);
    }

    const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
    });

    return blob;
}

// Download ZIP file
export async function downloadWebsiteZip(website: Website): Promise<void> {
    const files = exportWebsite(website);
    const blob = await createZipBlob(files);

    // Create filename from business name
    const safeName = website.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeName}-website.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Preview a single page
export function getPagePreviewHtml(website: Website, page: Page): string {
    return renderPage(website, page);
}

// Preview a page with inline editing capabilities
export function getEditablePagePreviewHtml(website: Website, page: Page): string {
    const baseHtml = renderPage(website, page);

    // Inject editor styles and scripts before closing </body>
    const editorStyles = `
<style>
    /* Editor hover/selection styles */
    [data-editable]:hover {
        outline: 2px dashed rgba(59, 130, 246, 0.5) !important;
        cursor: pointer !important;
    }
    
    [data-editable].selected {
        outline: 2px solid #3b82f6 !important;
        outline-offset: 2px;
    }
    
    [data-editable][contenteditable="true"] {
        outline: 2px solid #10b981 !important;
        outline-offset: 2px;
        min-height: 1em;
    }
    
    .edit-overlay {
        position: relative;
    }
    
    .edit-overlay::after {
        content: attr(data-edit-label);
        position: absolute;
        top: -20px;
        left: 0;
        background: #3b82f6;
        color: white;
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 3px;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.15s;
    }
    
    .edit-overlay:hover::after {
        opacity: 1;
    }
</style>
`;

    const editorScript = `
<script>
(function() {
    // Add data-editable attributes to editable elements
    function initEditableElements() {
        // Headings
        document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((el, i) => {
            el.setAttribute('data-editable', 'true');
            el.setAttribute('data-edit-type', 'heading');
            el.setAttribute('data-edit-id', 'heading-' + i);
            el.classList.add('edit-overlay');
            el.setAttribute('data-edit-label', el.tagName);
        });
        
        // Paragraphs
        document.querySelectorAll('p').forEach((el, i) => {
            if (el.textContent.trim().length > 0) {
                el.setAttribute('data-editable', 'true');
                el.setAttribute('data-edit-type', 'text');
                el.setAttribute('data-edit-id', 'text-' + i);
                el.classList.add('edit-overlay');
                el.setAttribute('data-edit-label', 'Text');
            }
        });
        
        // Images
        document.querySelectorAll('img').forEach((el, i) => {
            el.setAttribute('data-editable', 'true');
            el.setAttribute('data-edit-type', 'image');
            el.setAttribute('data-edit-id', 'image-' + i);
            el.classList.add('edit-overlay');
            el.setAttribute('data-edit-label', 'Image');
        });
        
        // Buttons and links
        document.querySelectorAll('a.btn, button, .hero-cta a').forEach((el, i) => {
            el.setAttribute('data-editable', 'true');
            el.setAttribute('data-edit-type', 'button');
            el.setAttribute('data-edit-id', 'button-' + i);
            el.classList.add('edit-overlay');
            el.setAttribute('data-edit-label', 'Button');
        });
        
        // Video iframes (YouTube, Vimeo, etc)
        document.querySelectorAll('iframe[src*="youtube"], iframe[src*="vimeo"], .video-section iframe').forEach((el, i) => {
            // Wrap iframe in a clickable container if not already wrapped
            if (!el.parentElement.classList.contains('video-edit-wrapper')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'video-edit-wrapper';
                
                // Get the iframe's actual dimensions
                const iframeHeight = el.offsetHeight || el.clientHeight || 315;
                const iframeWidth = el.offsetWidth || el.clientWidth || 560;
                
                wrapper.style.cssText = 'position:relative;display:block;width:100%;min-height:' + iframeHeight + 'px;';
                wrapper.setAttribute('data-editable', 'true');
                wrapper.setAttribute('data-edit-type', 'video');
                wrapper.setAttribute('data-edit-id', 'video-' + i);
                wrapper.setAttribute('data-video-src', el.getAttribute('src') || '');
                wrapper.classList.add('edit-overlay');
                wrapper.setAttribute('data-edit-label', '📹 Video - Double-click to edit');
                el.parentNode.insertBefore(wrapper, el);
                wrapper.appendChild(el);
                
                // Add click overlay on top of iframe - covers full iframe area
                const overlay = document.createElement('div');
                overlay.className = 'video-click-overlay';
                overlay.setAttribute('data-editable', 'true');
                overlay.setAttribute('data-edit-type', 'video');
                overlay.setAttribute('data-edit-id', 'video-' + i);
                overlay.setAttribute('data-video-src', el.getAttribute('src') || '');
                // Ensure overlay has full dimensions
                overlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;min-height:' + iframeHeight + 'px;cursor:pointer;z-index:10;background:transparent;';
                wrapper.appendChild(overlay);
            }
        });
    }
    
    // Handle click on editable elements
    document.addEventListener('click', function(e) {
        const target = e.target.closest('[data-editable]');
        
        if (target) {
            e.preventDefault();
            e.stopPropagation();
            
            // Remove previous selection
            document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
            
            // Add selection to clicked element
            target.classList.add('selected');
            
            const rect = target.getBoundingClientRect();
            const editType = target.getAttribute('data-edit-type');
            const editId = target.getAttribute('data-edit-id');
            
            // For video elements, get the video src from data-video-src
            const srcValue = editType === 'video' 
                ? target.getAttribute('data-video-src') || ''
                : target.getAttribute('src') || '';
            
            // Send message to parent
            window.parent.postMessage({
                type: 'element-selected',
                data: {
                    elementType: editType,
                    elementId: editId,
                    tagName: target.tagName,
                    content: target.textContent || srcValue || '',
                    href: target.getAttribute('href') || '',
                    src: srcValue,
                    alt: target.getAttribute('alt') || '',
                    rect: {
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height
                    }
                }
            }, '*');
        }
    }, true);
    
    // Handle double-click for inline text editing
    document.addEventListener('dblclick', function(e) {
        const target = e.target.closest('[data-editable]');
        const editType = target?.getAttribute('data-edit-type');
        
        if (target && (editType === 'text' || editType === 'heading' || editType === 'button')) {
            e.preventDefault();
            
            // Make element contenteditable
            target.setAttribute('contenteditable', 'true');
            target.focus();
            
            // Select all text
            const range = document.createRange();
            range.selectNodeContents(target);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
        
        // Handle video double-click - notify parent to show URL editor
        if (target && editType === 'video') {
            e.preventDefault();
            const videoSrc = target.getAttribute('data-video-src') || '';
            window.parent.postMessage({
                type: 'edit-video',
                data: {
                    elementId: target.getAttribute('data-edit-id'),
                    videoUrl: videoSrc
                }
            }, '*');
        }
    }, true);
    
    // Save on blur
    document.addEventListener('blur', function(e) {
        const target = e.target.closest('[contenteditable="true"]');
        
        if (target) {
            target.removeAttribute('contenteditable');
            
            const editId = target.getAttribute('data-edit-id');
            const editType = target.getAttribute('data-edit-type');
            
            // Send updated content to parent
            window.parent.postMessage({
                type: 'content-updated',
                data: {
                    elementId: editId,
                    elementType: editType,
                    newContent: target.textContent
                }
            }, '*');
        }
    }, true);
    
    // Listen for messages from parent
    window.addEventListener('message', function(e) {
        if (e.data.type === 'update-element') {
            const { elementId, property, value } = e.data.data;
            const el = document.querySelector('[data-edit-id="' + elementId + '"]');
            
            if (el) {
                if (property === 'text') {
                    el.textContent = value;
                } else if (property === 'src') {
                    el.setAttribute('src', value);
                } else if (property === 'href') {
                    el.setAttribute('href', value);
                } else if (property === 'alt') {
                    el.setAttribute('alt', value);
                }
            }
        } else if (e.data.type === 'deselect') {
            document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
        } else if (e.data.type === 'update-video') {
            // Update video iframe src
            const { elementId, videoUrl } = e.data.data;
            const wrapper = document.querySelector('[data-edit-id="' + elementId + '"]');
            
            if (wrapper) {
                const iframe = wrapper.querySelector('iframe');
                if (iframe) {
                    iframe.setAttribute('src', videoUrl);
                }
                // Update the stored video URL
                wrapper.setAttribute('data-video-src', videoUrl);
            }
        }
    });
    
    // Initialize
    initEditableElements();
    
    // Disable all default link behavior
    document.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', function(e) {
            e.preventDefault();
        });
    });
})();
</script>
`;

    // Insert before </body>
    return baseHtml.replace('</body>', editorStyles + editorScript + '</body>');
}

// Preview a blog post
export function getBlogPostPreviewHtml(website: Website, post: BlogPost): string {
    return renderBlogPostPage(website, post);
}

