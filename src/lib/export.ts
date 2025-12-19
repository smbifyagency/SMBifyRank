// Static HTML/CSS/JS export functionality

import { Website, Page, BlogPost } from './types';
import { renderPage, renderBlogPostPage } from './generator/templates';
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
                    page.type === 'service-single' ? '0.8' :
                        page.type === 'location' ? '0.8' :
                            page.type === 'contact' ? '0.7' : '0.6';
            const changefreq = page.type === 'home' ? 'weekly' :
                page.type === 'blog' ? 'daily' : 'monthly';

            urls += `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`;
        });

    // Add published blog posts
    website.blogPosts
        .filter(p => p.status === 'published')
        .forEach(post => {
            urls += `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt.split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
        });

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls}</urlset>`;
}

// Generate robots.txt for SEO
export function generateRobotsTxt(website: Website): string {
    const baseUrl = website.netlifyUrl || 'https://example.com';

    return `# robots.txt for ${website.businessName}
User-agent: *
Allow: /

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay (optional, for respectful crawling)
Crawl-delay: 1

# Disallow admin/internal pages
Disallow: /api/
Disallow: /admin/
Disallow: /*.json$
`;
}

// Export website to static HTML files
export function exportWebsite(website: Website): ExportedFile[] {
    const files: ExportedFile[] = [];

    // Export all pages
    website.pages
        .filter(p => p.isPublished)
        .forEach(page => {
            const html = renderPage(website, page);
            const path = page.slug === '' ? 'index.html' : `${page.slug}.html`;
            files.push({ path, content: html });
        });

    // Export blog posts
    website.blogPosts
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

