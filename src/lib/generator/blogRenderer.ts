// Blog Renderer - Single source of truth for blog output
// Used by: Editor preview, Preview mode, Generated website

import { BlogPost, Website } from '../types';
import { generateArticleSchema } from './schema';

// External link detection
function isExternalLink(href: string): boolean {
    return href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//');
}

// Process content for output (add external link attributes, lazy loading, etc.)
export function processContentForOutput(html: string, baseUrl?: string): string {
    // Create a DOM parser approach using regex for server-side compatibility
    // Add target="_blank" rel="noopener noreferrer" to external links
    let processed = html.replace(
        /<a\s+([^>]*href=["'])(https?:\/\/|\/\/)([^"']+["'][^>]*)>/gi,
        (match, before, protocol, after) => {
            // Check if already has target
            if (match.includes('target=')) return match;
            return `<a ${before}${protocol}${after} target="_blank" rel="noopener noreferrer">`;
        }
    );

    // Add lazy loading to images
    processed = processed.replace(
        /<img\s+([^>]*)>/gi,
        (match, attrs) => {
            if (match.includes('loading=')) return match;
            return `<img ${attrs} loading="lazy">`;
        }
    );

    return processed;
}

// Render a single blog post page
export function renderBlogPost(post: BlogPost, website: Website): string {
    const baseUrl = website.netlifyUrl || '';
    const canonicalUrl = `${baseUrl}/blog/${post.slug}`;
    const processedContent = processContentForOutput(post.content, baseUrl);
    const schema = generateArticleSchema(post, website);

    return `
    <!-- Blog Post: ${post.title} -->
    <article class="blog-post" itemscope itemtype="https://schema.org/BlogPosting">
        <meta itemprop="mainEntityOfPage" content="${canonicalUrl}">
        
        <header class="blog-post-header">
            ${post.featuredImage ? `
            <figure class="blog-featured-image">
                <img 
                    src="${post.featuredImage}" 
                    alt="${post.seo?.ogImage ? post.title : post.title}"
                    itemprop="image"
                    loading="lazy"
                />
            </figure>
            ` : ''}
            
            <div class="blog-post-meta">
                <time datetime="${post.publishedAt}" itemprop="datePublished">
                    ${new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}
                </time>
                ${post.tags.length > 0 ? `
                <span class="blog-tags">
                    ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                </span>
                ` : ''}
            </div>
            
            <h1 itemprop="headline">${post.title}</h1>
            
            <div class="blog-author" itemprop="author" itemscope itemtype="https://schema.org/Person">
                <span itemprop="name">${post.author || website.businessName}</span>
            </div>
        </header>
        
        <div class="blog-post-content" itemprop="articleBody">
            ${processedContent}
        </div>
        
        <footer class="blog-post-footer">
            <div class="blog-share">
                <span>Share:</span>
                <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(canonicalUrl)}&text=${encodeURIComponent(post.title)}" target="_blank" rel="noopener noreferrer">Twitter</a>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}" target="_blank" rel="noopener noreferrer">Facebook</a>
                <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(canonicalUrl)}&title=${encodeURIComponent(post.title)}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
            
            <a href="/blog.html" class="back-to-blog">← Back to Blog</a>
        </footer>
    </article>
    
    <script type="application/ld+json">${JSON.stringify(schema.json, null, 2)}</script>
    `;
}

// Render blog list/index page
export function renderBlogList(posts: BlogPost[], website: Website): string {
    const publishedPosts = posts.filter(p => p.status === 'published')
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    if (publishedPosts.length === 0) {
        return `
        <section class="blog-list-section">
            <div class="container">
                <h1>Blog</h1>
                <p class="blog-empty">No blog posts yet. Check back soon for updates!</p>
            </div>
        </section>
        `;
    }

    return `
    <section class="blog-list-section">
        <div class="container">
            <header class="blog-list-header">
                <h1>Blog</h1>
                <p>Latest news, tips, and insights from ${website.businessName}</p>
            </header>
            
            <div class="blog-grid">
                ${publishedPosts.map(post => `
                <article class="blog-card">
                    <a href="/blog/${post.slug}.html" class="blog-card-link">
                        ${post.featuredImage ? `
                        <div class="blog-card-image">
                            <img src="${post.featuredImage}" alt="${post.title}" loading="lazy" />
                        </div>
                        ` : ''}
                        <div class="blog-card-content">
                            <time datetime="${post.publishedAt}">
                                ${new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })}
                            </time>
                            <h2>${post.title}</h2>
                            <p>${post.excerpt}</p>
                            <span class="read-more">Read More →</span>
                        </div>
                    </a>
                </article>
                `).join('')}
            </div>
        </div>
    </section>
    `;
}

