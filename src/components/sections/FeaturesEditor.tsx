// Features Section Editor
'use client';

import React from 'react';
import { FeaturesSectionContent } from '@/lib/types';
import styles from './SectionEditor.module.css';

interface FeaturesEditorProps {
    content: FeaturesSectionContent;
    onChange: (updates: Partial<FeaturesSectionContent>) => void;
}

export function FeaturesEditor({ content, onChange }: FeaturesEditorProps) {
    const features = content.features || [];

    const addFeature = () => {
        onChange({
            features: [
                ...features,
                {
                    id: `feature-${Date.now()}`,
                    icon: '✓',
                    title: '',
                    description: '',
                },
            ],
        });
    };

    const updateFeature = (id: string, updates: Partial<typeof features[0]>) => {
        onChange({
            features: features.map((f) =>
                f.id === id ? { ...f, ...updates } : f
            ),
        });
    };

    const deleteFeature = (id: string) => {
        onChange({
            features: features.filter((f) => f.id !== id),
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
                    placeholder="Why Choose Us"
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Subtitle
                    <span className={styles.labelHint}>Optional</span>
                </label>
                <input
                    type="text"
                    className={styles.input}
                    value={content.subtitle || ''}
                    onChange={(e) => onChange({ subtitle: e.target.value })}
                    placeholder="What makes us different"
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>Layout</label>
                <div className={styles.selectButtons}>
                    <button
                        type="button"
                        className={`${styles.selectBtn} ${content.layout === 'grid' || !content.layout ? styles.active : ''}`}
                        onClick={() => onChange({ layout: 'grid' })}
                    >
                        Grid
                    </button>
                    <button
                        type="button"
                        className={`${styles.selectBtn} ${content.layout === 'list' ? styles.active : ''}`}
                        onClick={() => onChange({ layout: 'list' })}
                    >
                        List
                    </button>
                </div>
            </div>

            <div className={styles.divider} />

            <label className={styles.label} style={{ marginBottom: 'var(--space-md)' }}>
                Features ({features.length})
            </label>

            <div className={styles.arrayItems}>
                {features.map((feature, index) => (
                    <div key={feature.id} className={styles.arrayItem}>
                        <div className={styles.arrayItemHeader}>
                            <span className={styles.arrayItemTitle}>
                                Feature {index + 1}
                            </span>
                            <button
                                type="button"
                                className={`${styles.iconBtn} ${styles.delete}`}
                                onClick={() => deleteFeature(feature.id)}
                                title="Delete"
                            >
                                ✕
                            </button>
                        </div>

                        <div className={styles.inputRow}>
                            <div className={styles.formGroup} style={{ flex: '0 0 80px' }}>
                                <label className={styles.label}>Icon</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={feature.icon || ''}
                                    onChange={(e) => updateFeature(feature.id, { icon: e.target.value })}
                                    placeholder="🏆"
                                />
                            </div>
                            <div className={styles.formGroup} style={{ flex: 1 }}>
                                <label className={styles.label}>Title</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={feature.title}
                                    onChange={(e) => updateFeature(feature.id, { title: e.target.value })}
                                    placeholder="Licensed & Insured"
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Description</label>
                            <textarea
                                className={styles.textarea}
                                value={feature.description}
                                onChange={(e) => updateFeature(feature.id, { description: e.target.value })}
                                placeholder="We are fully licensed and insured for your protection"
                                rows={2}
                            />
                        </div>
                    </div>
                ))}

                <button type="button" className={styles.addBtn} onClick={addFeature}>
                    + Add Feature
                </button>
            </div>
        </div>
    );
}

export default FeaturesEditor;
