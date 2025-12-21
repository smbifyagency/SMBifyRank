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

    // Add core pages
    const corePages = [
        { path: '', priority: '1.0' },       // index.html
        { path: 'about.html', priority: '0.8' },
        { path: 'services.html', priority: '0.9' },
        { path: 'contact.html', priority: '0.8' },
        { path: 'blog.html', priority: '0.7' },
    ];

    corePages.forEach(page => {
        urls += `
    <url>
        <loc>${baseUrl}/${page.path}</loc>
        <lastmod>${lastmod}</lastmod>
        <priority>${page.priority}</priority>
    </url>`;
    });

    // Add service pages
    website.services.forEach(service => {
        urls += `
    <url>
        <loc>${baseUrl}/services/${service.slug}.html</loc>
        <lastmod>${lastmod}</lastmod>
        <priority>0.8</priority>
    </url>`;
    });

    // Add location pages
    website.locations.forEach(location => {
        urls += `
    <url>
        <loc>${baseUrl}/locations/${location.slug}.html</loc>
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
        <loc>${baseUrl}/blog/${post.slug}.html</loc>
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

// Generate search.html page with client-side search
export function generateSearchPage(website: Website): string {
    const baseUrl = website.netlifyUrl || '';

    // Build searchable content array
    const searchableItems = [
        { title: 'Home', url: '/', description: website.seoSettings.siteDescription || '', type: 'page' },
        { title: 'About Us', url: '/about.html', description: `About ${website.businessName}`, type: 'page' },
        { title: 'Services', url: '/services.html', description: 'Our services', type: 'page' },
        { title: 'Contact', url: '/contact.html', description: 'Contact us', type: 'page' },
        { title: 'Blog', url: '/blog.html', description: 'Latest articles and insights', type: 'page' },
        ...website.services.map(s => ({
            title: s.name,
            url: `/services/${s.slug}.html`,
            description: s.description,
            type: 'service'
        })),
        ...website.locations.map(l => ({
            title: `${l.city}${l.state ? `, ${l.state}` : ''}`,
            url: `/locations/${l.slug}.html`,
            description: l.description || `Services in ${l.city}`,
            type: 'location'
        })),
        ...website.blogPosts.filter(p => p.status === 'published').map(p => ({
            title: p.title,
            url: `/blog/${p.slug}.html`,
            description: p.excerpt,
            type: 'blog'
        }))
    ];

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Search | ${website.businessName}</title>
    <meta name="description" content="Search ${website.businessName} for services, articles, and information.">
    <link rel="icon" href="${website.logoUrl || '/favicon.ico'}" type="image/x-icon">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #f8f9fa; min-height: 100vh; }
        .search-container { max-width: 800px; margin: 0 auto; padding: 60px 20px; }
        h1 { font-size: 2.5rem; margin-bottom: 30px; color: #1f2937; text-align: center; }
        .search-box { display: flex; gap: 10px; margin-bottom: 40px; }
        .search-input { flex: 1; padding: 15px 20px; font-size: 1.1rem; border: 2px solid #e5e7eb; border-radius: 10px; }
        .search-input:focus { outline: none; border-color: ${website.colors.primary}; }
        .search-btn { padding: 15px 30px; background: ${website.colors.primary}; color: white; border: none; border-radius: 10px; font-size: 1.1rem; cursor: pointer; }
        .search-btn:hover { opacity: 0.9; }
        .results { display: flex; flex-direction: column; gap: 20px; }
        .result-item { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .result-item:hover { box-shadow: 0 4px 15px rgba(0,0,0,0.15); }
        .result-item a { text-decoration: none; color: inherit; }
        .result-title { font-size: 1.3rem; color: ${website.colors.primary}; margin-bottom: 8px; }
        .result-type { font-size: 0.75rem; background: #e5e7eb; padding: 4px 10px; border-radius: 4px; display: inline-block; margin-bottom: 8px; text-transform: uppercase; }
        .result-desc { color: #6b7280; line-height: 1.6; }
        .no-results { text-align: center; color: #6b7280; padding: 40px; }
        .back-link { display: inline-block; margin-bottom: 30px; color: ${website.colors.primary}; text-decoration: none; }
        .back-link:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="search-container">
        <a href="/" class="back-link">← Back to Home</a>
        <h1>🔍 Search ${website.businessName}</h1>
        <div class="search-box">
            <input type="text" class="search-input" id="searchInput" placeholder="Search for services, articles..." autofocus>
            <button class="search-btn" onclick="performSearch()">Search</button>
        </div>
        <div class="results" id="results"></div>
    </div>
    <script>
        const searchData = ${JSON.stringify(searchableItems)};
        
        function performSearch() {
            const query = document.getElementById('searchInput').value.toLowerCase().trim();
            const resultsEl = document.getElementById('results');
            
            if (!query) {
                resultsEl.innerHTML = '<div class="no-results">Enter a search term to find content.</div>';
                return;
            }
            
            const results = searchData.filter(item => 
                item.title.toLowerCase().includes(query) || 
                item.description.toLowerCase().includes(query)
            );
            
            if (results.length === 0) {
                resultsEl.innerHTML = '<div class="no-results">No results found. Try different keywords.</div>';
                return;
            }
            
            resultsEl.innerHTML = results.map(item => \`
                <div class="result-item">
                    <a href="\${item.url}">
                        <span class="result-type">\${item.type}</span>
                        <h3 class="result-title">\${item.title}</h3>
                        <p class="result-desc">\${item.description}</p>
                    </a>
                </div>
            \`).join('');
        }
        
        // Search on Enter key
        document.getElementById('searchInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') performSearch();
        });
        
        // Check for query param
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get('q');
        if (q) {
            document.getElementById('searchInput').value = q;
            performSearch();
        }
    </script>
</body>
</html>`;
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
    const { renderBlogList, getBlogCSS } = require('./generator/blogRenderer');

    // Generate base CSS with brand colors
    const baseCSS = generateCSS(website.colors);
    const richCSS = generateRichHomepageCSS();
    const pageCSS = generatePageCSS();
    const blogCSS = getBlogCSS();
    const fullHomeCSS = baseCSS + richCSS;
    const fullPageCSS = baseCSS + pageCSS;
    const fullBlogCSS = baseCSS + blogCSS;

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

    // 7. Generate Blog Index Page (always generate, even if empty)
    const blogIndexContent = renderBlogList(website.blogPosts || [], website);
    files.push({
        path: 'blog.html',
        content: createHtmlPage('Blog', `Latest news and insights from ${website.businessName}`, blogIndexContent, fullBlogCSS)
    });

    // 8. Export blog posts (if any)
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

    // Add search.html page with client-side search
    const searchPageContent = generateSearchPage(website);
    files.push({ path: 'search.html', content: searchPageContent });

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
    
    /* Floating WYSIWYG Toolbar */
    #wysiwyg-toolbar {
        position: fixed;
        display: none;
        background: #1a1a2e;
        border-radius: 8px;
        padding: 6px 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        z-index: 99999;
        gap: 2px;
        flex-wrap: wrap;
        max-width: 360px;
    }
    
    #wysiwyg-toolbar.visible {
        display: flex;
    }
    
    #wysiwyg-toolbar button {
        background: transparent;
        border: none;
        color: #e0e0e0;
        padding: 6px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.15s;
        min-width: 28px;
    }
    
    #wysiwyg-toolbar button:hover {
        background: rgba(255,255,255,0.15);
    }
    
    #wysiwyg-toolbar button.active {
        background: #6366f1;
        color: white;
    }
    
    #wysiwyg-toolbar .divider {
        width: 1px;
        height: 24px;
        background: rgba(255,255,255,0.2);
        margin: 0 4px;
    }
    
    /* Link Modal */
    #link-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.6);
        z-index: 100000;
        display: none;
        align-items: center;
        justify-content: center;
    }
    
    #link-modal-overlay.visible {
        display: flex;
    }
    
    #link-modal {
        background: #1a1a2e;
        border-radius: 12px;
        padding: 20px;
        width: 320px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.5);
    }
    
    #link-modal h4 {
        color: #fff;
        margin: 0 0 16px 0;
        font-size: 16px;
    }
    
    #link-modal input {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #333;
        border-radius: 6px;
        background: #0d0d1a;
        color: #fff;
        font-size: 14px;
        margin-bottom: 12px;
    }
    
    #link-modal input:focus {
        outline: none;
        border-color: #6366f1;
    }
    
    #link-modal .modal-buttons {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
    }
    
    #link-modal button {
        padding: 8px 16px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        font-size: 14px;
    }
    
    #link-modal .cancel-btn {
        background: #333;
        color: #fff;
    }
    
    #link-modal .insert-btn {
        background: #6366f1;
        color: #fff;
    }
