// CTA Section Editor - Edit call-to-action block
'use client';

import React from 'react';
import { CTASectionContent } from '@/lib/types';
import styles from './SectionEditor.module.css';

interface CTAEditorProps {
    content: CTASectionContent;
    onChange: (updates: Partial<CTASectionContent>) => void;
}

export function CTAEditor({ content, onChange }: CTAEditorProps) {
    return (
        <div className={styles.editorFields}>
            <div className={styles.formGroup}>
                <label className={styles.label}>Headline</label>
                <input
                    type="text"
                    className={styles.input}
                    value={content.headline || ''}
                    onChange={(e) => onChange({ headline: e.target.value })}
                    placeholder="Ready to Get Started?"
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Subheadline
                    <span className={styles.labelHint}>Optional</span>
                </label>
                <textarea
                    className={styles.textarea}
                    value={content.subheadline || ''}
                    onChange={(e) => onChange({ subheadline: e.target.value })}
                    placeholder="Contact us today for a free consultation"
                    rows={2}
                />
            </div>

            <div className={styles.divider} />

            <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-secondary)' }}>
                Button
            </h4>

            <div className={styles.inputRow}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Button Text</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={content.buttonText || ''}
                        onChange={(e) => onChange({ buttonText: e.target.value })}
                        placeholder="Contact Us Now"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Button Link</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={content.buttonLink || ''}
                        onChange={(e) => onChange({ buttonLink: e.target.value })}
                        placeholder="/contact"
                    />
                </div>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Button Style</label>
                <div className={styles.selectButtons}>
                    <button
                        type="button"
                        className={`${styles.selectBtn} ${content.variant === 'primary' || !content.variant ? styles.active : ''}`}
                        onClick={() => onChange({ variant: 'primary' })}
                    >
                        Primary
                    </button>
                    <button
                        type="button"
                        className={`${styles.selectBtn} ${content.variant === 'secondary' ? styles.active : ''}`}
                        onClick={() => onChange({ variant: 'secondary' })}
                    >
                        Secondary
                    </button>
                    <button
                        type="button"
                        className={`${styles.selectBtn} ${content.variant === 'accent' ? styles.active : ''}`}
                        onClick={() => onChange({ variant: 'accent' })}
                    >
                        Accent
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CTAEditor;
