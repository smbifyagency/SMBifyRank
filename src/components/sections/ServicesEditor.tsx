// Services Section Editor - Edit services grid
'use client';

import React from 'react';
import { ServicesSectionContent } from '@/lib/types';
import styles from './SectionEditor.module.css';

interface ServicesEditorProps {
    content: ServicesSectionContent;
    onChange: (updates: Partial<ServicesSectionContent>) => void;
}

export function ServicesEditor({ content, onChange }: ServicesEditorProps) {
    const services = content.services || [];

    const addService = () => {
        onChange({
            services: [
                ...services,
                {
                    id: `service-${Date.now()}`,
                    name: '',
                    description: '',
                    icon: '✓',
                },
            ],
        });
    };

    const updateService = (id: string, updates: Partial<typeof services[0]>) => {
        onChange({
            services: services.map((s) =>
                s.id === id ? { ...s, ...updates } : s
            ),
        });
    };

    const deleteService = (id: string) => {
        onChange({
            services: services.filter((s) => s.id !== id),
        });
    };

    const moveService = (id: string, direction: 'up' | 'down') => {
        const index = services.findIndex((s) => s.id === id);
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === services.length - 1)
        ) {
            return;
        }
        const newServices = [...services];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newServices[index], newServices[targetIndex]] = [newServices[targetIndex], newServices[index]];
        onChange({ services: newServices });
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
                    placeholder="Our Services"
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
                    placeholder="What we offer"
                />
            </div>

            <div className={styles.divider} />

            <label className={styles.label} style={{ marginBottom: 'var(--space-md)' }}>
                Services ({services.length})
            </label>

            <div className={styles.arrayItems}>
                {services.map((service, index) => (
                    <div key={service.id} className={styles.arrayItem}>
                        <div className={styles.arrayItemHeader}>
                            <span className={styles.arrayItemTitle}>
                                Service {index + 1}
                            </span>
                            <div className={styles.arrayItemActions}>
                                <button
                                    type="button"
                                    className={styles.iconBtn}
                                    onClick={() => moveService(service.id, 'up')}
                                    disabled={index === 0}
                                    title="Move up"
                                >
                                    ↑
                                </button>
                                <button
                                    type="button"
                                    className={styles.iconBtn}
                                    onClick={() => moveService(service.id, 'down')}
                                    disabled={index === services.length - 1}
                                    title="Move down"
                                >
                                    ↓
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.iconBtn} ${styles.delete}`}
                                    onClick={() => deleteService(service.id)}
                                    title="Delete"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className={styles.inputRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Icon</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={service.icon || ''}
                                    onChange={(e) => updateService(service.id, { icon: e.target.value })}
                                    placeholder="🔧"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Service Name</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={service.name}
                                    onChange={(e) => updateService(service.id, { name: e.target.value })}
                                    placeholder="Service Name"
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Description</label>
                            <textarea
                                className={styles.textarea}
                                value={service.description}
                                onChange={(e) => updateService(service.id, { description: e.target.value })}
                                placeholder="Brief description of this service"
                                rows={2}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Link URL
                                <span className={styles.labelHint}>Optional - links to service page</span>
                            </label>
                            <input
                                type="text"
                                className={styles.input}
                                value={service.link || ''}
                                onChange={(e) => updateService(service.id, { link: e.target.value || undefined })}
                                placeholder="/services/service-name"
                            />
                        </div>
                    </div>
                ))}

                <button type="button" className={styles.addBtn} onClick={addService}>
                    + Add Service
                </button>
            </div>
        </div>
    );
}

export default ServicesEditor;
