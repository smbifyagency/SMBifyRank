// HTML Sanitizer for Blog Content
// Whitelist-based sanitization to preserve semantic structure while removing harmful content

const ALLOWED_TAGS = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'ul', 'ol', 'li',
    'a',
    'strong', 'b', 'em', 'i', 'u', 's', 'strike',
    'blockquote', 'pre', 'code',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'img', 'figure', 'figcaption',
    'div', 'span',
    'iframe' // For YouTube embeds only
];

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    iframe: ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen', 'title'],
    td: ['colspan', 'rowspan'],
    th: ['colspan', 'rowspan', 'scope'],
    '*': ['id', 'class'] // Allowed on all elements
};

// Check if URL is a safe YouTube embed
function isYouTubeEmbed(src: string): boolean {
    return /^https:\/\/(www\.)?youtube\.com\/embed\//.test(src) ||
        /^https:\/\/(www\.)?youtube-nocookie\.com\/embed\//.test(src);
}

// Check if link is external
function isExternalLink(href: string): boolean {
    if (!href) return false;
    return href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//');
}

// Sanitize HTML string
export function sanitizeHtml(html: string): string {
    // Create a temporary container
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Process all nodes
    sanitizeNode(temp);

    return temp.innerHTML;
}

function sanitizeNode(node: Node): void {
    const nodesToRemove: Node[] = [];

    node.childNodes.forEach(child => {
        if (child.nodeType === Node.ELEMENT_NODE) {
            const element = child as Element;
            const tagName = element.tagName.toLowerCase();

            // Check if tag is allowed
            if (!ALLOWED_TAGS.includes(tagName)) {
                // Remove script, style, and other dangerous tags entirely
                if (['script', 'style', 'noscript', 'object', 'embed', 'form', 'input', 'button'].includes(tagName)) {
                    nodesToRemove.push(child);
                    return;
                }
                // For other tags, unwrap (keep children)
                while (child.firstChild) {
                    node.insertBefore(child.firstChild, child);
                }
                nodesToRemove.push(child);
                return;
            }

            // Special handling for iframe - only allow YouTube
            if (tagName === 'iframe') {
                const src = element.getAttribute('src') || '';
                if (!isYouTubeEmbed(src)) {
                    nodesToRemove.push(child);
                    return;
                }
            }

            // Sanitize attributes
            const allowedAttrs = [...(ALLOWED_ATTRIBUTES[tagName] || []), ...(ALLOWED_ATTRIBUTES['*'] || [])];
            const attrsToRemove: string[] = [];

            Array.from(element.attributes).forEach(attr => {
                if (!allowedAttrs.includes(attr.name)) {
                    attrsToRemove.push(attr.name);
                }
                // Remove inline styles
                if (attr.name === 'style') {
                    attrsToRemove.push('style');
                }
                // Remove javascript: hrefs
                if (attr.name === 'href' && attr.value.toLowerCase().startsWith('javascript:')) {
                    element.setAttribute('href', '#');
                }
            });

            attrsToRemove.forEach(attr => element.removeAttribute(attr));

            // Add security attributes to external links
            if (tagName === 'a') {
                const href = element.getAttribute('href') || '';
                if (isExternalLink(href)) {
                    element.setAttribute('target', '_blank');
                    element.setAttribute('rel', 'noopener noreferrer');
                }
            }

            // Add lazy loading to images
            if (tagName === 'img') {
                element.setAttribute('loading', 'lazy');
            }

            // Recursively process children
            sanitizeNode(element);
        } else if (child.nodeType === Node.TEXT_NODE) {
            // Keep text nodes
        } else {
            // Remove comments and other node types
            nodesToRemove.push(child);
        }
    });

    nodesToRemove.forEach(n => node.removeChild(n));
}

// Fix heading hierarchy for SEO (only one H1, convert extra H1s to H2)
export function fixHeadingHierarchy(html: string): string {
    const temp = document.createElement('div');
    temp.innerHTML = html;

    const h1Elements = temp.querySelectorAll('h1');
    let firstH1Found = false;

    h1Elements.forEach(h1 => {
        if (firstH1Found) {
            // Convert subsequent H1s to H2
            const h2 = document.createElement('h2');
            h2.innerHTML = h1.innerHTML;
            Array.from(h1.attributes).forEach(attr => {
                h2.setAttribute(attr.name, attr.value);
            });
            h1.parentNode?.replaceChild(h2, h1);
        } else {
            firstH1Found = true;
        }
    });

    return temp.innerHTML;
}

// Process pasted content
export function processPastedContent(html: string): string {
    // First sanitize
    let processed = sanitizeHtml(html);
    // Then fix heading hierarchy
    processed = fixHeadingHierarchy(processed);
    return processed;
}

// Extract plain text from HTML
export function extractTextContent(html: string): string {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
}

// Generate excerpt from HTML content
export function generateExcerpt(html: string, maxLength: number = 160): string {
    const text = extractTextContent(html);
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}
