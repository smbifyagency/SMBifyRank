'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { saveAs } from 'file-saver';
import { Website, Page, BlogPost, Service, Location } from '@/lib/types';
import { getWebsite, saveWebsite, deleteBlogPost, generateId } from '@/lib/storage';
import { downloadWebsiteZip, getPagePreviewHtml, getBlogPostPreviewHtml } from '@/lib/export';
import { deployWebsite, verifyNetlifyToken } from '@/lib/netlify';
import { generateBlogPost, slugify } from '@/lib/generator';
import styles from './dashboard.module.css';

type Tab = 'pages' | 'blog' | 'services' | 'locations' | 'seo' | 'deploy';

export default function DashboardPage() {
    const params = useParams();
    const router = useRouter();
    const websiteId = params.id as string;

    const [website, setWebsite] = useState<Website | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>('pages');
    const [isLoading, setIsLoading] = useState(true);
    const [isDeploying, setIsDeploying] = useState(false);
    const [netlifyToken, setNetlifyToken] = useState('');
    const [showTokenModal, setShowTokenModal] = useState(false);

    // Blog state
    const [newBlogTitle, setNewBlogTitle] = useState('');
    const [newBlogContent, setNewBlogContent] = useState('');
    const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

    // Service state
    const [newServiceName, setNewServiceName] = useState('');
    const [newServiceDesc, setNewServiceDesc] = useState('');
    const [editingService, setEditingService] = useState<Service | null>(null);

    // Location state
    const [newLocationCity, setNewLocationCity] = useState('');
    const [newLocationState, setNewLocationState] = useState('');
    const [editingLocation, setEditingLocation] = useState<Location | null>(null);

    // Preview state
    const [showPreview, setShowPreview] = useState(false);
    const [previewHtml, setPreviewHtml] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [previewType, setPreviewType] = useState('');
    const [previewViewMode, setPreviewViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

    useEffect(() => {
        const ws = getWebsite(websiteId);
        if (ws) {
            setWebsite(ws);
        } else {
            router.push('/');
        }
        setIsLoading(false);
    }, [websiteId, router]);

    const handleSave = (updatedWebsite: Website) => {
        saveWebsite(updatedWebsite);
        setWebsite(updatedWebsite);
    };

    const handleExport = async () => {
        if (!website) return;
        try {
            const response = await fetch('/api/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(website),
            });

            if (!response.ok) {
                throw new Error('Export failed');
            }

            // Generate filename from website name
            const safeName = (website.name || website.businessName || 'website')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '') || 'website';
            const filename = `${safeName}-website.zip`;

            // Get blob data
            const blob = await response.blob();

            // Convert blob to base64 data URL using FileReader
            const reader = new FileReader();
            reader.onload = function () {
                const dataUrl = reader.result as string;

                // Create download link with data URL
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = filename;

                // Trigger download
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
            reader.readAsDataURL(blob);

        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export website');
        }
    };

    const handleDeploy = async () => {
        if (!website) return;

        const token = netlifyToken || localStorage.getItem('ai-builder-netlify-token');
        if (!token) {
            setShowTokenModal(true);
            return;
        }

        const isValid = await verifyNetlifyToken(token);
        if (!isValid) {
            alert('Invalid Netlify token. Please check and try again.');
            setShowTokenModal(true);
            return;
        }

        setIsDeploying(true);
        try {
            const result = await deployWebsite(token, website);
            const updatedWebsite = {
                ...website,
                status: 'published' as const,
                netlifyUrl: result.siteUrl,
                netlifySiteId: result.siteId,
            };
            handleSave(updatedWebsite);
            alert(`Website deployed successfully!\n\nLive URL: ${result.siteUrl}`);
        } catch (error) {
            console.error('Deploy failed:', error);
            alert('Deployment failed. Please try again.');
        } finally {
            setIsDeploying(false);
        }
    };

    const handleSaveToken = () => {
        if (netlifyToken) {
            localStorage.setItem('ai-builder-netlify-token', netlifyToken);
            setShowTokenModal(false);
            handleDeploy();
        }
    };

    // Blog handlers
    const handleAddBlogPost = () => {
        if (!website || !newBlogTitle.trim()) return;

        const post = generateBlogPost(newBlogTitle, newBlogContent, website.id);
        const updatedWebsite = {
            ...website,
            blogPosts: [...website.blogPosts, post],
        };
        handleSave(updatedWebsite);
        setNewBlogTitle('');
        setNewBlogContent('');
    };

    const handleUpdateBlogPost = () => {
        if (!website || !editingBlog) return;

        const updatedWebsite = {
            ...website,
            blogPosts: website.blogPosts.map(p =>
                p.id === editingBlog.id ? editingBlog : p
            ),
        };
        handleSave(updatedWebsite);
        setEditingBlog(null);
    };

    const handleDeleteBlogPost = (postId: string) => {
        if (!website) return;
        if (confirm('Delete this blog post?')) {
            deleteBlogPost(website.id, postId);
            setWebsite(getWebsite(website.id));
        }
    };

    const handlePublishBlogPost = (postId: string) => {
        if (!website) return;
        const updatedWebsite = {
            ...website,
            blogPosts: website.blogPosts.map(p =>
                p.id === postId ? { ...p, status: 'published' as const } : p
            ),
        };
        handleSave(updatedWebsite);
    };

    // Service handlers
    const handleAddService = () => {
        if (!website || !newServiceName.trim()) return;

        const newService: Service = {
            id: generateId(),
            name: newServiceName,
            description: newServiceDesc || `Professional ${newServiceName} services`,
            slug: slugify(newServiceName),
            icon: '🔧',
        };

        // Create a new service page
        const servicePage: Page = {
            id: generateId(),
            title: newServiceName,
            slug: `services/${newService.slug}`,
            type: 'service-single',
            content: [
                {
                    id: generateId(),
                    type: 'hero',
                    content: {
                        headline: newServiceName,
                        subheadline: `Professional ${newServiceName} services by ${website.businessName}`,
                        showCta: true,
                        ctaText: 'Get Free Estimate',
                        ctaLink: '/contact',
                    },
                    order: 0,
                },
                {
                    id: generateId(),
                    type: 'custom-content',
                    content: {
                        html: `
                            <div class="service-content">
                                <h2>About Our ${newServiceName} Service</h2>
                                <p>${newServiceDesc || `We provide professional ${newServiceName} services to meet all your needs.`}</p>
                                
                                <h3>Why Choose Us?</h3>
                                <ul>
                                    <li>Experienced and certified professionals</li>
                                    <li>State-of-the-art equipment</li>
                                    <li>Fast response times</li>
                                    <li>Competitive pricing</li>
                                    <li>100% satisfaction guarantee</li>
                                </ul>
                            </div>
                        `,
                    },
                    order: 1,
                },
                {
                    id: generateId(),
                    type: 'cta',
                    content: {
                        title: `Need ${newServiceName}?`,
                        subtitle: 'Contact us now for immediate assistance',
                        ctaText: 'Get Quote',
                        ctaLink: '/contact',
                    },
                    order: 2,
                },
            ],
            seo: {
                title: `${newServiceName} | ${website.businessName}`,
                description: `Professional ${newServiceName} services by ${website.businessName}. Contact us for a free estimate.`,
                keywords: [newServiceName, website.industry, website.businessName],
            },
            order: website.pages.length,
            isPublished: true,
        };

        const updatedWebsite = {
            ...website,
            services: [...website.services, newService],
            pages: [...website.pages, servicePage],
        };
        handleSave(updatedWebsite);
        setNewServiceName('');
        setNewServiceDesc('');
    };

    const handleUpdateService = () => {
        if (!website || !editingService) return;

        const updatedWebsite = {
            ...website,
            services: website.services.map(s =>
                s.id === editingService.id ? editingService : s
            ),
        };
        handleSave(updatedWebsite);
        setEditingService(null);
    };

    const handleDeleteService = (serviceId: string) => {
        if (!website) return;
        const service = website.services.find(s => s.id === serviceId);
        if (!service) return;

        if (confirm(`Delete service "${service.name}" and its page?`)) {
            const updatedWebsite = {
                ...website,
                services: website.services.filter(s => s.id !== serviceId),
                pages: website.pages.filter(p => p.slug !== `services/${service.slug}`),
            };
            handleSave(updatedWebsite);
        }
    };

    // Location handlers
    const handleAddLocation = () => {
        if (!website || !newLocationCity.trim()) return;

        const newLocation: Location = {
            id: generateId(),
            city: newLocationCity,
            state: newLocationState,
            slug: slugify(newLocationCity),
            description: `${website.businessName} provides professional services in ${newLocationCity}.`,
        };

        // Create a new location page
        const locationPage: Page = {
            id: generateId(),
            title: `${newLocationCity} Services`,
            slug: `locations/${newLocation.slug}`,
            type: 'location',
            content: [
                {
                    id: generateId(),
                    type: 'hero',
                    content: {
                        headline: `${website.industry} Services in ${newLocationCity}`,
                        subheadline: `${website.businessName} - Your local experts`,
                        showCta: true,
                        ctaText: 'Get Free Estimate',
                        ctaLink: '/contact',
                    },
                    order: 0,
                },
                {
                    id: generateId(),
                    type: 'custom-content',
                    content: {
                        html: `
                            <div class="location-content">
                                <h2>Services in ${newLocationCity}${newLocationState ? `, ${newLocationState}` : ''}</h2>
                                <p>${website.businessName} proudly serves ${newLocationCity} and surrounding areas with professional ${website.industry} services.</p>
                                
                                <h3>Services Available in ${newLocationCity}</h3>
                                <ul>
                                    ${website.services.map(s => `<li><a href="/services/${s.slug}">${s.name}</a></li>`).join('\n')}
                                </ul>
                                
                                <h3>Why Choose Us in ${newLocationCity}?</h3>
                                <ul>
                                    <li>Fast response times - We're local!</li>
                                    <li>Knowledge of local building codes</li>
                                    <li>Trusted by ${newLocationCity} residents</li>
                                    <li>Emergency services available 24/7</li>
                                </ul>
                            </div>
                        `,
                    },
                    order: 1,
                },
                {
                    id: generateId(),
                    type: 'cta',
                    content: {
                        title: `Need Help in ${newLocationCity}?`,
                        subtitle: 'Our local team is ready to assist you',
                        ctaText: 'Contact Us',
                        ctaLink: '/contact',
                    },
                    order: 2,
                },
            ],
            seo: {
                title: `${website.industry} Services in ${newLocationCity} | ${website.businessName}`,
                description: `Professional ${website.industry} services in ${newLocationCity}${newLocationState ? `, ${newLocationState}` : ''}. Contact ${website.businessName} today!`,
                keywords: [newLocationCity, website.industry, ...website.services.map(s => s.name)],
            },
            order: website.pages.length,
            isPublished: true,
        };

        const updatedWebsite = {
            ...website,
            locations: [...website.locations, newLocation],
            pages: [...website.pages, locationPage],
        };
        handleSave(updatedWebsite);
        setNewLocationCity('');
        setNewLocationState('');
    };

    const handleUpdateLocation = () => {
        if (!website || !editingLocation) return;

        const updatedWebsite = {
            ...website,
            locations: website.locations.map(l =>
                l.id === editingLocation.id ? editingLocation : l
            ),
        };
        handleSave(updatedWebsite);
        setEditingLocation(null);
    };

    const handleDeleteLocation = (locationId: string) => {
        if (!website) return;
        const location = website.locations.find(l => l.id === locationId);
        if (!location) return;

        if (confirm(`Delete location "${location.city}" and its page?`)) {
            const updatedWebsite = {
                ...website,
                locations: website.locations.filter(l => l.id !== locationId),
                pages: website.pages.filter(p => p.slug !== `locations/${location.slug}`),
            };
            handleSave(updatedWebsite);
        }
    };

    const updateSEO = (pageId: string, updates: Partial<Page['seo']>) => {
        if (!website) return;
        const updatedWebsite = {
            ...website,
            pages: website.pages.map(p =>
                p.id === pageId ? { ...p, seo: { ...p.seo, ...updates } } : p
            ),
        };
        handleSave(updatedWebsite);
    };

    // Preview handlers
    const handlePreviewPage = (page: Page) => {
        if (!website) return;
        const html = getPagePreviewHtml(website, page);
        setPreviewHtml(html);
        setPreviewTitle(page.title);
        setPreviewType(page.type);
        setShowPreview(true);
    };

    const handlePreviewBlogPost = (post: BlogPost) => {
        if (!website) return;
        const html = getBlogPostPreviewHtml(website, post);
        setPreviewHtml(html);
        setPreviewTitle(post.title);
        setPreviewType('blog');
        setShowPreview(true);
    };

    const handlePreviewService = (service: Service) => {
        if (!website) return;
        const page = website.pages.find(p => p.slug === `services/${service.slug}`);
        if (page) {
            handlePreviewPage(page);
        }
    };

    const handlePreviewLocation = (location: Location) => {
        if (!website) return;
        const page = website.pages.find(p => p.slug === `locations/${location.slug}`);
        if (page) {
            handlePreviewPage(page);
        }
    };

    if (isLoading || !website) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/" className={styles.backBtn}>← Back</Link>
                    <h1>{website.businessName}</h1>
                    <span className={`${styles.badge} ${website.status === 'published' ? styles.published : styles.draft}`}>
                        {website.status}
                    </span>
                </div>
                <div className={styles.headerRight}>
                    <Link href={`/editor/${website.id}`} className={styles.previewBtn}>
                        👁️ Preview
                    </Link>
                    <button onClick={handleExport} className={styles.exportBtn}>
                        📦 Export ZIP
                    </button>
                    <button
                        onClick={handleDeploy}
                        className={styles.deployBtn}
                        disabled={isDeploying}
                    >
                        {isDeploying ? '🔄 Deploying...' : '🚀 Go Live'}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className={styles.main}>
                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    <nav className={styles.nav}>
                        {(['pages', 'blog', 'services', 'locations', 'seo', 'deploy'] as Tab[]).map(tab => (
                            <button
                                key={tab}
                                className={`${styles.navItem} ${activeTab === tab ? styles.active : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab === 'pages' && '📄'}
                                {tab === 'blog' && '📝'}
                                {tab === 'services' && '🔧'}
                                {tab === 'locations' && '📍'}
                                {tab === 'seo' && '🔍'}
                                {tab === 'deploy' && '🚀'}
                                <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                            </button>
                        ))}
                    </nav>

                    <div className={styles.stats}>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{website.pages.length}</span>
                            <span className={styles.statLabel}>Pages</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{website.services.length}</span>
                            <span className={styles.statLabel}>Services</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{website.locations.length}</span>
                            <span className={styles.statLabel}>Locations</span>
                        </div>
                    </div>
                </aside>

                {/* Content Area */}
                <main className={styles.content}>
                    {/* Pages Tab */}
                    {activeTab === 'pages' && (
                        <div className={styles.panel}>
                            <div className={styles.panelHeader}>
                                <h2>Pages</h2>
                            </div>
                            <div className={styles.pageList}>
                                {website.pages.map(page => (
                                    <div key={page.id} className={styles.pageItem}>
                                        <div className={styles.pageInfo}>
                                            <h3>{page.title}</h3>
                                            <span className={styles.pageSlug}>/{page.slug || 'home'}</span>
                                        </div>
                                        <div className={styles.pageActions}>
                                            <span className={`${styles.pageType}`}>{page.type}</span>
                                            <button
                                                onClick={() => handlePreviewPage(page)}
                                                className={styles.quickPreviewBtn}
                                            >
                                                👁️ Preview
                                            </button>
                                            <Link href={`/editor/${website.id}?page=${page.id}`} className={styles.editLink}>
                                                Edit
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Blog Tab */}
                    {activeTab === 'blog' && (
                        <div className={styles.panel}>
                            <div className={styles.panelHeader}>
                                <h2>Blog Posts</h2>
                            </div>

                            {/* New Post Form */}
                            <div className={styles.newPostForm}>
                                <h3>Create New Post</h3>
                                <input
                                    type="text"
                                    placeholder="Post title"
                                    value={newBlogTitle}
                                    onChange={(e) => setNewBlogTitle(e.target.value)}
                                    className={styles.input}
                                />
                                <textarea
                                    placeholder="Post content (HTML supported for backlinks)"
                                    value={newBlogContent}
                                    onChange={(e) => setNewBlogContent(e.target.value)}
                                    className={styles.textarea}
                                />
                                <button onClick={handleAddBlogPost} className={styles.addBtn}>
                                    + Add Post
                                </button>
                            </div>

                            {/* Posts List */}
                            <div className={styles.postList}>
                                {website.blogPosts.map(post => (
                                    <div key={post.id} className={styles.postItem}>
                                        {editingBlog?.id === post.id ? (
                                            <div className={styles.editForm}>
                                                <input
                                                    type="text"
                                                    value={editingBlog.title}
                                                    onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                                                    className={styles.input}
                                                />
                                                <textarea
                                                    value={editingBlog.content}
                                                    onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                                                    className={styles.textarea}
                                                />
                                                <div className={styles.editActions}>
                                                    <button onClick={handleUpdateBlogPost} className={styles.saveBtn}>Save</button>
                                                    <button onClick={() => setEditingBlog(null)} className={styles.cancelBtn}>Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className={styles.postInfo}>
                                                    <h4>{post.title}</h4>
                                                    <span className={styles.postMeta}>
                                                        {new Date(post.publishedAt).toLocaleDateString()} •
                                                        <span className={post.status === 'published' ? styles.published : styles.draft}>
                                                            {post.status}
                                                        </span>
                                                    </span>
                                                </div>
                                                <div className={styles.postActions}>
                                                    <button
                                                        onClick={() => handlePreviewBlogPost(post)}
                                                        className={styles.quickPreviewBtn}
                                                    >
                                                        👁️
                                                    </button>
                                                    <button onClick={() => setEditingBlog(post)} className={styles.editBtn}>Edit</button>
                                                    {post.status === 'draft' && (
                                                        <button onClick={() => handlePublishBlogPost(post.id)} className={styles.publishBtn}>
                                                            Publish
                                                        </button>
                                                    )}
                                                    <button onClick={() => handleDeleteBlogPost(post.id)} className={styles.deleteBtn}>
                                                        🗑️
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                                {website.blogPosts.length === 0 && (
                                    <p className={styles.emptyText}>No blog posts yet. Create your first post above.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Services Tab */}
                    {activeTab === 'services' && (
                        <div className={styles.panel}>
                            <div className={styles.panelHeader}>
                                <h2>Services</h2>
                            </div>

                            {/* Add Service Form */}
                            <div className={styles.newPostForm}>
                                <h3>Add New Service</h3>
                                <input
                                    type="text"
                                    placeholder="Service name (e.g., Mold Remediation)"
                                    value={newServiceName}
                                    onChange={(e) => setNewServiceName(e.target.value)}
                                    className={styles.input}
                                />
                                <textarea
                                    placeholder="Service description"
                                    value={newServiceDesc}
                                    onChange={(e) => setNewServiceDesc(e.target.value)}
                                    className={styles.textarea}
                                />
                                <button onClick={handleAddService} className={styles.addBtn}>
                                    + Add Service
                                </button>
                            </div>

                            <div className={styles.itemList}>
                                {website.services.map(service => (
                                    <div key={service.id} className={styles.listItem}>
                                        {editingService?.id === service.id ? (
                                            <div className={styles.editForm} style={{ flex: 1 }}>
                                                <input
                                                    type="text"
                                                    value={editingService.name}
                                                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                                                    className={styles.input}
                                                />
                                                <textarea
                                                    value={editingService.description}
                                                    onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                                                    className={styles.textarea}
                                                />
                                                <div className={styles.editActions}>
                                                    <button onClick={handleUpdateService} className={styles.saveBtn}>Save</button>
                                                    <button onClick={() => setEditingService(null)} className={styles.cancelBtn}>Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className={styles.itemIcon}>{service.icon}</div>
                                                <div className={styles.itemInfo}>
                                                    <h4>{service.name}</h4>
                                                    <p>{service.description.substring(0, 100)}...</p>
                                                </div>
                                                <div className={styles.itemActions}>
                                                    <button
                                                        onClick={() => handlePreviewService(service)}
                                                        className={styles.quickPreviewBtn}
                                                    >
                                                        👁️
                                                    </button>
                                                    <button onClick={() => setEditingService(service)} className={styles.editBtn}>Edit</button>
                                                    <Link href={`/editor/${website.id}?page=${website.pages.find(p => p.slug === `services/${service.slug}`)?.id}`} className={styles.editLink}>
                                                        Edit Page
                                                    </Link>
                                                    <button onClick={() => handleDeleteService(service.id)} className={styles.deleteBtn}>
                                                        🗑️
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Locations Tab */}
                    {activeTab === 'locations' && (
                        <div className={styles.panel}>
                            <div className={styles.panelHeader}>
                                <h2>Locations</h2>
                            </div>

                            {/* Add Location Form */}
                            <div className={styles.newPostForm}>
                                <h3>Add New Location</h3>
                                <div className={styles.formRow}>
                                    <input
                                        type="text"
                                        placeholder="City (e.g., Fort Lauderdale)"
                                        value={newLocationCity}
                                        onChange={(e) => setNewLocationCity(e.target.value)}
                                        className={styles.input}
                                    />
                                    <input
                                        type="text"
                                        placeholder="State (e.g., FL)"
                                        value={newLocationState}
                                        onChange={(e) => setNewLocationState(e.target.value)}
                                        className={styles.input}
                                        style={{ maxWidth: '100px' }}
                                    />
                                </div>
                                <button onClick={handleAddLocation} className={styles.addBtn}>
                                    + Add Location
                                </button>
                            </div>

                            <div className={styles.itemList}>
                                {website.locations.map(location => (
                                    <div key={location.id} className={styles.listItem}>
                                        {editingLocation?.id === location.id ? (
                                            <div className={styles.editForm} style={{ flex: 1 }}>
                                                <div className={styles.formRow}>
                                                    <input
                                                        type="text"
                                                        value={editingLocation.city}
                                                        onChange={(e) => setEditingLocation({ ...editingLocation, city: e.target.value })}
                                                        className={styles.input}
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editingLocation.state || ''}
                                                        onChange={(e) => setEditingLocation({ ...editingLocation, state: e.target.value })}
                                                        className={styles.input}
                                                        style={{ maxWidth: '100px' }}
                                                    />
                                                </div>
                                                <div className={styles.editActions}>
                                                    <button onClick={handleUpdateLocation} className={styles.saveBtn}>Save</button>
                                                    <button onClick={() => setEditingLocation(null)} className={styles.cancelBtn}>Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className={styles.itemIcon}>📍</div>
                                                <div className={styles.itemInfo}>
                                                    <h4>{location.city}{location.state ? `, ${location.state}` : ''}</h4>
                                                    <p>/{location.slug}</p>
                                                </div>
                                                <div className={styles.itemActions}>
                                                    <button
                                                        onClick={() => handlePreviewLocation(location)}
                                                        className={styles.quickPreviewBtn}
                                                    >
                                                        👁️
                                                    </button>
                                                    <button onClick={() => setEditingLocation(location)} className={styles.editBtn}>Edit</button>
                                                    <Link href={`/editor/${website.id}?page=${website.pages.find(p => p.slug === `locations/${location.slug}`)?.id}`} className={styles.editLink}>
                                                        Edit Page
                                                    </Link>
                                                    <button onClick={() => handleDeleteLocation(location.id)} className={styles.deleteBtn}>
                                                        🗑️
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SEO Tab */}
                    {activeTab === 'seo' && (
                        <div className={styles.panel}>
                            <div className={styles.panelHeader}>
                                <h2>SEO Settings</h2>
                            </div>
                            <div className={styles.seoList}>
                                {website.pages.map(page => (
                                    <div key={page.id} className={styles.seoItem}>
                                        <h4>{page.title}</h4>
                                        <div className={styles.seoFields}>
                                            <div className={styles.field}>
                                                <label>Title Tag</label>
                                                <input
                                                    type="text"
                                                    value={page.seo.title}
                                                    onChange={(e) => updateSEO(page.id, { title: e.target.value })}
                                                    className={styles.input}
                                                />
                                            </div>
                                            <div className={styles.field}>
                                                <label>Meta Description</label>
                                                <textarea
                                                    value={page.seo.description}
                                                    onChange={(e) => updateSEO(page.id, { description: e.target.value })}
                                                    className={styles.textarea}
                                                    rows={2}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Deploy Tab */}
                    {activeTab === 'deploy' && (
                        <div className={styles.panel}>
                            <div className={styles.panelHeader}>
                                <h2>Deployment</h2>
                            </div>
                            <div className={styles.deploySection}>
                                <div className={styles.deployCard}>
                                    <h3>📦 Download ZIP</h3>
                                    <p>Download your website as a ZIP file. Host it anywhere.</p>
                                    <button onClick={handleExport} className={styles.actionBtn}>
                                        Download ZIP
                                    </button>
                                </div>

                                <div className={styles.deployCard}>
                                    <h3>🚀 Deploy to Netlify</h3>
                                    <p>One-click deployment to Netlify. Get a live URL instantly.</p>
                                    <button
                                        onClick={handleDeploy}
                                        className={styles.actionBtn}
                                        disabled={isDeploying}
                                    >
                                        {isDeploying ? 'Deploying...' : 'Deploy Now'}
                                    </button>
                                    {website.netlifyUrl && (
                                        <a href={website.netlifyUrl} target="_blank" rel="noopener noreferrer" className={styles.liveUrl}>
                                            🌐 {website.netlifyUrl}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Netlify Token Modal */}
            {showTokenModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h3>Netlify API Token</h3>
                        <p>Enter your Netlify personal access token to deploy.</p>
                        <a href="https://app.netlify.com/user/applications#personal-access-tokens" target="_blank" rel="noopener noreferrer">
                            Get your token here →
                        </a>
                        <input
                            type="password"
                            placeholder="Enter token..."
                            value={netlifyToken}
                            onChange={(e) => setNetlifyToken(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.modalActions}>
                            <button onClick={handleSaveToken} className={styles.saveBtn}>Save & Deploy</button>
                            <button onClick={() => setShowTokenModal(false)} className={styles.cancelBtn}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {showPreview && (
                <div className={styles.previewModal}>
                    <div className={styles.previewHeader}>
                        <div className={styles.previewTitle}>
                            <h3>{previewTitle}</h3>
                            <span className={styles.previewType}>{previewType}</span>
                        </div>
                        <div className={styles.previewControls}>
                            <button
                                className={`${styles.viewModeBtn} ${previewViewMode === 'desktop' ? styles.active : ''}`}
                                onClick={() => setPreviewViewMode('desktop')}
                                title="Desktop"
                            >
                                🖥️
                            </button>
                            <button
                                className={`${styles.viewModeBtn} ${previewViewMode === 'tablet' ? styles.active : ''}`}
                                onClick={() => setPreviewViewMode('tablet')}
                                title="Tablet"
                            >
                                📱
                            </button>
                            <button
                                className={`${styles.viewModeBtn} ${previewViewMode === 'mobile' ? styles.active : ''}`}
                                onClick={() => setPreviewViewMode('mobile')}
                                title="Mobile"
                            >
                                📲
                            </button>
                            <button
                                className={styles.closePreviewBtn}
                                onClick={() => setShowPreview(false)}
                            >
                                ✕ Close
                            </button>
                        </div>
                    </div>
                    <div className={styles.previewBody}>
                        <div className={`${styles.previewFrame} ${styles[previewViewMode]}`}>
                            <iframe srcDoc={previewHtml} title="Page Preview" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
