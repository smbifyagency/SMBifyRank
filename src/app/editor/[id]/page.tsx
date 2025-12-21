'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { saveAs } from 'file-saver';
import { Website, Page, PageSection, Service, Location, BrandColors } from '@/lib/types';
import { getWebsite, saveWebsite, generateId } from '@/lib/storage';
import { getEditablePagePreviewHtml } from '@/lib/export';
import { INDUSTRY_TEMPLATES, templateToBrandColors } from '@/lib/templates';
import ImageUploader from '@/components/ImageUploader';
import RichTextEditor from '@/components/RichTextEditor';
import { DeployModal } from '@/components/DeployModal';
import styles from './editor.module.css';

type EditTab = 'edit' | 'settings';

export default function EditorPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const websiteId = params.id as string;
    const initialPageId = searchParams.get('page');

    const [website, setWebsite] = useState<Website | null>(null);
    const [currentPage, setCurrentPage] = useState<Page | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [previewHtml, setPreviewHtml] = useState('');
    const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [showEditor, setShowEditor] = useState(true);
    const [editingSection, setEditingSection] = useState<PageSection | null>(null);
    const [sectionContent, setSectionContent] = useState<Record<string, unknown>>({});
    const [editTab, setEditTab] = useState<EditTab>('edit');
    const [showImageUploader, setShowImageUploader] = useState(false);
    const [showLogoUploader, setShowLogoUploader] = useState(false);
    const [showVideoEditor, setShowVideoEditor] = useState(false);
    const [editingVideoUrl, setEditingVideoUrl] = useState('');
    const [editingVideoElementId, setEditingVideoElementId] = useState('');
    const [showDeployModal, setShowDeployModal] = useState(false);
    const [selectedElement, setSelectedElement] = useState<{
        elementType: string;
        elementId: string;
        tagName: string;
        content: string;
        src?: string;
        rect: { top: number; left: number; width: number; height: number };
    } | null>(null);

    // Blog post state
    const [blogPostTitle, setBlogPostTitle] = useState('');
    const [blogPostContent, setBlogPostContent] = useState('');

    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const ws = getWebsite(websiteId);
        if (ws) {
            setWebsite(ws);
            const page = initialPageId
                ? ws.pages.find(p => p.id === initialPageId || p.slug === initialPageId)
                : ws.pages[0];
            if (page) {
                setCurrentPage(page);
            }
        } else {
            router.push('/');
        }
        setIsLoading(false);
    }, [websiteId, initialPageId, router]);

    useEffect(() => {
        if (website && currentPage) {
            const html = getEditablePagePreviewHtml(website, currentPage);
            setPreviewHtml(html);
        }
    }, [website, currentPage]);

    // Listen for messages from iframe (inline editing)
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'element-selected') {
                setSelectedElement(event.data.data);
            } else if (event.data.type === 'edit-video') {
                // Handle double-click on video to edit URL
                setEditingVideoUrl(event.data.data.videoUrl);
                setEditingVideoElementId(event.data.data.elementId);
                setShowVideoEditor(true);
            } else if (event.data.type === 'content-updated') {
                // Handle content update from inline editing - persist changes
                const { elementId, elementType, sectionId, property, newContent } = event.data.data;
                console.log('Content updated:', { elementId, elementType, sectionId, property, newContent });

                if (website && currentPage) {
                    let sectionUpdated = false;

                    // Use sectionId + property for precise updates (new method)
                    const updatedSections = currentPage.content.map((section) => {
                        // Direct match using sectionId and property
                        if (sectionId && property && section.id === sectionId) {
                            const content = section.content as Record<string, unknown>;
                            if (property in content) {
                                sectionUpdated = true;
                                console.log(`Updating ${property} in section ${section.id} (${section.type})`);
                                return { ...section, content: { ...content, [property]: newContent } };
                            }
                        }

                        // Fallback: For older elements without data-section-id, use index-based matching
                        if (!sectionId && !sectionUpdated) {
                            const content = section.content as Record<string, unknown>;
                            const [, indexStr] = (elementId || '').split('-');
                            const elementIndex = parseInt(indexStr, 10);

                            if (elementType === 'heading') {
                                const headingProps = ['headline', 'title'];
                                for (const prop of headingProps) {
                                    if (typeof content[prop] === 'string') {
                                        sectionUpdated = true;
                                        console.log(`Fallback: Updating ${prop} in section ${section.type}`);
                                        return { ...section, content: { ...content, [prop]: newContent } };
                                    }
                                }
                            }
                            if (elementType === 'text') {
                                const textProps = ['subheadline', 'subtitle', 'content', 'description'];
                                for (const prop of textProps) {
                                    if (typeof content[prop] === 'string') {
                                        sectionUpdated = true;
                                        console.log(`Fallback: Updating ${prop} in section ${section.type}`);
                                        return { ...section, content: { ...content, [prop]: newContent } };
                                    }
                                }
                            }
                        }
                        return section;
                    });

                    if (sectionUpdated) {
                        // Save the updated website
                        const updatedPage = { ...currentPage, content: updatedSections };
                        const updatedWebsite = {
                            ...website,
                            pages: website.pages.map(p =>
                                p.id === currentPage.id ? updatedPage : p
                            ),
                        };

                        handleSave(updatedWebsite);
                        console.log('Website saved successfully');
                    } else {
                        console.log('No matching section found for:', { sectionId, property, elementId });
                    }
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [website, currentPage]);

    // Handle image upload for selected element
    const handleImageUpload = useCallback((imageUrl: string, altText: string) => {
        if (selectedElement && iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
                type: 'update-element',
                data: {
                    elementId: selectedElement.elementId,
                    property: 'src',
                    value: imageUrl
                }
            }, '*');

            // Also update alt text
            iframeRef.current.contentWindow.postMessage({
                type: 'update-element',
                data: {
                    elementId: selectedElement.elementId,
                    property: 'alt',
                    value: altText
                }
            }, '*');
        }
        setShowImageUploader(false);
        setSelectedElement(null);
    }, [selectedElement]);

    // Handle video URL update
    const handleVideoSave = useCallback(() => {
        if (editingVideoElementId && iframeRef.current?.contentWindow && editingVideoUrl) {
            // Convert YouTube URL to embed URL
            let embedUrl = editingVideoUrl;
            const youtubeMatch = editingVideoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
            if (youtubeMatch) {
                embedUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}`;
            }

            iframeRef.current.contentWindow.postMessage({
                type: 'update-video',
                data: {
                    elementId: editingVideoElementId,
                    videoUrl: embedUrl
                }
            }, '*');
        }
        setShowVideoEditor(false);
        setEditingVideoUrl('');
        setEditingVideoElementId('');
    }, [editingVideoUrl, editingVideoElementId]);

    // Deselect element when clicking outside
    const handleDeselectElement = useCallback(() => {
        if (selectedElement && iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({ type: 'deselect' }, '*');
        }
        setSelectedElement(null);
    }, [selectedElement]);

    const handlePageChange = (pageId: string) => {
        if (!website) return;
        const page = website.pages.find(p => p.id === pageId);
        if (page) {
            setCurrentPage(page);
            setEditingSection(null);
        }
    };

    const handleSave = (updatedWebsite: Website) => {
        saveWebsite(updatedWebsite);
        setWebsite(updatedWebsite);
        // Update current page reference
        if (currentPage) {
            const updatedPage = updatedWebsite.pages.find(p => p.id === currentPage.id);
            if (updatedPage) {
                setCurrentPage(updatedPage);
            }
        }
    };

    const handleEditSection = (section: PageSection) => {
        setEditingSection(section);
        setSectionContent(section.content as Record<string, unknown>);
    };

    const handleSaveSection = () => {
        if (!website || !currentPage || !editingSection) return;

        const updatedPage = {
            ...currentPage,
            content: currentPage.content.map(s =>
                s.id === editingSection.id
                    ? { ...s, content: sectionContent }
                    : s
            ),
        };

        const updatedWebsite = {
            ...website,
            pages: website.pages.map(p =>
                p.id === currentPage.id ? updatedPage : p
            ),
        };

        handleSave(updatedWebsite);
        setEditingSection(null);
    };

    const handleDeleteSection = (sectionId: string) => {
        if (!website || !currentPage) return;
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
        };

        handleSave(updatedWebsite);
    };

    const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
        if (!website || !currentPage) return;

        const sections = [...currentPage.content].sort((a, b) => a.order - b.order);
        const index = sections.findIndex(s => s.id === sectionId);
        if (index === -1) return;
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === sections.length - 1) return;

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        [sections[index], sections[newIndex]] = [sections[newIndex], sections[index]];

        // Update order values
        sections.forEach((s, i) => {
            s.order = i;
        });

        const updatedPage = {
            ...currentPage,
            content: sections,
        };

        const updatedWebsite = {
            ...website,
            pages: website.pages.map(p =>
                p.id === currentPage.id ? updatedPage : p
            ),
        };

        handleSave(updatedWebsite);
    };

    const handleAddSection = (type: PageSection['type']) => {
        if (!website || !currentPage) return;

        const newSection: PageSection = {
            id: generateId(),
            type,
            content: getDefaultSectionContent(type),
            order: currentPage.content.length,
        };

        const updatedPage = {
            ...currentPage,
            content: [...currentPage.content, newSection],
        };

        const updatedWebsite = {
            ...website,
            pages: website.pages.map(p =>
                p.id === currentPage.id ? updatedPage : p
            ),
        };

        handleSave(updatedWebsite);
        handleEditSection(newSection);
    };

    const getDefaultSectionContent = (type: PageSection['type']): Record<string, unknown> => {
        switch (type) {
            case 'hero':
                return {
                    headline: 'Your Headline Here',
                    subheadline: 'Your subheadline text goes here',
                    showCta: true,
                    ctaText: 'Get Started',
                    ctaLink: '/contact',
                    backgroundImage: '',
                };
            case 'custom-content':
                return {
                    html: '<h2>Section Title</h2><p>Your content here...</p>',
                };
            case 'cta':
                return {
                    title: 'Call to Action',
                    subtitle: 'Take action now',
                    ctaText: 'Contact Us',
                    ctaLink: '/contact',
                    phone: '',
                };
            case 'image':
                return {
                    imageUrl: 'https://picsum.photos/800/400',
                    altText: 'Image description',
                    caption: '',
                    linkUrl: '',
                };
            case 'video':
                return {
                    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    title: 'Video Section',
                    description: '',
                };
            case 'text-block':
                return {
                    title: 'Section Title',
                    content: 'Add your content here. You can write multiple paragraphs describing your services, company, or any other information.',
                    alignment: 'left',
                };
            case 'features':
                return {
                    title: 'Our Features',
                    subtitle: 'What makes us different',
                    features: [
                        { icon: '⭐', title: 'Feature 1', description: 'Description of feature 1' },
                        { icon: '🚀', title: 'Feature 2', description: 'Description of feature 2' },
                        { icon: '💎', title: 'Feature 3', description: 'Description of feature 3' },
                    ],
                };
            case 'testimonials':
                return {
                    title: 'What Our Clients Say',
                    testimonials: [
                        { name: 'John Doe', text: 'Great service!', rating: 5 },
                        { name: 'Jane Smith', text: 'Highly recommend!', rating: 5 },
                    ],
                };
            case 'faq':
                return {
                    title: 'Frequently Asked Questions',
                    questions: [
                        { question: 'What services do you offer?', answer: 'We offer a wide range of professional services.' },
                        { question: 'How can I contact you?', answer: 'Call us or use our contact form.' },
                    ],
                };
            case 'gallery':
                return {
                    title: 'Photo Gallery',
                    images: [
                        { url: 'https://picsum.photos/seed/1/400/300', alt: 'Gallery image 1' },
                        { url: 'https://picsum.photos/seed/2/400/300', alt: 'Gallery image 2' },
                        { url: 'https://picsum.photos/seed/3/400/300', alt: 'Gallery image 3' },
                    ],
                };
            default:
                return {};
        }
    };

    const updateSEO = (updates: Partial<Page['seo']>) => {
        if (!website || !currentPage) return;

        const updatedPage = {
            ...currentPage,
            seo: { ...currentPage.seo, ...updates },
        };

        const updatedWebsite = {
            ...website,
            pages: website.pages.map(p =>
                p.id === currentPage.id ? updatedPage : p
            ),
        };

        handleSave(updatedWebsite);
    };

    // Handle export/download - using hidden form submission for reliable Chrome downloads
    const handleExport = async () => {
        if (!website) return;

        // Generate filename for the download
        const safeName = (website.name || website.businessName || 'website')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '') || 'website';

        // Create a hidden form and submit it
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/api/export';
        form.style.display = 'none';

        // Add website data as hidden input
        const dataInput = document.createElement('input');
        dataInput.type = 'hidden';
        dataInput.name = 'websiteData';
        dataInput.value = JSON.stringify(website);
        form.appendChild(dataInput);

        // Add filename as hidden input
        const filenameInput = document.createElement('input');
        filenameInput.type = 'hidden';
        filenameInput.name = 'filename';
        filenameInput.value = `${safeName}-website.zip`;
        form.appendChild(filenameInput);

        // Submit form to trigger download
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    };

    // Update any website field
    const updateWebsiteField = (field: keyof Website, value: unknown) => {
        if (!website) return;
        const updatedWebsite = { ...website, [field]: value };
        handleSave(updatedWebsite);
    };

    // Update a service
    const updateService = (serviceId: string, updates: Partial<Service>) => {
        if (!website) return;
        const updatedServices = website.services.map(s =>
            s.id === serviceId ? { ...s, ...updates } : s
        );
        handleSave({ ...website, services: updatedServices });
    };

    // Add a new service
    const addService = () => {
        if (!website) return;
        const newService: Service = {
            id: generateId(),
            name: 'New Service',
            description: 'Service description',
            slug: 'new-service-' + Date.now(),
            icon: '✨',
        };
        handleSave({ ...website, services: [...website.services, newService] });
    };

    // Delete a service
    const deleteService = (serviceId: string) => {
        if (!website) return;
        handleSave({ ...website, services: website.services.filter(s => s.id !== serviceId) });
    };

    // Update a location
    const updateLocation = (locationId: string, updates: Partial<Location>) => {
        if (!website) return;
        const updatedLocations = website.locations.map(l =>
            l.id === locationId ? { ...l, ...updates } : l
        );
        handleSave({ ...website, locations: updatedLocations });
    };

    // Add a new location
    const addLocation = () => {
        if (!website) return;
        const newLocation: Location = {
            id: generateId(),
            city: 'New City',
            state: '',
            slug: 'new-city-' + Date.now(),
        };
        handleSave({ ...website, locations: [...website.locations, newLocation] });
    };

    // Delete a location
    const deleteLocation = (locationId: string) => {
        if (!website) return;
        handleSave({ ...website, locations: website.locations.filter(l => l.id !== locationId) });
    };

    const getViewportWidth = () => {
        switch (viewMode) {
            case 'mobile': return '375px';
            case 'tablet': return '768px';
            default: return '100%';
        }
    };

    if (isLoading || !website) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading editor...</p>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            {/* Toolbar */}
            <header className={styles.toolbar}>
                <div className={styles.toolbarLeft}>
                    <Link href={`/dashboard/${website.id}`} className={styles.backBtn}>
                        ← Dashboard
                    </Link>
                    <div className={styles.pagePicker}>
                        <select
                            value={currentPage?.id || ''}
                            onChange={(e) => handlePageChange(e.target.value)}
                            className={styles.pageSelect}
                        >
                            {website.pages.map(page => (
                                <option key={page.id} value={page.id}>
                                    {page.title} ({page.slug || 'home'})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={styles.toolbarCenter}>
                    <div className={styles.viewModes}>
                        <button
                            className={`${styles.viewBtn} ${viewMode === 'desktop' ? styles.active : ''}`}
                            onClick={() => setViewMode('desktop')}
                            title="Desktop View"
                        >
                            🖥️
                        </button>
                        <button
                            className={`${styles.viewBtn} ${viewMode === 'tablet' ? styles.active : ''}`}
                            onClick={() => setViewMode('tablet')}
                            title="Tablet View"
                        >
                            📱
                        </button>
                        <button
                            className={`${styles.viewBtn} ${viewMode === 'mobile' ? styles.active : ''}`}
                            onClick={() => setViewMode('mobile')}
                            title="Mobile View"
                        >
                            📲
                        </button>
                    </div>
                </div>

                <div className={styles.toolbarRight}>
                    <button
                        className={styles.saveAllBtn}
                        onClick={() => {
                            if (website) {
                                saveWebsite(website);
                                alert('✅ All changes saved!');
                            }
                        }}
                        title="Save all changes"
                    >
                        💾 Save
                    </button>
                    <button
                        className={styles.deployBtn}
                        title="Deploy changes to Netlify"
                        onClick={() => setShowDeployModal(true)}
                    >
                        🚀 Deploy
                    </button>
                    <button
                        className={styles.exportBtn}
                        onClick={handleExport}
                        title="Download website as ZIP"
                    >
                        📦 Download ZIP
                    </button>
                    <button
                        className={`${styles.toggleBtn} ${showEditor ? styles.active : ''}`}
                        onClick={() => setShowEditor(!showEditor)}
                    >
                        {showEditor ? '👁️ Preview Only' : '✏️ Show Editor'}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className={styles.main}>
                {/* Preview */}
                <div className={styles.previewContainer}>
                    <div
                        className={styles.previewFrame}
                        style={{ width: getViewportWidth() }}
                    >
                        <iframe
                            ref={iframeRef}
                            srcDoc={previewHtml}
                            className={styles.iframe}
                            title="Website Preview"
                        />
                    </div>
                </div>

                {/* Editor Panel */}
                {showEditor && currentPage && (
                    <aside className={styles.editorPanel}>
                        {/* Section Editing */}
                        {editingSection ? (
                            <div className={styles.sectionEditor}>
                                <div className={styles.editorHeader}>
                                    <h3>Edit {editingSection.type}</h3>
                                    <button onClick={() => setEditingSection(null)} className={styles.closeBtn}>×</button>
                                </div>

                                <div className={styles.editorBody}>
                                    {editingSection.type === 'hero' && (
                                        <>
                                            <div className={styles.field}>
                                                <label>Headline</label>
                                                <input
                                                    type="text"
                                                    value={(sectionContent.headline as string) || ''}
                                                    onChange={(e) => setSectionContent({ ...sectionContent, headline: e.target.value })}
                                                    className={styles.input}
                                                />
                                            </div>
                                            <div className={styles.field}>
                                                <label>Subheadline</label>
                                                <RichTextEditor
                                                    value={(sectionContent.subheadline as string) || ''}
                                                    onChange={(val) => setSectionContent({ ...sectionContent, subheadline: val })}
                                                    placeholder="Enter subheadline..."
                                                />
                                            </div>
                                            <div className={styles.field}>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={sectionContent.showCta !== false}
                                                        onChange={(e) => setSectionContent({ ...sectionContent, showCta: e.target.checked })}
                                                    />
                                                    Show CTA Button
                                                </label>
                                            </div>
                                            {sectionContent.showCta !== false && (
                                                <>
                                                    <div className={styles.field}>
                                                        <label>CTA Text</label>
                                                        <input
                                                            type="text"
                                                            value={(sectionContent.ctaText as string) || ''}
                                                            onChange={(e) => setSectionContent({ ...sectionContent, ctaText: e.target.value })}
                                                            className={styles.input}
                                                        />
                                                    </div>
                                                    <div className={styles.field}>
                                                        <label>CTA Link</label>
                                                        <input
                                                            type="text"
                                                            value={(sectionContent.ctaLink as string) || ''}
                                                            onChange={(e) => setSectionContent({ ...sectionContent, ctaLink: e.target.value })}
                                                            className={styles.input}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                            <div className={styles.field}>
                                                <label>Phone Number</label>
                                                <input
                                                    type="text"
                                                    value={(sectionContent.phone as string) || ''}
                                                    onChange={(e) => setSectionContent({ ...sectionContent, phone: e.target.value })}
                                                    className={styles.input}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {editingSection.type === 'cta' && (
                                        <>
                                            <div className={styles.field}>
                                                <label>Title</label>
                                                <input
                                                    type="text"
                                                    value={(sectionContent.title as string) || ''}
                                                    onChange={(e) => setSectionContent({ ...sectionContent, title: e.target.value })}
                                                    className={styles.input}
                                                />
                                            </div>
                                            <div className={styles.field}>
                                                <label>Subtitle</label>
                                                <input
                                                    type="text"
                                                    value={(sectionContent.subtitle as string) || ''}
                                                    onChange={(e) => setSectionContent({ ...sectionContent, subtitle: e.target.value })}
                                                    className={styles.input}
                                                />
                                            </div>
                                            <div className={styles.field}>
                                                <label>Button Text</label>
                                                <input
                                                    type="text"
                                                    value={(sectionContent.ctaText as string) || ''}
                                                    onChange={(e) => setSectionContent({ ...sectionContent, ctaText: e.target.value })}
                                                    className={styles.input}
                                                />
                                            </div>
                                            <div className={styles.field}>
                                                <label>Button Link</label>
                                                <input
                                                    type="text"
                                                    value={(sectionContent.ctaLink as string) || ''}
                                                    onChange={(e) => setSectionContent({ ...sectionContent, ctaLink: e.target.value })}
                                                    className={styles.input}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {editingSection.type === 'custom-content' && (
                                        <div className={styles.field}>
                                            <label>HTML Content</label>
                                            <textarea
                                                value={(sectionContent.html as string) || ''}
                                                onChange={(e) => setSectionContent({ ...sectionContent, html: e.target.value })}
                                                className={styles.textarea}
                                                rows={10}
                                            />
                                        </div>
                                    )}

                                    {editingSection.type === 'about-intro' && (
                                        <>
                                            <div className={styles.field}>
                                                <label>Title</label>
                                                <input
                                                    type="text"
                                                    value={(sectionContent.title as string) || ''}
                                                    onChange={(e) => setSectionContent({ ...sectionContent, title: e.target.value })}
                                                    className={styles.input}
                                                />
                                            </div>
                                            <div className={styles.field}>
                                                <label>Description</label>
                                                <RichTextEditor
                                                    value={(sectionContent.description as string) || ''}
                                                    onChange={(val) => setSectionContent({ ...sectionContent, description: val })}
                                                    placeholder="Enter description..."
                                                />
                                            </div>
                                        </>
                                    )}

                                    {editingSection.type === 'services-grid' && (
                                        <>
                                            <div className={styles.field}>
                                                <label>Section Title</label>
                                                <input
                                                    type="text"
                                                    value={(sectionContent.title as string) || ''}
                                                    onChange={(e) => setSectionContent({ ...sectionContent, title: e.target.value })}
                                                    className={styles.input}
                                                />
                                            </div>
                                            <div className={styles.field}>
                                                <label>Subtitle</label>
                                                <input
                                                    type="text"
                                                    value={(sectionContent.subtitle as string) || ''}
                                                    onChange={(e) => setSectionContent({ ...sectionContent, subtitle: e.target.value })}
                                                    className={styles.input}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {editingSection.type === 'image' && (
                                        <>
                                            <div className={styles.field}>
                                                <label>Image URL</label>
                                                <input
                                                    type="text"
                                                    value={(sectionContent.imageUrl as string) || ''}
                                                    onChange={(e) => setSectionContent({ ...sectionContent, imageUrl: e.target.value })}
                                                    className={styles.input}
                                                    placeholder="https://example.com/image.jpg"
                                                />
                                                <small className={styles.hint}>Enter an image URL or upload to a hosting service</small>
                                            </div>
                                            <div className={styles.field}>
                                                <label>Alt Text (SEO)</label>
                                                <input
                                                    type="text"
                                                    value={(sectionContent.altText as string) || ''}
                                                    onChange={(e) => setSectionContent({ ...sectionContent, altText: e.target.value })}
                                                    className={styles.input}
                                                    placeholder="Description of the image for SEO"
                                                />
                                            </div>
                                            <div className={styles.field}>
                                                <label>Caption (optional)</label>
                                                <input
                                                    type="text"
                                                    value={(sectionContent.caption as string) || ''}
                                                    onChange={(e) => setSectionContent({ ...sectionContent, caption: e.target.value })}
                                                    className={styles.input}
                                                />
                                            </div>
                                            <div className={styles.field}>
                                                <label>Link URL (optional)</label>
                                                <input
                                                    type="text"
                                                    value={(sectionContent.linkUrl as string) || ''}
                                                    onChange={(e) => setSectionContent({ ...sectionContent, linkUrl: e.target.value })}
                                                    className={styles.input}
                                                    placeholder="Click destination URL"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {editingSection.type === 'video' && (
                                        <>
                                            <div className={styles.field}>
                                                <label>YouTube URL</label>
                                                <input
                                                    type="text"
                                                    value={(sectionContent.youtubeUrl as string) || ''}
                                                    onChange={(e) => setSectionContent({ ...sectionContent, youtubeUrl: e.target.value })}
                                                    className={styles.input}
                                                    placeholder="https://www.youtube.com/watch?v=..."
                                                />
                                                <small className={styles.hint}>Paste any YouTube video URL</small>
                                            </div>
                                            <div className={styles.field}>
                                                <label>Section Title</label>
                                                <input
                                                    type="text"
                                                    value={(sectionContent.title as string) || ''}
                                                    onChange={(e) => setSectionContent({ ...sectionContent, title: e.target.value })}
                                                    className={styles.input}
                                                />
                                            </div>
                                            <div className={styles.field}>
                                                <label>Description</label>
                                                <RichTextEditor
                                                    value={(sectionContent.description as string) || ''}
                                                    onChange={(val) => setSectionContent({ ...sectionContent, description: val })}
                                                    placeholder="Enter description..."
                                                />
                                            </div>
                                        </>
                                    )}

                                    {editingSection.type === 'text-block' && (
                                        <>
                                            <div className={styles.field}>
                                                <label>Title</label>
                                                <input
                                                    type="text"
                                                    value={(sectionContent.title as string) || ''}
                                                    onChange={(e) => setSectionContent({ ...sectionContent, title: e.target.value })}
                                                    className={styles.input}
                                                />
                                            </div>
                                            <div className={styles.field}>
                                                <label>Content</label>
                                                <RichTextEditor
                                                    value={(sectionContent.content as string) || ''}
                                                    onChange={(val) => setSectionContent({ ...sectionContent, content: val })}
                                                    placeholder="Enter your text content here..."
                                                />
                                            </div>
                                            <div className={styles.field}>
                                                <label>Alignment</label>
                                                <select
                                                    value={(sectionContent.alignment as string) || 'left'}
                                                    onChange={(e) => setSectionContent({ ...sectionContent, alignment: e.target.value })}
                                                    className={styles.select}
                                                >
                                                    <option value="left">Left</option>
                                                    <option value="center">Center</option>
                                                    <option value="right">Right</option>
                                                </select>
                                            </div>
                                        </>
                                    )}

                                    {editingSection.type === 'features' && (
                                        <>
                                            <div className={styles.field}>
                                                <label>Section Title</label>
                                                <input
                                                    type="text"
                                                    value={(sectionContent.title as string) || ''}
                                                    onChange={(e) => setSectionContent({ ...sectionContent, title: e.target.value })}
                                                    className={styles.input}
                                                />
                                            </div>
                                            <div className={styles.field}>
                                                <label>Subtitle</label>
                                                <input
                                                    type="text"
                                                    value={(sectionContent.subtitle as string) || ''}
                                                    onChange={(e) => setSectionContent({ ...sectionContent, subtitle: e.target.value })}
                                                    className={styles.input}
                                                />
                                            </div>
                                            <p className={styles.hint}>Features are defined in JSON format. Each feature has icon, title, and description.</p>
                                            <div className={styles.field}>
                                                <label>Features JSON</label>
                                                <textarea
                                                    value={JSON.stringify(sectionContent.features || [], null, 2)}
                                                    onChange={(e) => {
                                                        try {
                                                            const parsed = JSON.parse(e.target.value);
                                                            setSectionContent({ ...sectionContent, features: parsed });
                                                        } catch {
                                                            // Invalid JSON, don't update
                                                        }
                                                    }}
                                                    className={styles.textarea}
                                                    rows={8}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className={styles.editorFooter}>
                                    <button onClick={handleSaveSection} className={styles.saveBtn}>
                                        💾 Save Changes
                                    </button>
                                    <button onClick={() => setEditingSection(null)} className={styles.cancelBtn}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Simplified Tab Navigation - Just 2 tabs */}
                                <div className={styles.tabNav}>
                                    <button
                                        className={`${styles.tabBtn} ${editTab === 'edit' ? styles.activeTab : ''}`}
                                        onClick={() => setEditTab('edit')}
                                    >
                                        📝 Edit Content
                                    </button>
                                    <button
                                        className={`${styles.tabBtn} ${editTab === 'settings' ? styles.activeTab : ''}`}
                                        onClick={() => setEditTab('settings')}
                                    >
                                        ⚙️ Settings
                                    </button>
                                </div>

                                {/* Content Tab - Rich Text Editing for all page content */}
                                {editTab === 'edit' && website && (
                                    <>
                                        {/* Selected Element Editor - Shows when user clicks on text in preview */}
                                        {selectedElement && (
                                            <div className={styles.editorSection} style={{
                                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
                                                border: '2px solid rgba(99, 102, 241, 0.3)',
                                                borderRadius: 'var(--radius-md)',
                                                marginBottom: '1rem'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                                    <h3 style={{ margin: 0 }}>✏️ Editing: {selectedElement.tagName || selectedElement.elementType}</h3>
                                                    <button
                                                        onClick={() => setSelectedElement(null)}
                                                        style={{
                                                            background: 'rgba(239, 68, 68, 0.2)',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            padding: '4px 12px',
                                                            cursor: 'pointer',
                                                            color: '#ef4444',
                                                            fontSize: '12px'
                                                        }}
                                                    >
                                                        ✕ Close
                                                    </button>
                                                </div>
                                                <div className={styles.field}>
                                                    <label style={{ color: '#6366f1', fontWeight: 600 }}>
                                                        {selectedElement.elementType === 'heading' ? 'Heading Text' :
                                                            selectedElement.elementType === 'text' ? 'Paragraph Text' :
                                                                selectedElement.elementType === 'image' ? 'Image' : 'Content'}
                                                    </label>
                                                    {(selectedElement.elementType === 'heading' || selectedElement.elementType === 'text') && (
                                                        <RichTextEditor
                                                            value={selectedElement.content || ''}
                                                            onChange={(val) => {
                                                                // Send update to iframe
                                                                if (iframeRef.current?.contentWindow) {
                                                                    iframeRef.current.contentWindow.postMessage({
                                                                        type: 'update-element',
                                                                        data: {
                                                                            elementId: selectedElement.elementId,
                                                                            property: 'innerHTML',
                                                                            value: val
                                                                        }
                                                                    }, '*');
                                                                }
                                                                // Update selected element state
                                                                setSelectedElement({
                                                                    ...selectedElement,
                                                                    content: val
                                                                });
                                                            }}
                                                            placeholder="Edit this content..."
                                                        />
                                                    )}
                                                    {selectedElement.elementType === 'image' && (
                                                        <div>
                                                            <p className={styles.hint}>Click "🖼️ Change" button above the image in preview to upload a new image.</p>
                                                            {selectedElement.src && (
                                                                <img src={selectedElement.src} alt="Selected" style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '8px' }} />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <p className={styles.hint} style={{ marginTop: '0.5rem', fontSize: '11px' }}>
                                                    💡 Click on any text or heading in the preview to edit it here
                                                </p>
                                            </div>
                                        )}

                                        {/* Instructions when nothing selected */}
                                        {!selectedElement && (
                                            <div className={styles.editorSection}>
                                                <div className={styles.hint} style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                                                    👆 <strong>Click on any text in the preview</strong> to edit it here. Or use the sections below to edit specific content areas.
                                                </div>
                                            </div>
                                        )}

                                        {/* Hero Content */}
                                        <div className={styles.editorSection}>
                                            <h3>🎯 Hero Section</h3>
                                            <div className={styles.field}>
                                                <label>Main Headline</label>
                                                <RichTextEditor
                                                    value={website.heroHeadline || website.businessName || ''}
                                                    onChange={(val) => updateWebsiteField('heroHeadline', val)}
                                                    placeholder="Your main headline..."
                                                />
                                            </div>
                                            <div className={styles.field}>
                                                <label>Subheadline / Description</label>
                                                <RichTextEditor
                                                    value={website.heroSubheadline || ''}
                                                    onChange={(val) => updateWebsiteField('heroSubheadline', val)}
                                                    placeholder="Your subheadline or description..."
                                                />
                                            </div>
                                        </div>

                                        {/* About Content */}
                                        <div className={styles.editorSection}>
                                            <h3>ℹ️ About Section</h3>
                                            <div className={styles.field}>
                                                <label>About Us Content</label>
                                                <RichTextEditor
                                                    value={website.aboutContent || ''}
                                                    onChange={(val) => updateWebsiteField('aboutContent', val)}
                                                    placeholder="Tell visitors about your business..."
                                                />
                                            </div>
                                        </div>

                                        {/* Services Overview */}
                                        <div className={styles.editorSection}>
                                            <h3>🛠️ Services Description</h3>
                                            <div className={styles.field}>
                                                <label>Services Overview</label>
                                                <RichTextEditor
                                                    value={website.servicesDescription || ''}
                                                    onChange={(val) => updateWebsiteField('servicesDescription', val)}
                                                    placeholder="Describe your services..."
                                                />
                                            </div>
                                        </div>

                                        {/* Contact Info */}
                                        <div className={styles.editorSection}>
                                            <h3>📞 Contact Content</h3>
                                            <div className={styles.field}>
                                                <label>Contact Page Message</label>
                                                <RichTextEditor
                                                    value={website.contactContent || ''}
                                                    onChange={(val) => updateWebsiteField('contactContent', val)}
                                                    placeholder="Contact page message or instructions..."
                                                />
                                            </div>
                                        </div>

                                        {/* Footer Content */}
                                        <div className={styles.editorSection}>
                                            <h3>🦶 Footer Content</h3>
                                            <div className={styles.field}>
                                                <label>Footer Text</label>
                                                <RichTextEditor
                                                    value={website.footerContent || ''}
                                                    onChange={(val) => updateWebsiteField('footerContent', val)}
                                                    placeholder="Footer content..."
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Website Settings Tab */}
                                {editTab === 'settings' && website && (
                                    <>
                                        {/* Business Info */}
                                        <div className={styles.editorSection}>
                                            <h3>📋 Business Details</h3>
                                            <div className={styles.field}>
                                                <label>Business Name</label>
                                                <input
                                                    type="text"
                                                    value={website.businessName}
                                                    onChange={(e) => updateWebsiteField('businessName', e.target.value)}
                                                    className={styles.input}
                                                />
                                            </div>
                                            <div className={styles.field}>
                                                <label>Phone Number</label>
                                                <input
                                                    type="text"
                                                    value={website.contactPhone || ''}
                                                    onChange={(e) => updateWebsiteField('contactPhone', e.target.value)}
                                                    className={styles.input}
                                                    placeholder="(555) 123-4567"
                                                />
                                            </div>
                                            <div className={styles.field}>
                                                <label>Email</label>
                                                <input
                                                    type="email"
                                                    value={website.contactEmail || ''}
                                                    onChange={(e) => updateWebsiteField('contactEmail', e.target.value)}
                                                    className={styles.input}
                                                    placeholder="info@example.com"
                                                />
                                            </div>
                                            <div className={styles.field}>
                                                <label>Industry</label>
                                                <input
                                                    type="text"
                                                    value={website.industry}
                                                    onChange={(e) => updateWebsiteField('industry', e.target.value)}
                                                    className={styles.input}
                                                />
                                            </div>
                                        </div>

                                        {/* Brand Colors */}
                                        <div className={styles.editorSection}>
                                            <h3>🎨 Brand Colors</h3>
                                            <div className={styles.colorGrid}>
                                                <div className={styles.colorField}>
                                                    <label>Primary</label>
                                                    <div className={styles.colorInput}>
                                                        <input
                                                            type="color"
                                                            value={website.colors.primary}
                                                            onChange={(e) => updateWebsiteField('colors', { ...website.colors, primary: e.target.value })}
                                                        />
                                                        <span>{website.colors.primary}</span>
                                                    </div>
                                                </div>
                                                <div className={styles.colorField}>
                                                    <label>Secondary</label>
                                                    <div className={styles.colorInput}>
                                                        <input
                                                            type="color"
                                                            value={website.colors.secondary}
                                                            onChange={(e) => updateWebsiteField('colors', { ...website.colors, secondary: e.target.value })}
                                                        />
                                                        <span>{website.colors.secondary}</span>
                                                    </div>
                                                </div>
                                                <div className={styles.colorField}>
                                                    <label>Accent</label>
                                                    <div className={styles.colorInput}>
                                                        <input
                                                            type="color"
                                                            value={website.colors.accent}
                                                            onChange={(e) => updateWebsiteField('colors', { ...website.colors, accent: e.target.value })}
                                                        />
                                                        <span>{website.colors.accent}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Services */}
                                        <div className={styles.editorSection}>
                                            <div className={styles.sectionHeader}>
                                                <h3>🛠️ Services</h3>
                                                <button onClick={addService} className={styles.addBtn}>+ Add</button>
                                            </div>
                                            <div className={styles.itemList}>
                                                {website.services.map(service => (
                                                    <div key={service.id} className={styles.editableItem}>
                                                        <div className={styles.itemFields}>
                                                            <input
                                                                type="text"
                                                                value={service.name}
                                                                onChange={(e) => updateService(service.id, { name: e.target.value })}
                                                                className={styles.input}
                                                                placeholder="Service name"
                                                            />
                                                            <RichTextEditor
                                                                value={service.description}
                                                                onChange={(val) => updateService(service.id, { description: val })}
                                                                placeholder="Description"
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => deleteService(service.id)}
                                                            className={styles.deleteItemBtn}
                                                            title="Delete service"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Locations */}
                                        <div className={styles.editorSection}>
                                            <div className={styles.sectionHeader}>
                                                <h3>📍 Locations</h3>
                                                <button onClick={addLocation} className={styles.addBtn}>+ Add</button>
                                            </div>
                                            <div className={styles.itemList}>
                                                {website.locations.map(location => (
                                                    <div key={location.id} className={styles.editableItem}>
                                                        <div className={styles.itemFields}>
                                                            <input
                                                                type="text"
                                                                value={location.city}
                                                                onChange={(e) => updateLocation(location.id, { city: e.target.value })}
                                                                className={styles.input}
                                                                placeholder="City"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={location.state || ''}
                                                                onChange={(e) => updateLocation(location.id, { state: e.target.value })}
                                                                className={styles.input}
                                                                placeholder="State (optional)"
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => deleteLocation(location.id)}
                                                            className={styles.deleteItemBtn}
                                                            title="Delete location"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* @ts-expect-error Page Tab DISABLED */}
                                {/* Page Tab - DISABLED */}
                                {false && currentPage && (
                                    <>
                                        <div className={styles.editorSection}>
                                            <h3>📄 Page Settings</h3>
                                            <div className={styles.field}>
                                                <label>Page Title</label>
                                                <input
                                                    type="text"
                                                    value={currentPage.title}
                                                    onChange={(e) => {
                                                        if (!website) return;
                                                        const updatedPage = { ...currentPage, title: e.target.value };
                                                        handleSave({
                                                            ...website,
                                                            pages: website.pages.map(p => p.id === currentPage.id ? updatedPage : p)
                                                        });
                                                    }}
                                                    className={styles.input}
                                                />
                                            </div>
                                        </div>

                                        <div className={styles.editorSection}>
                                            <h3>🔍 SEO Settings</h3>
                                            <div className={styles.field}>
                                                <label>Title Tag</label>
                                                <input
                                                    type="text"
                                                    value={currentPage.seo.title}
                                                    onChange={(e) => updateSEO({ title: e.target.value })}
                                                    className={styles.input}
                                                />
                                                <small className={styles.hint}>Appears in browser tab and search results</small>
                                            </div>
                                            <div className={styles.field}>
                                                <label>Meta Description</label>
                                                <textarea
                                                    value={currentPage.seo.description}
                                                    onChange={(e) => updateSEO({ description: e.target.value })}
                                                    className={styles.textarea}
                                                    rows={3}
                                                />
                                                <small className={styles.hint}>Shown in search engine results (150-160 chars ideal)</small>
                                            </div>
                                            <div className={styles.field}>
                                                <label>Keywords</label>
                                                <input
                                                    type="text"
                                                    value={currentPage.seo.keywords?.join(', ') || ''}
                                                    onChange={(e) => updateSEO({ keywords: e.target.value.split(',').map(k => k.trim()) })}
                                                    className={styles.input}
                                                    placeholder="keyword1, keyword2, keyword3"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Sections Tab - DISABLED */}
                                {false && (
                                    <>
                                        {/* Sections List */}
                                        <div className={styles.editorSection}>
                                            <h3>Current Sections</h3>
                                            <p className={styles.hint}>Click ✏️ to edit any section</p>
                                            <div className={styles.sectionList}>
                                                {currentPage.content
                                                    .sort((a, b) => a.order - b.order)
                                                    .map((section, index) => (
                                                        <div key={section.id} className={styles.sectionItem}>
                                                            <div className={styles.sectionInfo}>
                                                                <span className={styles.sectionNumber}>{index + 1}</span>
                                                                <span className={styles.sectionType}>{section.type}</span>
                                                            </div>
                                                            <div className={styles.sectionActions}>
                                                                <button
                                                                    onClick={() => handleMoveSection(section.id, 'up')}
                                                                    disabled={index === 0}
                                                                    className={styles.moveBtn}
                                                                >
                                                                    ↑
                                                                </button>
                                                                <button
                                                                    onClick={() => handleMoveSection(section.id, 'down')}
                                                                    disabled={index === currentPage.content.length - 1}
                                                                    className={styles.moveBtn}
                                                                >
                                                                    ↓
                                                                </button>
                                                                <button
                                                                    onClick={() => handleEditSection(section)}
                                                                    className={styles.editBtn}
                                                                >
                                                                    ✏️
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteSection(section.id)}
                                                                    className={styles.deleteBtn}
                                                                >
                                                                    🗑️
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>

                                        {/* Add Section */}
                                        <div className={styles.editorSection}>
                                            <h3>Add New Section</h3>
                                            <div className={styles.addSectionGrid}>
                                                <button onClick={() => handleAddSection('hero')} className={styles.addSectionBtn}>
                                                    🎯 Hero
                                                </button>
                                                <button onClick={() => handleAddSection('cta')} className={styles.addSectionBtn}>
                                                    📢 CTA
                                                </button>
                                                <button onClick={() => handleAddSection('text-block')} className={styles.addSectionBtn}>
                                                    📝 Text Block
                                                </button>
                                                <button onClick={() => handleAddSection('image')} className={styles.addSectionBtn}>
                                                    🖼️ Image
                                                </button>
                                                <button onClick={() => handleAddSection('video')} className={styles.addSectionBtn}>
                                                    📹 Video
                                                </button>
                                                <button onClick={() => handleAddSection('features')} className={styles.addSectionBtn}>
                                                    ⭐ Features
                                                </button>
                                                <button onClick={() => handleAddSection('custom-content')} className={styles.addSectionBtn}>
                                                    🔧 HTML
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Branding Tab - DISABLED */}
                                {false && website && (
                                    <>
                                        {/* Global Branding Notice */}
                                        <div className={styles.editorSection}>
                                            <div className={styles.hint} style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-md)', marginBottom: 0 }}>
                                                🌐 <strong>Global Branding</strong> - Changes here apply to your entire website across all pages.
                                            </div>
                                        </div>

                                        {/* Logo Upload */}
                                        <div className={styles.editorSection}>
                                            <h3>🖼️ Logo</h3>
                                            <div className={styles.field}>
                                                {website.logoUrl ? (
                                                    <div className={styles.logoPreview}>
                                                        <img src={website.logoUrl} alt="Logo preview" />
                                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                                                            <button
                                                                className={styles.cancelBtn}
                                                                onClick={() => setShowLogoUploader(true)}
                                                                style={{ flex: 1 }}
                                                            >
                                                                📷 Change Logo
                                                            </button>
                                                            <button
                                                                className={styles.deleteBtn}
                                                                onClick={() => updateWebsiteField('logoUrl', '')}
                                                                style={{ padding: '8px 12px' }}
                                                            >
                                                                🗑️
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className={styles.saveBtn}
                                                        onClick={() => setShowLogoUploader(true)}
                                                        style={{ width: '100%' }}
                                                    >
                                                        📤 Upload Logo
                                                    </button>
                                                )}
                                            </div>
                                            <div className={styles.field} style={{ marginTop: '1rem' }}>
                                                <label>Or enter URL directly</label>
                                                <input
                                                    type="text"
                                                    value={website.logoUrl || ''}
                                                    onChange={(e) => updateWebsiteField('logoUrl', e.target.value)}
                                                    className={styles.input}
                                                    placeholder="https://example.com/logo.png"
                                                />
                                            </div>
                                        </div>

                                        {/* Favicon */}
                                        <div className={styles.editorSection}>
                                            <h3>🔖 Favicon</h3>
                                            <div className={styles.field}>
                                                <label>Favicon URL (optional)</label>
                                                <input
                                                    type="text"
                                                    value={website.faviconUrl || ''}
                                                    onChange={(e) => updateWebsiteField('faviconUrl', e.target.value)}
                                                    className={styles.input}
                                                    placeholder="https://example.com/favicon.ico"
                                                />
                                                <span className={styles.hint}>Leave blank to use logo as favicon</span>
                                            </div>
                                        </div>

                                        {/* Color Theme */}
                                        <div className={styles.editorSection}>
                                            <h3>🎨 Color Theme</h3>

                                            {/* Color Palettes */}
                                            <label style={{ marginBottom: '0.5rem', display: 'block' }}>Quick Palettes (Click to Apply)</label>
                                            <div className={styles.paletteGrid}>
                                                {INDUSTRY_TEMPLATES.map((template) => {
                                                    const colors = template.light;
                                                    return (
                                                        <button
                                                            key={template.id}
                                                            type="button"
                                                            className={styles.paletteCard}
                                                            onClick={() => {
                                                                const brandColors = templateToBrandColors(template, 'light') as BrandColors;
                                                                setWebsite({ ...website, colors: brandColors });
                                                                saveWebsite({ ...website, colors: brandColors });
                                                            }}
                                                            title={template.name}
                                                        >
                                                            <div className={styles.paletteSwatches}>
                                                                <span style={{ background: colors.primary }}></span>
                                                                <span style={{ background: colors.secondary }}></span>
                                                                <span style={{ background: colors.accent }}></span>
                                                            </div>
                                                            <span className={styles.paletteName}>{template.name}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            <label style={{ marginTop: '1.5rem', marginBottom: '0.5rem', display: 'block' }}>Custom Colors</label>
                                            <div className={styles.colorGrid}>
                                                <div className={styles.colorField}>
                                                    <label>Primary</label>
                                                    <div className={styles.colorInput}>
                                                        <input
                                                            type="color"
                                                            value={website.colors.primary}
                                                            onChange={(e) => {
                                                                const newColors = { ...website.colors, primary: e.target.value };
                                                                setWebsite({ ...website, colors: newColors });
                                                                saveWebsite({ ...website, colors: newColors });
                                                            }}
                                                        />
                                                        <span>{website.colors.primary}</span>
                                                    </div>
                                                </div>
                                                <div className={styles.colorField}>
                                                    <label>Secondary</label>
                                                    <div className={styles.colorInput}>
                                                        <input
                                                            type="color"
                                                            value={website.colors.secondary}
                                                            onChange={(e) => {
                                                                const newColors = { ...website.colors, secondary: e.target.value };
                                                                setWebsite({ ...website, colors: newColors });
                                                                saveWebsite({ ...website, colors: newColors });
                                                            }}
                                                        />
                                                        <span>{website.colors.secondary}</span>
                                                    </div>
                                                </div>
                                                <div className={styles.colorField}>
                                                    <label>Accent</label>
                                                    <div className={styles.colorInput}>
                                                        <input
                                                            type="color"
                                                            value={website.colors.accent}
                                                            onChange={(e) => {
                                                                const newColors = { ...website.colors, accent: e.target.value };
                                                                setWebsite({ ...website, colors: newColors });
                                                                saveWebsite({ ...website, colors: newColors });
                                                            }}
                                                        />
                                                        <span>{website.colors.accent}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={styles.colorGrid} style={{ marginTop: '1rem' }}>
                                                <div className={styles.colorField}>
                                                    <label>Background</label>
                                                    <div className={styles.colorInput}>
                                                        <input
                                                            type="color"
                                                            value={website.colors.background}
                                                            onChange={(e) => {
                                                                const newColors = { ...website.colors, background: e.target.value };
                                                                setWebsite({ ...website, colors: newColors });
                                                                saveWebsite({ ...website, colors: newColors });
                                                            }}
                                                        />
                                                        <span>{website.colors.background}</span>
                                                    </div>
                                                </div>
                                                <div className={styles.colorField}>
                                                    <label>Text</label>
                                                    <div className={styles.colorInput}>
                                                        <input
                                                            type="color"
                                                            value={website.colors.text}
                                                            onChange={(e) => {
                                                                const newColors = { ...website.colors, text: e.target.value };
                                                                setWebsite({ ...website, colors: newColors });
                                                                saveWebsite({ ...website, colors: newColors });
                                                            }}
                                                        />
                                                        <span>{website.colors.text}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick Actions */}
                                        <div className={styles.editorSection}>
                                            <h3>⚡ Quick Actions</h3>
                                            <div className={styles.field}>
                                                <button
                                                    className={styles.saveBtn}
                                                    onClick={() => {
                                                        saveWebsite(website);
                                                        alert('✅ Branding changes saved! Click Deploy to update your live site.');
                                                    }}
                                                >
                                                    💾 Save Branding Changes
                                                </button>
                                            </div>
                                            <p className={styles.hint}>
                                                Changes are saved locally. Click &quot;Deploy&quot; in the toolbar to update your live website.
                                            </p>
                                        </div>
                                    </>
                                )}

                                {/* Blog Tab - DISABLED */}
                                {false && website && (
                                    <>
                                        {/* Create New Post */}
                                        <div className={styles.editorSection}>
                                            <h3>✍️ Blog Posts</h3>
                                            <div className={styles.hint} style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                                                Create blog posts for <strong>{website.businessName}</strong>. Posts will be added to your website.
                                            </div>
                                        </div>

                                        <div className={styles.editorSection}>
                                            <h4>Create New Post</h4>
                                            <div className={styles.field}>
                                                <label>Post Title</label>
                                                <input
                                                    type="text"
                                                    className={styles.input}
                                                    placeholder="Enter blog post title..."
                                                    value={blogPostTitle}
                                                    onChange={(e) => setBlogPostTitle(e.target.value)}
                                                />
                                            </div>
                                            <div className={styles.field} style={{ marginTop: '1rem' }}>
                                                <label>Content</label>
                                                <RichTextEditor
                                                    value={blogPostContent}
                                                    onChange={setBlogPostContent}
                                                    placeholder="Write your blog post content here... (paste from WordPress, Google Docs, etc.)"
                                                />
                                            </div>
                                            <div className={styles.field} style={{ marginTop: '1rem' }}>
                                                <button
                                                    className={styles.saveBtn}
                                                    onClick={() => {
                                                        if (!blogPostTitle.trim()) {
                                                            alert('Please enter a post title');
                                                            return;
                                                        }
                                                        if (!blogPostContent.trim()) {
                                                            alert('Please enter post content');
                                                            return;
                                                        }
                                                        // Add blog post to website pages
                                                        const slug = blogPostTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                                                        const newPage: Page = {
                                                            id: generateId(),
                                                            title: blogPostTitle,
                                                            slug: `blog/${slug}`,
                                                            type: 'blog-post',
                                                            content: [{
                                                                id: generateId(),
                                                                type: 'custom-content',
                                                                content: {
                                                                    html: `<article class="blog-post"><h1>${blogPostTitle}</h1>${blogPostContent}</article>`
                                                                },
                                                                order: 0
                                                            }],
                                                            seo: {
                                                                title: blogPostTitle,
                                                                description: blogPostContent.replace(/<[^>]*>/g, '').substring(0, 160),
                                                                keywords: []
                                                            },
                                                            order: website.pages.length,
                                                            isPublished: true
                                                        };
                                                        const updatedWebsite = {
                                                            ...website,
                                                            pages: [...website.pages, newPage]
                                                        };
                                                        setWebsite(updatedWebsite);
                                                        saveWebsite(updatedWebsite);
                                                        setBlogPostTitle('');
                                                        setBlogPostContent('');
                                                        alert('✅ Blog post added! Click Deploy to publish.');
                                                    }}
                                                    style={{ width: '100%' }}
                                                >
                                                    ➕ Add Blog Post
                                                </button>
                                            </div>
                                        </div>

                                        {/* Existing Blog Posts */}
                                        <div className={styles.editorSection}>
                                            <h4>Existing Blog Posts</h4>
                                            {website.pages.filter(p => p.type === 'blog' || p.slug?.startsWith('blog/')).length === 0 ? (
                                                <p className={styles.hint}>No blog posts yet. Create your first post above!</p>
                                            ) : (
                                                <div className={styles.pagesList}>
                                                    {website.pages.filter(p => p.type === 'blog' || p.slug?.startsWith('blog/')).map(post => (
                                                        <div key={post.id} className={styles.pageItem}>
                                                            <span>📝 {post.title}</span>
                                                            <button
                                                                className={styles.deleteBtn}
                                                                onClick={() => {
                                                                    if (confirm(`Delete "${post.title}"?`)) {
                                                                        const updatedWebsite = {
                                                                            ...website,
                                                                            pages: website.pages.filter(p => p.id !== post.id)
                                                                        };
                                                                        setWebsite(updatedWebsite);
                                                                        saveWebsite(updatedWebsite);
                                                                    }
                                                                }}
                                                            >
                                                                🗑️
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </aside>
                )}
            </div>

            {/* Floating Element Editor */}
            {selectedElement && (
                <div className={styles.floatingEditor} style={{
                    top: Math.max(70, (iframeRef.current?.getBoundingClientRect().top || 0) + selectedElement.rect.top - 50),
                    left: Math.max(100, Math.min(
                        (iframeRef.current?.getBoundingClientRect().left || 0) + selectedElement.rect.left + (selectedElement.rect.width / 2),
                        window.innerWidth - 250
                    ))
                }}>
                    <div className={styles.floatingEditorType}>
                        {selectedElement.elementType === 'heading' ? selectedElement.tagName : selectedElement.elementType}
                    </div>
                    <div className={styles.floatingEditorButtons}>
                        {selectedElement.elementType === 'image' && (
                            <button
                                onClick={() => setShowImageUploader(true)}
                                className={styles.floatingBtn}
                                title="Replace Image"
                            >
                                📷 Replace
                            </button>
                        )}
                        {selectedElement.elementType === 'video' && (
                            <button
                                onClick={() => {
                                    setEditingVideoUrl(selectedElement.src || '');
                                    setEditingVideoElementId(selectedElement.elementId);
                                    setShowVideoEditor(true);
                                }}
                                className={styles.floatingBtn}
                                title="Change Video URL"
                            >
                                📹 Change Video
                            </button>
                        )}
                        {(selectedElement.elementType === 'text' || selectedElement.elementType === 'heading') && (
                            <span className={styles.floatingHint}>Double-click to edit text</span>
                        )}
                        <button
                            onClick={handleDeselectElement}
                            className={styles.floatingBtnClose}
                            title="Close"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Image Uploader Modal */}
            {showImageUploader && (
                <ImageUploader
                    onImageSelect={handleImageUpload}
                    onClose={() => setShowImageUploader(false)}
                    currentImage={selectedElement?.elementType === 'image' ? selectedElement.content : undefined}
                />
            )}

            {/* Logo Uploader Modal */}
            {showLogoUploader && website && (
                <ImageUploader
                    onImageSelect={(imageUrl) => {
                        updateWebsiteField('logoUrl', imageUrl);
                        setShowLogoUploader(false);
                    }}
                    onClose={() => setShowLogoUploader(false)}
                    currentImage={website.logoUrl}
                />
            )}

            {/* Video URL Editor Modal */}
            {showVideoEditor && (
                <div className={styles.modalOverlay} onClick={() => setShowVideoEditor(false)}>
                    <div className={styles.videoEditorModal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>📹 Edit Video URL</h3>
                            <button onClick={() => setShowVideoEditor(false)} className={styles.closeBtn}>×</button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.field}>
                                <label>YouTube URL</label>
                                <input
                                    type="text"
                                    value={editingVideoUrl}
                                    onChange={(e) => setEditingVideoUrl(e.target.value)}
                                    className={styles.input}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    autoFocus
                                />
                                <small className={styles.hint}>Paste any YouTube video URL (e.g., youtube.com/watch?v=... or youtu.be/...)</small>
                            </div>
                            {editingVideoUrl && (
                                <div className={styles.videoPreview}>
                                    <iframe
                                        src={editingVideoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
                                            ? `https://www.youtube.com/embed/${editingVideoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1]}`
                                            : editingVideoUrl}
                                        width="100%"
                                        height="200"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                                        allowFullScreen
                                    />
                                </div>
                            )}
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={() => setShowVideoEditor(false)} className={styles.cancelBtn}>Cancel</button>
                            <button onClick={handleVideoSave} className={styles.saveBtn}>Save Video</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Deploy Modal */}
            <DeployModal
                isOpen={showDeployModal}
                onClose={() => setShowDeployModal(false)}
                siteName={website.businessName}
                siteId={website.id}
                existingUrl={website.netlifyUrl}
                onDeploySuccess={(url) => {
                    const updatedWebsite = {
                        ...website,
                        status: 'published' as const,
                        netlifyUrl: url,
                    };
                    handleSave(updatedWebsite);
                    setShowDeployModal(false);
                }}
            />
        </div>
    );
}
