// About Section Editor - Edit about content with rich text
'use client';

import React from 'react';
import { AboutSectionContent } from '@/lib/types';
import RichTextEditor from '@/components/RichTextEditor';
import styles from './SectionEditor.module.css';

interface AboutEditorProps {
    content: AboutSectionContent;
    onChange: (updates: Partial<AboutSectionContent>) => void;
}

export function AboutEditor({ content, onChange }: AboutEditorProps) {
    const features = content.features || [];

    const addFeature = () => {
        onChange({
            features: [
                ...features,
                { icon: '✓', text: '' },
            ],
        });
    };

    const updateFeature = (index: number, updates: Partial<{ icon: string; text: string }>) => {
        const newFeatures = [...features];
        newFeatures[index] = { ...newFeatures[index], ...updates };
        onChange({ features: newFeatures });
    };

    const deleteFeature = (index: number) => {
        onChange({
            features: features.filter((_, i) => i !== index),
        });
    };

    return (
        <div className={styles.editorFields}>
            <div className={styles.formGroup}>
                <label className={styles.label}>Section Title</label>
                <input
                    type="text"
                    className={styles.input}
                    value={content.title || ''}
                    onChange={(e) => onChange({ title: e.target.value })}
                    placeholder="About Us"
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    About Content
                    <span className={styles.labelHint}>Rich text - use toolbar for formatting</span>
                </label>
                <div className={styles.richTextContainer}>
                    <RichTextEditor
                        value={content.body || ''}
                        onChange={(html) => onChange({ body: html })}
                        placeholder="Tell your story..."
                    />
                </div>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Image URL
                    <span className={styles.labelHint}>Optional</span>
                </label>
                <input
                    type="text"
                    className={styles.input}
                    value={content.image || ''}
                    onChange={(e) => onChange({ image: e.target.value || undefined })}
                    placeholder="https://..."
                />
            </div>

            <div className={styles.divider} />

            <label className={styles.label} style={{ marginBottom: 'var(--space-md)' }}>
                Feature Points ({features.length})
            </label>

            <div className={styles.arrayItems}>
                {features.map((feature, index) => (
                    <div key={index} className={styles.arrayItem}>
                        <div className={styles.inputRow}>
                            <div className={styles.formGroup} style={{ flex: '0 0 80px' }}>
                                <label className={styles.label}>Icon</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={feature.icon}
                                    onChange={(e) => updateFeature(index, { icon: e.target.value })}
                                    placeholder="✓"
                                />
                            </div>
                            <div className={styles.formGroup} style={{ flex: 1 }}>
                                <label className={styles.label}>Feature Text</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={feature.text}
                                    onChange={(e) => updateFeature(index, { text: e.target.value })}
                                    placeholder="Licensed and insured"
                                />
                            </div>
                            <button
                                type="button"
                                className={`${styles.iconBtn} ${styles.delete}`}
                                onClick={() => deleteFeature(index)}
                                style={{ alignSelf: 'flex-end', marginBottom: 'var(--space-lg)' }}
                                title="Delete"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}

                <button type="button" className={styles.addBtn} onClick={addFeature}>
                    + Add Feature Point
                </button>
            </div>
        </div>
    );
}

export default AboutEditor;
