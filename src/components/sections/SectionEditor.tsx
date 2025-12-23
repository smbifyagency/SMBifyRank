// Section Editor - Main component that routes to specific section editors
// This provides a form-based interface for editing JSON section content

'use client';

import React from 'react';
import { PageSection, SectionType, SectionContent } from '@/lib/types';
import { HeroEditor } from './HeroEditor';
import { ServicesEditor } from './ServicesEditor';
import { AboutEditor } from './AboutEditor';
import { ContactEditor } from './ContactEditor';
import { CTAEditor } from './CTAEditor';
import { TestimonialsEditor } from './TestimonialsEditor';
import { FAQEditor } from './FAQEditor';
import { FeaturesEditor } from './FeaturesEditor';
import { TextBlockEditor } from './TextBlockEditor';
import { GenericEditor } from './GenericEditor';
import styles from './SectionEditor.module.css';

interface SectionEditorProps {
    section: PageSection;
    onChange: (content: SectionContent) => void;
    onResetLock?: () => void; // Allow AI to regenerate
    businessContext?: {
        businessName: string;
        industry: string;
        phone?: string;
        email?: string;
    };
}

export function SectionEditor({ section, onChange, onResetLock, businessContext }: SectionEditorProps) {
    const handleChange = (updates: Partial<SectionContent>) => {
        onChange({
            ...section.content,
            ...updates,
        } as SectionContent);
    };

    const getSectionTitle = (type: SectionType): string => {
        const titles: Record<SectionType, string> = {
            'hero': 'Hero Section',
            'services-grid': 'Services Grid',
            'about-intro': 'About Section',
            'contact-form': 'Contact Form',
            'cta': 'Call to Action',
            'testimonials': 'Testimonials',
            'locations-list': 'Service Areas',
            'gallery': 'Image Gallery',
            'faq': 'FAQ',
            'features': 'Features',
            'trust-badges': 'Trust Badges',
            'blog-list': 'Blog List',
            'text-block': 'Text Block',
            'image': 'Image',
            'video': 'Video',
            'custom-content': 'Custom Content',
        };
        return titles[type] || 'Section';
    };

    const renderEditor = () => {
        switch (section.type) {
            case 'hero':
                return (
                    <HeroEditor
                        content={section.content as any}
                        onChange={handleChange}
                        businessContext={businessContext}
                    />
                );
            case 'services-grid':
                return (
                    <ServicesEditor
                        content={section.content as any}
                        onChange={handleChange}
                    />
                );
            case 'about-intro':
                return (
                    <AboutEditor
                        content={section.content as any}
                        onChange={handleChange}
                    />
                );
            case 'contact-form':
                return (
                    <ContactEditor
                        content={section.content as any}
                        onChange={handleChange}
                        businessContext={businessContext}
                    />
                );
            case 'cta':
                return (
                    <CTAEditor
                        content={section.content as any}
                        onChange={handleChange}
                    />
                );
            case 'testimonials':
                return (
                    <TestimonialsEditor
                        content={section.content as any}
                        onChange={handleChange}
                    />
                );
            case 'faq':
                return (
                    <FAQEditor
                        content={section.content as any}
                        onChange={handleChange}
                    />
                );
            case 'features':
                return (
                    <FeaturesEditor
                        content={section.content as any}
                        onChange={handleChange}
                    />
                );
            case 'text-block':
                return (
                    <TextBlockEditor
                        content={section.content as any}
                        onChange={handleChange}
                    />
                );
            default:
                return (
                    <GenericEditor
                        content={section.content}
                        onChange={handleChange}
                        sectionType={section.type}
                    />
                );
        }
    };

    return (
        <div className={styles.sectionEditor}>
            <div className={styles.header}>
                <h3 className={styles.title}>
                    {getSectionTitle(section.type)}
                </h3>
                <div className={styles.meta}>
                    {section.userEdited && (
                        <span className={styles.editedBadge} title="User-edited - AI won't overwrite">
                            🔒 Locked
                        </span>
                    )}
                    {section.lastEditedBy && (
                        <span className={styles.lastEdited}>
                            Last edited by {section.lastEditedBy}
                            {section.lastEditedAt && ` on ${new Date(section.lastEditedAt).toLocaleDateString()}`}
                        </span>
                    )}
                </div>
            </div>

            <div className={styles.editorContent}>
                {renderEditor()}
            </div>

            {section.userEdited && onResetLock && (
                <div className={styles.lockActions}>
                    <button
                        type="button"
                        onClick={onResetLock}
                        className={styles.unlockBtn}
                    >
                        🔓 Unlock for AI Regeneration
                    </button>
                    <p className={styles.lockHint}>
                        Unlocking allows AI to regenerate this section's content.
                    </p>
                </div>
            )}
        </div>
    );
}

export default SectionEditor;