// Blog-specific CSS
export function getBlogCSS(): string {
    return `
    /* Blog Post Styles */
    .blog-post {
        max-width: 800px;
        margin: 0 auto;
        padding: 40px 20px 80px;
    }
    
    .blog-post-header {
        margin-bottom: 40px;
    }
    
    .blog-featured-image {
        margin: 0 0 30px;
    }
    
    .blog-featured-image img {
        width: 100%;
        height: auto;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    
    .blog-post-meta {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 15px;
        font-size: 0.9rem;
        color: var(--text-light);
    }
    
    .blog-tags {
        display: flex;
        gap: 8px;
    }
    
    .blog-tag {
        background: var(--primary-light);
        color: var(--primary);
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 0.8rem;
    }
    
    .blog-post-header h1 {
        font-size: 2.5rem;
        line-height: 1.2;
        margin-bottom: 15px;
    }
    
    .blog-author {
        color: var(--text-light);
        font-size: 0.95rem;
    }
    
    /* Blog Content */
    .blog-post-content {
        line-height: 1.8;
        font-size: 1.1rem;
    }
    
    .blog-post-content h2 {
        font-size: 1.75rem;
        margin: 2em 0 0.75em;
        color: var(--text);
    }
    
    .blog-post-content h3 {
        font-size: 1.4rem;
        margin: 1.75em 0 0.5em;
        color: var(--text);
    }
    
    .blog-post-content h4, 
    .blog-post-content h5, 
    .blog-post-content h6 {
        font-size: 1.2rem;
        margin: 1.5em 0 0.5em;
        color: var(--text);
    }
    
    .blog-post-content p {
        margin: 1.25em 0;
    }
    
    .blog-post-content ul, 
    .blog-post-content ol {
        margin: 1.25em 0;
        padding-left: 2em;
    }
    
    .blog-post-content li {
        margin: 0.5em 0;
    }
    
    .blog-post-content blockquote {
        margin: 2em 0;
        padding: 1.5em 2em;
        border-left: 4px solid var(--primary);
        background: linear-gradient(to right, rgba(var(--primary-rgb), 0.05), transparent);
        font-style: italic;
        font-size: 1.15rem;
    }
    
    .blog-post-content pre {
        margin: 2em 0;
        padding: 1.5em;
        background: #1a1a2e;
        color: #e0e0e0;
        border-radius: 12px;
        overflow-x: auto;
        font-size: 0.9rem;
    }
    
    .blog-post-content code {
        background: rgba(0,0,0,0.05);
        padding: 0.2em 0.5em;
        border-radius: 4px;
        font-size: 0.9em;
    }
    
    .blog-post-content img {
        max-width: 100%;
        height: auto;
        border-radius: 12px;
        margin: 2em 0;
    }
    
    .blog-post-content a {
        color: var(--primary);
        text-decoration: underline;
        text-decoration-thickness: 1px;
        text-underline-offset: 2px;
    }
    
    .blog-post-content a:hover {
        text-decoration-thickness: 2px;
    }
    
    .blog-post-content table {
        width: 100%;
        border-collapse: collapse;
        margin: 2em 0;
    }
    
    .blog-post-content th,
    .blog-post-content td {
        border: 1px solid var(--text-light);
        padding: 12px 16px;
        text-align: left;
    }
    
    .blog-post-content th {
        background: var(--primary-light);
        font-weight: 600;
    }
    
    /* Blog Footer */
    .blog-post-footer {
        margin-top: 60px;
        padding-top: 30px;
        border-top: 1px solid rgba(0,0,0,0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 20px;
    }
    
    .blog-share {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .blog-share a {
        color: var(--primary);
        text-decoration: none;
        font-weight: 500;
    }
    
    .back-to-blog {
        color: var(--text-light);
        text-decoration: none;
        font-weight: 500;
    }
    
    .back-to-blog:hover {
        color: var(--primary);
    }
    
    /* Blog List */
    .blog-list-section {
        padding: 60px 0 100px;
    }
    
    .blog-list-header {
        text-align: center;
        margin-bottom: 50px;
    }
    
    .blog-list-header h1 {
        font-size: 2.5rem;
        margin-bottom: 10px;
    }
    
    .blog-list-header p {
        color: var(--text-light);
        font-size: 1.1rem;
    }
    
    .blog-empty {
        text-align: center;
        color: var(--text-light);
        padding: 60px 20px;
    }
    
    .blog-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 30px;
    }
    
    .blog-card {
        background: white;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 5px 20px rgba(0,0,0,0.08);
        transition: all 0.3s ease;
    }
    
    .blog-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 40px rgba(0,0,0,0.12);
    }
    
    .blog-card-link {
        display: block;
        text-decoration: none;
        color: inherit;
    }
    
    .blog-card-image {
        aspect-ratio: 16/10;
        overflow: hidden;
    }
    
    .blog-card-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }
    
    .blog-card:hover .blog-card-image img {
        transform: scale(1.05);
    }
    
    .blog-card-content {
        padding: 24px;
    }
    
    .blog-card-content time {
        font-size: 0.85rem;
        color: var(--text-light);
    }
    
    .blog-card-content h2 {
        font-size: 1.25rem;
        margin: 10px 0;
        line-height: 1.4;
    }
    
    .blog-card-content p {
        color: var(--text-light);
        font-size: 0.95rem;
        line-height: 1.6;
        margin-bottom: 15px;
    }
    
    .read-more {
        color: var(--primary);
        font-weight: 600;
        font-size: 0.9rem;
    }
    
    @media (max-width: 768px) {
        .blog-post-header h1 {
            font-size: 1.75rem;
        }
        
        .blog-post-content {
            font-size: 1rem;
        }
        
        .blog-list-header h1 {
            font-size: 2rem;
        }
        
        .blog-grid {
            grid-template-columns: 1fr;
        }
    }
    `;
}