</style>
`;

    const editorScript = `
<script>
(function() {
    // Create floating toolbar
    function createToolbar() {
        const toolbar = document.createElement('div');
        toolbar.id = 'wysiwyg-toolbar';
        toolbar.innerHTML = \`
            <button onclick="formatDoc('bold')" title="Bold (Ctrl+B)"><b>B</b></button>
            <button onclick="formatDoc('italic')" title="Italic (Ctrl+I)"><i>I</i></button>
            <button onclick="formatDoc('underline')" title="Underline (Ctrl+U)"><u>U</u></button>
            <button onclick="formatDoc('strikeThrough')" title="Strikethrough"><s>S</s></button>
            <span class="divider"></span>
            <button onclick="showLinkModal()" title="Insert Link (Ctrl+K)">🔗</button>
            <button onclick="formatDoc('removeFormat')" title="Clear Formatting">✕</button>
            <span class="divider"></span>
            <button onclick="formatDoc('insertUnorderedList')" title="Bullet List">•</button>
            <button onclick="formatDoc('insertOrderedList')" title="Numbered List">1.</button>
            <span class="divider"></span>
            <button onclick="setHeading('h2')" title="Heading 2">H2</button>
            <button onclick="setHeading('h3')" title="Heading 3">H3</button>
            <button onclick="setHeading('p')" title="Paragraph">P</button>
        \`;
        document.body.appendChild(toolbar);
        return toolbar;
    }
    
    // Create link modal
    function createLinkModal() {
        const overlay = document.createElement('div');
        overlay.id = 'link-modal-overlay';
        overlay.innerHTML = \`
            <div id="link-modal">
                <h4>🔗 Insert Link</h4>
                <input type="text" id="link-url" placeholder="https://example.com" />
                <input type="text" id="link-text" placeholder="Link text (optional)" />
                <div class="modal-buttons">
                    <button class="cancel-btn" onclick="closeLinkModal()">Cancel</button>
                    <button class="insert-btn" onclick="insertLink()">Insert</button>
                </div>
            </div>
        \`;
        document.body.appendChild(overlay);
        return overlay;
    }
    
    const toolbar = createToolbar();
    const linkModal = createLinkModal();
    let currentEditableElement = null;
    let savedSelection = null;
    
    // Format document command
    window.formatDoc = function(cmd, value) {
        document.execCommand(cmd, false, value || null);
        currentEditableElement?.focus();
    };
    
    // Set heading level
    window.setHeading = function(tag) {
        document.execCommand('formatBlock', false, tag);
        currentEditableElement?.focus();
    };
    
    // Save current selection for link insertion
    function saveSelection() {
        const sel = window.getSelection();
        if (sel.rangeCount > 0) {
            savedSelection = sel.getRangeAt(0).cloneRange();
        }
    }
    
    // Restore saved selection
    function restoreSelection() {
        if (savedSelection) {
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(savedSelection);
        }
    }
    
    // Show link modal
    window.showLinkModal = function() {
        saveSelection();
        const sel = window.getSelection();
        document.getElementById('link-text').value = sel.toString() || '';
        document.getElementById('link-url').value = '';
        linkModal.classList.add('visible');
        document.getElementById('link-url').focus();
    };
    
    // Close link modal
    window.closeLinkModal = function() {
        linkModal.classList.remove('visible');
        currentEditableElement?.focus();
    };
    
    // Insert link
    window.insertLink = function() {
        const url = document.getElementById('link-url').value.trim();
        const text = document.getElementById('link-text').value.trim();
        
        if (!url) return;
        
        restoreSelection();
        
        if (text && window.getSelection().toString() !== text) {
            document.execCommand('insertHTML', false, '<a href="' + url + '" target="_blank">' + text + '</a>');
        } else {
            document.execCommand('createLink', false, url);
            // Add target blank
            const sel = window.getSelection();
            if (sel.anchorNode.parentElement.tagName === 'A') {
                sel.anchorNode.parentElement.setAttribute('target', '_blank');
            }
        }
        
        closeLinkModal();
    };
    
    // Position toolbar near element
    function positionToolbar(element) {
        const rect = element.getBoundingClientRect();
        toolbar.style.left = Math.max(10, rect.left) + 'px';
        toolbar.style.top = Math.max(10, rect.top - 50) + 'px';
    }
    
    // Show toolbar
    function showToolbar(element) {
        currentEditableElement = element;
        positionToolbar(element);
        toolbar.classList.add('visible');
    }
    
    // Hide toolbar
    function hideToolbar() {
        toolbar.classList.remove('visible');
    }
    
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
            
            // Show WYSIWYG toolbar
            showToolbar(target);
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
            
            // Hide toolbar
            hideToolbar();
            
            const editId = target.getAttribute('data-edit-id');
            const editType = target.getAttribute('data-edit-type');
            
            // Send updated content to parent (use innerHTML to preserve formatting)
            window.parent.postMessage({
                type: 'content-updated',
                data: {
                    elementId: editId,
                    elementType: editType,
                    newContent: target.innerHTML
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

