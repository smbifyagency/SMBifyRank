// Hero Section Editor - Edit headline, subheadline, CTAs
'use client';

import React from 'react';
import { HeroSectionContent } from '@/lib/types';
import styles from './SectionEditor.module.css';

interface HeroEditorProps {
    content: HeroSectionContent;
    onChange: (updates: Partial<HeroSectionContent>) => void;
    businessContext?: {
        businessName: string;
        industry: string;
        phone?: string;
    };
}

export function HeroEditor({ content, onChange, businessContext }: HeroEditorProps) {
    return (
        <div className={styles.editorFields}>
            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Main Headline
                    <span className={styles.labelHint}>The big title visitors see first</span>
                </label>
                <input
                    type="text"
                    className={styles.input}
                    value={content.headline || ''}
                    onChange={(e) => onChange({ headline: e.target.value })}
                    placeholder={`Welcome to ${businessContext?.businessName || 'Our Business'}`}
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Subheadline
                    <span className={styles.labelHint}>Supporting text under the headline</span>
                </label>
                <textarea
                    className={styles.textarea}
                    value={content.subheadline || ''}
                    onChange={(e) => onChange({ subheadline: e.target.value })}
                    placeholder="Professional services you can trust"
                    rows={3}
                />
            </div>

            <div className={styles.divider} />

            <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-secondary)' }}>
                Primary Button
            </h4>

            <div className={styles.inputRow}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Button Text</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={content.ctaPrimary?.text || ''}
                        onChange={(e) => onChange({
                            ctaPrimary: { ...content.ctaPrimary, text: e.target.value, link: content.ctaPrimary?.link || '/contact' }
                        })}
                        placeholder="Get Started"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Button Link</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={content.ctaPrimary?.link || ''}
                        onChange={(e) => onChange({
                            ctaPrimary: { ...content.ctaPrimary, text: content.ctaPrimary?.text || 'Get Started', link: e.target.value }
                        })}
                        placeholder="/contact"
                    />
                </div>
            </div>

            <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-secondary)' }}>
                Secondary Button (Optional)
            </h4>

            <div className={styles.inputRow}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Button Text</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={content.ctaSecondary?.text || ''}
                        onChange={(e) => onChange({
                            ctaSecondary: e.target.value ? { text: e.target.value, link: content.ctaSecondary?.link || '/about' } : undefined
                        })}
                        placeholder="Learn More"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Button Link</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={content.ctaSecondary?.link || ''}
                        onChange={(e) => onChange({
                            ctaSecondary: { text: content.ctaSecondary?.text || 'Learn More', link: e.target.value }
                        })}
                        placeholder="/about"
                    />
                </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.formGroup}>
                <div className={styles.toggle}>
                    <label className={styles.toggleSwitch}>
                        <input
                            type="checkbox"
                            checked={content.showPhone !== false}
                            onChange={(e) => onChange({ showPhone: e.target.checked })}
                        />
                        <span className={styles.toggleSlider} />
                    </label>
                    <span className={styles.toggleLabel}>
                        Show phone number in hero
                        {businessContext?.phone && ` (${businessContext.phone})`}
                    </span>
                </div>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Background Image URL
                    <span className={styles.labelHint}>Optional - leave empty for gradient background</span>
                </label>
                <input
                    type="text"
                    className={styles.input}
                    value={content.backgroundImage || ''}
                    onChange={(e) => onChange({ backgroundImage: e.target.value || undefined })}
                    placeholder="https://..."
                />
            </div>
        </div>
    );
}

export default HeroEditor;
