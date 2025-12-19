'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { renderBlogPost, getBlogCSS } from '@/lib/generator/blogRenderer';
import { generateExcerpt } from '@/lib/htmlSanitizer';
import styles from './blog-manager.module.css';

// Dynamic import to avoid SSR issues with contentEditable
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false });

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    author: string;
    publishedAt: string;
    updatedAt: string;
    status: 'draft' | 'published';
    tags: string[];
    featuredImage: string;
    featuredImageAlt: string;
    seo: {
        title: string;
        description: string;
        keywords: string[];
        ogImage?: string;
    };
    canonicalUrl?: string;
}

interface Website {
    id: string;
    businessName: string;
    netlifyUrl?: string;
    blogPosts: BlogPost[];
    seoSettings: {
        siteName: string;
        siteDescription: string;
    };
}

export default function BlogManagerPage() {
    const [website, setWebsite] = useState<Website | null>(null);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [view, setView] = useState<'list' | 'edit' | 'preview'>('list');
    const [isSaving, setIsSaving] = useState(false);

    // Load website data
    useEffect(() => {
        const savedData = localStorage.getItem('current-website');
        if (savedData) {
            const ws = JSON.parse(savedData);
            setWebsite(ws);
            setPosts(ws.blogPosts || []);
        }
    }, []);

    // Create new post
    const createNewPost = () => {
        const newPost: BlogPost = {
            id: `post-${Date.now()}`,
            title: '',
            slug: '',
            content: '',
            excerpt: '',
            author: website?.businessName || 'Admin',
            publishedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'draft',
            tags: [],
            featuredImage: '',
            featuredImageAlt: '',
            seo: {
                title: '',
                description: '',
                keywords: []
            }
        };
        setEditingPost(newPost);
        setView('edit');
    };

    // Edit existing post
    const editPost = (post: BlogPost) => {
        setEditingPost({ ...post });
        setView('edit');
    };

    // Delete post
    const deletePost = (postId: string) => {
        if (confirm('Are you sure you want to delete this post?')) {
            const updated = posts.filter(p => p.id !== postId);
            setPosts(updated);
            saveToStorage(updated);
        }
    };

    // Save post
    const savePost = () => {
        if (!editingPost) return;
        setIsSaving(true);

        const updatedPost = {
            ...editingPost,
            updatedAt: new Date().toISOString(),
            slug: editingPost.slug || generateSlug(editingPost.title)
        };

        // Auto-generate SEO fields if empty
        if (!updatedPost.seo.title) {
            updatedPost.seo.title = updatedPost.title;
        }
        if (!updatedPost.seo.description) {
            updatedPost.seo.description = updatedPost.excerpt || generateExcerpt(updatedPost.content);
        }

        let updated: BlogPost[];
        const existingIndex = posts.findIndex(p => p.id === updatedPost.id);
        if (existingIndex >= 0) {
            updated = posts.map(p => p.id === updatedPost.id ? updatedPost : p);
        } else {
            updated = [...posts, updatedPost];
        }

        setPosts(updated);
        saveToStorage(updated);
        setEditingPost(updatedPost);
        setIsSaving(false);
    };

    // Save to localStorage
    const saveToStorage = (updatedPosts: BlogPost[]) => {
        if (website) {
            const updatedWebsite = { ...website, blogPosts: updatedPosts };
            localStorage.setItem('current-website', JSON.stringify(updatedWebsite));
        }
    };

    // Generate slug from title
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .slice(0, 60);
    };

    // Handle title change and auto-generate slug
    const handleTitleChange = (title: string) => {
        if (!editingPost) return;
        const slug = editingPost.slug || generateSlug(title);
        setEditingPost({
            ...editingPost,
            title,
            slug,
            seo: {
                ...editingPost.seo,
                title: editingPost.seo.title || title
            }
        });
    };

    // Render preview
    const renderPreview = () => {
        if (!editingPost || !website) return '';

        const previewHtml = renderBlogPost(editingPost as any, website as any);
        return `
            <style>${getBlogCSS()}</style>
            ${previewHtml}
        `;
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <h1>📝 Blog Manager</h1>
                    {view === 'list' ? (
                        <button className={styles.primaryBtn} onClick={createNewPost}>
                            + New Post
                        </button>
                    ) : (
                        <div className={styles.headerActions}>
                            <button className={styles.secondaryBtn} onClick={() => setView('list')}>
                                ← Back to List
                            </button>
                            {view === 'edit' && (
                                <button className={styles.previewBtn} onClick={() => setView('preview')}>
                                    👁️ Preview
                                </button>
                            )}
                            {view === 'preview' && (
                                <button className={styles.previewBtn} onClick={() => setView('edit')}>
                                    ✏️ Edit
                                </button>
                            )}
                            <button className={styles.primaryBtn} onClick={savePost} disabled={isSaving}>
                                {isSaving ? 'Saving...' : '💾 Save'}
                            </button>
                        </div>
                    )}
                </div>

                {/* List View */}
                {view === 'list' && (
                    <div className={styles.postsList}>
                        {posts.length === 0 ? (
                            <div className={styles.emptyState}>
                                <p>No blog posts yet. Create your first post!</p>
                            </div>
                        ) : (
                            posts.map(post => (
                                <div key={post.id} className={styles.postCard}>
                                    <div className={styles.postInfo}>
                                        <h3>{post.title || 'Untitled Post'}</h3>
                                        <div className={styles.postMeta}>
                                            <span className={`${styles.status} ${styles[post.status]}`}>
                                                {post.status}
                                            </span>
                                            <span>{new Date(post.updatedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className={styles.postActions}>
                                        <button onClick={() => editPost(post)}>Edit</button>
                                        <button onClick={() => deletePost(post.id)} className={styles.deleteBtn}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Edit View */}
                {view === 'edit' && editingPost && (
                    <div className={styles.editView}>
                        <div className={styles.mainEditor}>
                            {/* Title */}
                            <input
                                type="text"
                                className={styles.titleInput}
                                placeholder="Post Title"
                                value={editingPost.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                            />

                            {/* Content Editor */}
                            <RichTextEditor
                                value={editingPost.content}
                                onChange={(content) => setEditingPost({ ...editingPost, content })}
                                onExcerptGenerate={(excerpt) => setEditingPost(prev => prev ? { ...prev, excerpt } : null)}
                                placeholder="Write your blog post content..."
                            />
                        </div>

                        {/* Sidebar */}
                        <div className={styles.sidebar}>
                            {/* Status */}
                            <div className={styles.sidebarSection}>
                                <h4>Status</h4>
                                <select
                                    value={editingPost.status}
                                    onChange={(e) => setEditingPost({
                                        ...editingPost,
                                        status: e.target.value as 'draft' | 'published'
                                    })}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>

                            {/* Featured Image */}
                            <div className={styles.sidebarSection}>
                                <h4>Featured Image</h4>
                                <input
                                    type="text"
                                    placeholder="Image URL"
                                    value={editingPost.featuredImage}
                                    onChange={(e) => setEditingPost({
                                        ...editingPost,
                                        featuredImage: e.target.value
                                    })}
                                />
                                <input
                                    type="text"
                                    placeholder="Alt text"
                                    value={editingPost.featuredImageAlt}
                                    onChange={(e) => setEditingPost({
                                        ...editingPost,
                                        featuredImageAlt: e.target.value
                                    })}
                                />
                                {editingPost.featuredImage && (
                                    <img src={editingPost.featuredImage} alt="Preview" className={styles.imagePreview} />
                                )}
                            </div>

                            {/* SEO */}
                            <div className={styles.sidebarSection}>
                                <h4>SEO Settings</h4>
                                <label>URL Slug</label>
                                <input
                                    type="text"
                                    value={editingPost.slug}
                                    onChange={(e) => setEditingPost({
                                        ...editingPost,
                                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')
                                    })}
                                />
                                <label>SEO Title</label>
                                <input
                                    type="text"
                                    placeholder={editingPost.title || 'SEO Title'}
                                    value={editingPost.seo.title}
                                    onChange={(e) => setEditingPost({
                                        ...editingPost,
                                        seo: { ...editingPost.seo, title: e.target.value }
                                    })}
                                />
                                <label>Meta Description</label>
                                <textarea
                                    placeholder="Brief description for search results..."
                                    value={editingPost.seo.description}
                                    onChange={(e) => setEditingPost({
                                        ...editingPost,
                                        seo: { ...editingPost.seo, description: e.target.value }
                                    })}
                                    rows={3}
                                />
                            </div>

                            {/* Tags */}
                            <div className={styles.sidebarSection}>
                                <h4>Tags</h4>
                                <input
                                    type="text"
                                    placeholder="Add tags (comma separated)"
                                    value={editingPost.tags.join(', ')}
                                    onChange={(e) => setEditingPost({
                                        ...editingPost,
                                        tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                                    })}
                                />
                            </div>

                            {/* Excerpt */}
                            <div className={styles.sidebarSection}>
                                <h4>Excerpt</h4>
                                <textarea
                                    placeholder="Brief excerpt for previews..."
                                    value={editingPost.excerpt}
                                    onChange={(e) => setEditingPost({
                                        ...editingPost,
                                        excerpt: e.target.value
                                    })}
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Preview View */}
                {view === 'preview' && editingPost && (
                    <div className={styles.previewView}>
                        <div className={styles.previewFrame}>
                            <div
                                className={styles.previewContent}
                                dangerouslySetInnerHTML={{ __html: renderPreview() }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
