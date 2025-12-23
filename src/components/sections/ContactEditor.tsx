// Contact Section Editor - Edit contact form settings
'use client';

import React from 'react';
import { ContactSectionContent } from '@/lib/types';
import styles from './SectionEditor.module.css';

interface ContactEditorProps {
    content: ContactSectionContent;
    onChange: (updates: Partial<ContactSectionContent>) => void;
    businessContext?: {
        phone?: string;
        email?: string;
    };
}

export function ContactEditor({ content, onChange, businessContext }: ContactEditorProps) {
    const formFields = content.formFields || [];

    const addField = () => {
        onChange({
            formFields: [
                ...formFields,
                {
                    name: `field-${Date.now()}`,
                    type: 'text',
                    label: '',
                    required: false,
                },
            ],
        });
    };

    const updateField = (index: number, updates: Partial<typeof formFields[0]>) => {
        const newFields = [...formFields];
        newFields[index] = { ...newFields[index], ...updates };
        onChange({ formFields: newFields });
    };

    const deleteField = (index: number) => {
        onChange({
            formFields: formFields.filter((_, i) => i !== index),
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
                    placeholder="Contact Us"
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
                    placeholder="Get in touch with us today"
                />
            </div>

            <div className={styles.divider} />

            <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-secondary)' }}>
                Contact Information
            </h4>

            <div className={styles.inputRow}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Phone Number</label>
                    <input
                        type="tel"
                        className={styles.input}
                        value={content.phone || businessContext?.phone || ''}
                        onChange={(e) => onChange({ phone: e.target.value })}
                        placeholder="(555) 123-4567"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Email Address</label>
                    <input
                        type="email"
                        className={styles.input}
                        value={content.email || businessContext?.email || ''}
                        onChange={(e) => onChange({ email: e.target.value })}
                        placeholder="contact@business.com"
                    />
                </div>
            </div>

            <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-secondary)' }}>
                Address
            </h4>

            <div className={styles.formGroup}>
                <label className={styles.label}>Street Address</label>
                <input
                    type="text"
                    className={styles.input}
                    value={content.address?.street || ''}
                    onChange={(e) => onChange({
                        address: { ...content.address, street: e.target.value, city: content.address?.city || '', state: content.address?.state || '', zip: content.address?.zip || '' }
                    })}
                    placeholder="123 Main St"
                />
            </div>

            <div className={styles.inputRow}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>City</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={content.address?.city || ''}
                        onChange={(e) => onChange({
                            address: { ...content.address, city: e.target.value, street: content.address?.street || '', state: content.address?.state || '', zip: content.address?.zip || '' }
                        })}
                        placeholder="Your City"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>State</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={content.address?.state || ''}
                        onChange={(e) => onChange({
                            address: { ...content.address, state: e.target.value, street: content.address?.street || '', city: content.address?.city || '', zip: content.address?.zip || '' }
                        })}
                        placeholder="CA"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>ZIP Code</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={content.address?.zip || ''}
                        onChange={(e) => onChange({
                            address: { ...content.address, zip: e.target.value, street: content.address?.street || '', city: content.address?.city || '', state: content.address?.state || '' }
                        })}
                        placeholder="12345"
                    />
                </div>
            </div>

            <div className={styles.formGroup}>
                <div className={styles.toggle}>
                    <label className={styles.toggleSwitch}>
                        <input
                            type="checkbox"
                            checked={content.showMap === true}
                            onChange={(e) => onChange({ showMap: e.target.checked })}
                        />
                        <span className={styles.toggleSlider} />
                    </label>
                    <span className={styles.toggleLabel}>Show Google Maps embed</span>
                </div>
            </div>

            <div className={styles.divider} />

            <label className={styles.label} style={{ marginBottom: 'var(--space-md)' }}>
                Form Fields ({formFields.length})
            </label>

            <div className={styles.arrayItems}>
                {formFields.map((field, index) => (
                    <div key={field.name} className={styles.arrayItem}>
                        <div className={styles.arrayItemHeader}>
                            <span className={styles.arrayItemTitle}>Field {index + 1}</span>
                            <button
                                type="button"
                                className={`${styles.iconBtn} ${styles.delete}`}
                                onClick={() => deleteField(index)}
                                title="Delete"
                            >
                                ✕
                            </button>
                        </div>

                        <div className={styles.inputRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Field Label</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={field.label}
                                    onChange={(e) => updateField(index, { label: e.target.value })}
                                    placeholder="Your Name"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Field Type</label>
                                <select
                                    className={styles.select}
                                    value={field.type}
                                    onChange={(e) => updateField(index, { type: e.target.value as typeof field.type })}
                                >
                                    <option value="text">Text</option>
                                    <option value="email">Email</option>
                                    <option value="phone">Phone</option>
                                    <option value="textarea">Text Area</option>
                                    <option value="select">Dropdown</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.toggle}>
                            <label className={styles.toggleSwitch}>
                                <input
                                    type="checkbox"
                                    checked={field.required === true}
                                    onChange={(e) => updateField(index, { required: e.target.checked })}
                                />
                                <span className={styles.toggleSlider} />
                            </label>
                            <span className={styles.toggleLabel}>Required field</span>
                        </div>
                    </div>
                ))}

                <button type="button" className={styles.addBtn} onClick={addField}>
                    + Add Form Field
                </button>
            </div>
        </div>
    );
}

export default ContactEditor;
