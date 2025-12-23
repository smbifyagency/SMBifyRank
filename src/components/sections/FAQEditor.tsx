// FAQ Section Editor
'use client';

import React from 'react';
import { FAQSectionContent } from '@/lib/types';
import styles from './SectionEditor.module.css';

interface FAQEditorProps {
    content: FAQSectionContent;
    onChange: (updates: Partial<FAQSectionContent>) => void;
}

export function FAQEditor({ content, onChange }: FAQEditorProps) {
    const faqs = content.faqs || [];

    const addFAQ = () => {
        onChange({
            faqs: [
                ...faqs,
                {
                    id: `faq-${Date.now()}`,
                    question: '',
                    answer: '',
                },
            ],
        });
    };

    const updateFAQ = (id: string, updates: Partial<typeof faqs[0]>) => {
        onChange({
            faqs: faqs.map((f) =>
                f.id === id ? { ...f, ...updates } : f
            ),
        });
    };

    const deleteFAQ = (id: string) => {
        onChange({
            faqs: faqs.filter((f) => f.id !== id),
        });
    };

    const moveFAQ = (id: string, direction: 'up' | 'down') => {
        const index = faqs.findIndex((f) => f.id === id);
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === faqs.length - 1)
        ) {
            return;
        }
        const newFAQs = [...faqs];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newFAQs[index], newFAQs[targetIndex]] = [newFAQs[targetIndex], newFAQs[index]];
        onChange({ faqs: newFAQs });
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
                    placeholder="Frequently Asked Questions"
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
                    placeholder="Find answers to common questions"
                />
            </div>

            <div className={styles.divider} />

            <label className={styles.label} style={{ marginBottom: 'var(--space-md)' }}>
                Questions & Answers ({faqs.length})
            </label>

            <div className={styles.arrayItems}>
                {faqs.map((faq, index) => (
                    <div key={faq.id} className={styles.arrayItem}>
                        <div className={styles.arrayItemHeader}>
                            <span className={styles.arrayItemTitle}>
                                Q{index + 1}
                            </span>
                            <div className={styles.arrayItemActions}>
                                <button
                                    type="button"
                                    className={styles.iconBtn}
                                    onClick={() => moveFAQ(faq.id, 'up')}
                                    disabled={index === 0}
                                    title="Move up"
                                >
                                    ↑
                                </button>
                                <button
                                    type="button"
                                    className={styles.iconBtn}
                                    onClick={() => moveFAQ(faq.id, 'down')}
                                    disabled={index === faqs.length - 1}
                                    title="Move down"
                                >
                                    ↓
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.iconBtn} ${styles.delete}`}
                                    onClick={() => deleteFAQ(faq.id)}
                                    title="Delete"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Question</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={faq.question}
                                onChange={(e) => updateFAQ(faq.id, { question: e.target.value })}
                                placeholder="How much does your service cost?"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Answer</label>
                            <textarea
                                className={styles.textarea}
                                value={faq.answer}
                                onChange={(e) => updateFAQ(faq.id, { answer: e.target.value })}
                                placeholder="Our pricing depends on..."
                                rows={3}
                            />
                        </div>
                    </div>
                ))}

                <button type="button" className={styles.addBtn} onClick={addFAQ}>
                    + Add FAQ
                </button>
            </div>
        </div>
    );
}

export default FAQEditor;
