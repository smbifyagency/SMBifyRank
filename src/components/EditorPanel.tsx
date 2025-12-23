// Enhanced Editor Panel - JSON-first section editing
// Replaces inline DOM editing with form-based JSON editing

'use client';

import React, { useState, useCallback } from 'react';
import { Website, Page, PageSection, SectionContent, SectionType } from '@/lib/types';
import { SectionEditor } from '@/components/sections/SectionEditor';
import { getDefaultSectionContent, createSection, markAsUserEdited, resetSectionLock } from '@/lib/sectionHelpers';
import { regenerateSection, generateSectionJSON } from '@/lib/aiSections';
import styles from './EditorPanel.module.css';

interface EditorPanelProps {
    website: Website;
    currentPage: Page;
    onUpdateWebsite: (website: Website) => void;
    onRefreshPreview: () => void;
}

type PanelTab = 'sections' | 'page-settings' | 'site-settings';

export function EditorPanel({ website, currentPage, onUpdateWebsite, onRefreshPreview }: EditorPanelProps) {
    const [activeTab, setActiveTab] = useState<PanelTab>('sections');
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
    const [isRegenerating, setIsRegenerating] = useState<string | null>(null);

    // Get sorted sections for current page
    const sections = [...(currentPage.content || [])].sort((a, b) => a.order - b.order);

    // Currently selected section
    const selectedSection = sections.find(s => s.id === selectedSectionId) || null;

    // Business context for AI generation
    const businessContext = {
        businessName: website.businessName,
        industry: website.industry,
        phone: website.contactPhone,
        email: website.contactEmail,
        city: website.locations?.[0]?.city,
        state: website.locations?.[0]?.state,
        services: website.services?.map(s => ({ name: s.name, description: s.description })),
        locations: website.locations?.map(l => ({ city: l.city, state: l.state })),
    };

    // Update a section's content
    const updateSectionContent = useCallback((sectionId: string, content: SectionContent) => {
        const updatedPage = {
            ...currentPage,
            content: currentPage.content.map(section =>
                section.id === sectionId
                    ? {
                        ...section,
                        content,
                        userEdited: true,
                        lastEditedAt: new Date().toISOString(),
                        lastEditedBy: 'user' as const
                    }
                    : section
            ),
        };

        const updatedWebsite = {
            ...website,
            pages: website.pages.map(p =>
                p.id === currentPage.id ? updatedPage : p
            ),
            updatedAt: new Date().toISOString(),
        };

        onUpdateWebsite(updatedWebsite);
        onRefreshPreview();
    }, [website, currentPage, onUpdateWebsite, onRefreshPreview]);

    // Add a new section
    const addSection = useCallback((type: SectionType) => {
        const newSection = createSection(type, sections.length);

        const updatedPage = {
            ...currentPage,
            content: [...currentPage.content, newSection],
        };

        const updatedWebsite = {
            ...website,
            pages: website.pages.map(p =>
                p.id === currentPage.id ? updatedPage : p
            ),
            updatedAt: new Date().toISOString(),
        };

        onUpdateWebsite(updatedWebsite);
        setSelectedSectionId(newSection.id);
        onRefreshPreview();
    }, [website, currentPage, sections.length, onUpdateWebsite, onRefreshPreview]);

    // Delete a section
    const deleteSection = useCallback((sectionId: string) => {
        if (!confirm('Delete this section?')) return;

        const updatedPage = {
            ...currentPage,
            content: currentPage.content.filter(s => s.id !== sectionId),
        };

        const updatedWebsite = {
            ...website,
            pages: website.pages.map(p =>
                p.id === currentPage.id ? updatedPage : p
            ),
            updatedAt: new Date().toISOString(),
        };

        onUpdateWebsite(updatedWebsite);
        if (selectedSectionId === sectionId) {
            setSelectedSectionId(null);
        }
        onRefreshPreview();
    }, [website, currentPage, selectedSectionId, onUpdateWebsite, onRefreshPreview]);

    // Move a section up or down
    const moveSection = useCallback((sectionId: string, direction: 'up' | 'down') => {
        const sorted = [...currentPage.content].sort((a, b) => a.order - b.order);
        const index = sorted.findIndex(s => s.id === sectionId);

        if (index === -1) return;
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === sorted.length - 1) return;

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        [sorted[index], sorted[newIndex]] = [sorted[newIndex], sorted[index]];

        // Update order values
        sorted.forEach((s, i) => {
            s.order = i;
        });

        const updatedPage = { ...currentPage, content: sorted };
        const updatedWebsite = {
            ...website,
            pages: website.pages.map(p =>
                p.id === currentPage.id ? updatedPage : p
            ),
            updatedAt: new Date().toISOString(),
        };

        onUpdateWebsite(updatedWebsite);
        onRefreshPreview();
    }, [website, currentPage, onUpdateWebsite, onRefreshPreview]);

    // Regenerate section with AI
    const handleRegenerate = useCallback(async (section: PageSection) => {
        if (section.userEdited) {
            const confirm_regen = confirm(
                'This section has been manually edited. Regenerating will replace your changes. Continue?'
            );
            if (!confirm_regen) return;
        }

        setIsRegenerating(section.id);

        try {
            const newContent = await generateSectionJSON(section.type, businessContext);

            if (newContent) {
                const updatedPage = {
                    ...currentPage,
                    content: currentPage.content.map(s =>
                        s.id === section.id
                            ? {
                                ...s,
                                content: newContent,
                                userEdited: false,
                                lastEditedAt: new Date().toISOString(),
                                lastEditedBy: 'ai' as const
                            }
                            : s
                    ),
                };

                const updatedWebsite = {
                    ...website,
                    pages: website.pages.map(p =>
                        p.id === currentPage.id ? updatedPage : p
                    ),
                    updatedAt: new Date().toISOString(),
                };

                onUpdateWebsite(updatedWebsite);
                onRefreshPreview();
            }
        } catch (error) {
            console.error('Failed to regenerate section:', error);
            alert('Failed to regenerate section. Please try again.');
        } finally {
            setIsRegenerating(null);
        }
    }, [website, currentPage, businessContext, onUpdateWebsite, onRefreshPreview]);

    // Unlock section for AI
    const handleUnlock = useCallback((sectionId: string) => {
        const updatedPage = {
            ...currentPage,
            content: currentPage.content.map(s =>
                s.id === sectionId
                    ? { ...s, userEdited: false, lastEditedAt: new Date().toISOString(), lastEditedBy: 'system' as const }
                    : s
            ),
        };

        const updatedWebsite = {
            ...website,
            pages: website.pages.map(p =>
                p.id === currentPage.id ? updatedPage : p
            ),
        };

        onUpdateWebsite(updatedWebsite);
    }, [website, currentPage, onUpdateWebsite]);

    // Section type labels
    const sectionTypeLabels: Record<SectionType, string> = {
        'hero': '🎯 Hero',
        'services-grid': '🛠️ Services',
        'about-intro': '👋 About',
        'contact-form': '📧 Contact',
        'cta': '📣 Call to Action',
        'testimonials': '⭐ Testimonials',
        'locations-list': '📍 Locations',
        'gallery': '🖼️ Gallery',
        'faq': '❓ FAQ',
        'features': '✨ Features',
        'trust-badges': '🏆 Trust Badges',
        'blog-list': '📰 Blog',
        'text-block': '📝 Text Block',
        'image': '🖼️ Image',
        'video': '🎬 Video',
        'custom-content': '💻 Custom HTML',
    };

    // Available section types to add
    const addableSectionTypes: SectionType[] = [
        'hero', 'services-grid', 'about-intro', 'cta', 'features',
        'testimonials', 'faq', 'gallery', 'text-block', 'contact-form'
    ];

    return (
        <aside className={styles.panel}>
            {/* Tab Navigation */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'sections' ? styles.active : ''}`}
                    onClick={() => setActiveTab('sections')}
                >
                    📑 Sections
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'page-settings' ? styles.active : ''}`}
                    onClick={() => setActiveTab('page-settings')}
                >
                    📄 Page
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'site-settings' ? styles.active : ''}`}
                    onClick={() => setActiveTab('site-settings')}
                >
                    ⚙️ Site
                </button>
            </div>

            <div className={styles.content}>
                {/* Sections Tab */}
                {activeTab === 'sections' && (
                    <div className={styles.sectionsTab}>
                        {/* Section List */}
                        {!selectedSection && (
                            <>
                                <div className={styles.sectionList}>
                                    {sections.map((section, index) => (
                                        <div key={section.id} className={styles.sectionItem}>
                                            <button
                                                className={styles.sectionBtn}
                                                onClick={() => setSelectedSectionId(section.id)}
                                            >
                                                <span className={styles.sectionLabel}>
                                                    {sectionTypeLabels[section.type] || section.type}
                                                </span>
                                                {section.userEdited && (
                                                    <span className={styles.editedBadge} title="User-edited">🔒</span>
                                                )}
                                            </button>

                                            <div className={styles.sectionActions}>
                                                <button
                                                    className={styles.iconBtn}
                                                    onClick={() => moveSection(section.id, 'up')}
                                                    disabled={index === 0}
                                                    title="Move up"
                                                >
                                                    ↑
                                                </button>
                                                <button
                                                    className={styles.iconBtn}
                                                    onClick={() => moveSection(section.id, 'down')}
                                                    disabled={index === sections.length - 1}
                                                    title="Move down"
                                                >
                                                    ↓
                                                </button>
                                                <button
                                                    className={styles.iconBtn}
                                                    onClick={() => handleRegenerate(section)}
                                                    disabled={isRegenerating === section.id}
                                                    title="Regenerate with AI"
                                                >
                                                    {isRegenerating === section.id ? '⏳' : '🤖'}
                                                </button>
                                                <button
                                                    className={`${styles.iconBtn} ${styles.deleteBtn}`}
                                                    onClick={() => deleteSection(section.id)}
                                                    title="Delete"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Add Section */}
                                <div className={styles.addSection}>
                                    <h4>Add Section</h4>
                                    <div className={styles.addGrid}>
                                        {addableSectionTypes.map(type => (
                                            <button
                                                key={type}
                                                className={styles.addBtn}
                                                onClick={() => addSection(type)}
                                            >
                                                {sectionTypeLabels[type] || type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Section Editor */}
                        {selectedSection && (
                            <div className={styles.sectionEditorWrapper}>
                                <div className={styles.sectionEditorHeader}>
                                    <button
                                        className={styles.backBtn}
                                        onClick={() => setSelectedSectionId(null)}
                                    >
                                        ← Back to Sections
                                    </button>
                                    <button
                                        className={styles.regenerateBtn}
                                        onClick={() => handleRegenerate(selectedSection)}
                                        disabled={isRegenerating === selectedSection.id}
                                    >
                                        {isRegenerating === selectedSection.id ? '⏳ Regenerating...' : '🤖 Regenerate with AI'}
                                    </button>
                                </div>

                                <SectionEditor
                                    section={selectedSection}
                                    onChange={(content) => updateSectionContent(selectedSection.id, content)}
                                    onResetLock={() => handleUnlock(selectedSection.id)}
                                    businessContext={businessContext}
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* Page Settings Tab */}
                {activeTab === 'page-settings' && (
                    <div className={styles.settingsTab}>
                        <h3>Page Settings</h3>

                        <div className={styles.field}>
                            <label>Page Title</label>
                            <input
                                type="text"
                                value={currentPage.title}
                                onChange={(e) => {
                                    const updatedPage = { ...currentPage, title: e.target.value };
                                    const updatedWebsite = {
                                        ...website,
                                        pages: website.pages.map(p => p.id === currentPage.id ? updatedPage : p),
                                    };
                                    onUpdateWebsite(updatedWebsite);
                                }}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.field}>
                            <label>URL Slug</label>
                            <input
                                type="text"
                                value={currentPage.slug}
                                onChange={(e) => {
                                    const updatedPage = { ...currentPage, slug: e.target.value };
                                    const updatedWebsite = {
                                        ...website,
                                        pages: website.pages.map(p => p.id === currentPage.id ? updatedPage : p),
                                    };
                                    onUpdateWebsite(updatedWebsite);
                                }}
                                className={styles.input}
                                placeholder="about-us"
                            />
                        </div>

                        <h4 style={{ marginTop: 'var(--space-lg)' }}>SEO Settings</h4>

                        <div className={styles.field}>
                            <label>Meta Title</label>
                            <input
                                type="text"
                                value={currentPage.seo?.title || ''}
                                onChange={(e) => {
                                    const updatedPage = {
                                        ...currentPage,
                                        seo: { ...currentPage.seo, title: e.target.value }
                                    };
                                    const updatedWebsite = {
                                        ...website,
                                        pages: website.pages.map(p => p.id === currentPage.id ? updatedPage : p),
                                    };
                                    onUpdateWebsite(updatedWebsite);
                                }}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Meta Description</label>
                            <textarea
                                value={currentPage.seo?.description || ''}
                                onChange={(e) => {
                                    const updatedPage = {
                                        ...currentPage,
                                        seo: { ...currentPage.seo, description: e.target.value }
                                    };
                                    const updatedWebsite = {
                                        ...website,
                                        pages: website.pages.map(p => p.id === currentPage.id ? updatedPage : p),
                                    };
                                    onUpdateWebsite(updatedWebsite);
                                }}
                                className={styles.textarea}
                                rows={3}
                            />
                        </div>
                    </div>
                )}

                {/* Site Settings Tab */}
                {activeTab === 'site-settings' && (
                    <div className={styles.settingsTab}>
                        <h3>Site Settings</h3>

                        <div className={styles.field}>
                            <label>Business Name</label>
                            <input
                                type="text"
                                value={website.businessName}
                                onChange={(e) => {
                                    onUpdateWebsite({ ...website, businessName: e.target.value });
                                }}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                value={website.contactPhone || ''}
                                onChange={(e) => {
                                    onUpdateWebsite({ ...website, contactPhone: e.target.value });
                                }}
                                className={styles.input}
                                placeholder="(555) 123-4567"
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Email</label>
                            <input
                                type="email"
                                value={website.contactEmail || ''}
                                onChange={(e) => {
                                    onUpdateWebsite({ ...website, contactEmail: e.target.value });
                                }}
                                className={styles.input}
                                placeholder="info@business.com"
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Industry</label>
                            <input
                                type="text"
                                value={website.industry}
                                onChange={(e) => {
                                    onUpdateWebsite({ ...website, industry: e.target.value });
                                }}
                                className={styles.input}
                            />
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}

export default EditorPanel;
