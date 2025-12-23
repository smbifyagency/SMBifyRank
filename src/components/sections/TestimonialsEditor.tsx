// Testimonials Section Editor
'use client';

import React from 'react';
import { TestimonialsSectionContent } from '@/lib/types';
import styles from './SectionEditor.module.css';

interface TestimonialsEditorProps {
    content: TestimonialsSectionContent;
    onChange: (updates: Partial<TestimonialsSectionContent>) => void;
}

export function TestimonialsEditor({ content, onChange }: TestimonialsEditorProps) {
    const testimonials = content.testimonials || [];

    const addTestimonial = () => {
        onChange({
            testimonials: [
                ...testimonials,
                {
                    id: `testimonial-${Date.now()}`,
                    name: '',
                    quote: '',
                    rating: 5,
                },
            ],
        });
    };

    const updateTestimonial = (id: string, updates: Partial<typeof testimonials[0]>) => {
        onChange({
            testimonials: testimonials.map((t) =>
                t.id === id ? { ...t, ...updates } : t
            ),
        });
    };

    const deleteTestimonial = (id: string) => {
        onChange({
            testimonials: testimonials.filter((t) => t.id !== id),
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
                    placeholder="What Our Clients Say"
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
                    placeholder="Trusted by customers across the region"
                />
            </div>

            <div className={styles.divider} />

            <label className={styles.label} style={{ marginBottom: 'var(--space-md)' }}>
                Testimonials ({testimonials.length})
            </label>

            <div className={styles.arrayItems}>
                {testimonials.map((testimonial, index) => (
                    <div key={testimonial.id} className={styles.arrayItem}>
                        <div className={styles.arrayItemHeader}>
                            <span className={styles.arrayItemTitle}>
                                Testimonial {index + 1}
                            </span>
                            <button
                                type="button"
                                className={`${styles.iconBtn} ${styles.delete}`}
                                onClick={() => deleteTestimonial(testimonial.id)}
                                title="Delete"
                            >
                                ✕
                            </button>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Quote</label>
                            <textarea
                                className={styles.textarea}
                                value={testimonial.quote}
                                onChange={(e) => updateTestimonial(testimonial.id, { quote: e.target.value })}
                                placeholder="They did an amazing job..."
                                rows={3}
                            />
                        </div>

                        <div className={styles.inputRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Customer Name</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={testimonial.name}
                                    onChange={(e) => updateTestimonial(testimonial.id, { name: e.target.value })}
                                    placeholder="John Smith"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Company
                                    <span className={styles.labelHint}>Optional</span>
                                </label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={testimonial.company || ''}
                                    onChange={(e) => updateTestimonial(testimonial.id, { company: e.target.value })}
                                    placeholder="ABC Company"
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Rating</label>
                            <div className={styles.selectButtons}>
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <button
                                        key={rating}
                                        type="button"
                                        className={`${styles.selectBtn} ${testimonial.rating === rating ? styles.active : ''}`}
                                        onClick={() => updateTestimonial(testimonial.id, { rating })}
                                    >
                                        {'★'.repeat(rating)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Photo URL
                                <span className={styles.labelHint}>Optional</span>
                            </label>
                            <input
                                type="text"
                                className={styles.input}
                                value={testimonial.image || ''}
                                onChange={(e) => updateTestimonial(testimonial.id, { image: e.target.value || undefined })}
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                ))}

                <button type="button" className={styles.addBtn} onClick={addTestimonial}>
                    + Add Testimonial
                </button>
            </div>
        </div>
    );
}

export default TestimonialsEditor;
